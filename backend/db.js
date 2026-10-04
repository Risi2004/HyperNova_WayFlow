require('dotenv').config()
const { Pool, types } = require('pg')

// Keep DATE columns as plain 'YYYY-MM-DD' strings. Converting them to JS Date objects
// shifts the day depending on the server timezone, which breaks delivery-date logic.
types.setTypeParser(1082, (value) => value)

// pg treats sslmode=require as verify-full and warns about it; state that mode explicitly
// (same behaviour, no warning on every start).
const databaseUrl = process.env.DATABASE_URL?.replace(/sslmode=(require|prefer|verify-ca)\b/, 'sslmode=verify-full')

let pool = null
let sql = null

if (databaseUrl) {
  try {
    // Works for both Neon (sslmode=require in the URL) and a plain Postgres container (Docker Compose).
    // Opening a TLS connection to a remote database costs well over a second, so connections are
    // kept open instead of being dropped after pg's default 10 s idle timeout. `min` connections
    // are never closed for idleness; TCP keep-alive stops load balancers silently dropping them.
    const max = Number(process.env.DB_POOL_MAX || 20)
    pool = new Pool({
      connectionString: databaseUrl,
      max,
      min: Math.min(max, Number(process.env.DB_POOL_MIN || 10)),
      idleTimeoutMillis: Number(process.env.DB_POOL_IDLE_MS || 300000),
      connectionTimeoutMillis: 15000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    })
    pool.on('error', (err) => console.error('Postgres pool error:', err.message))

    // Same calling convention the routes already use: sql.query(text, params) -> rows[]
    sql = {
      query: async (text, params = []) => (await pool.query(text, params)).rows,
    }
  } catch (error) {
    console.error('Failed to initialize Postgres client:', error.message)
  }
} else {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  DATABASE_URL is not set in backend/.env. Please configure your PostgreSQL connection string.')
}

// Runs fn inside a single database transaction. fn receives a client with the same
// query(text, params) -> rows[] interface as `sql`. Rolls back if fn throws.
async function withTransaction(fn) {
  if (!pool) throw new Error('Database connection not initialized. Please set DATABASE_URL.')
  const client = await pool.connect()
  const tx = { query: async (text, params = []) => (await client.query(text, params)).rows }
  try {
    await client.query('BEGIN')
    const result = await fn(tx)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
}

// Opens the pool's minimum connections up front so the first requests don't each pay the
// connection handshake.
async function warmPool() {
  if (!pool) return
  const clients = await Promise.all(Array.from({ length: pool.options.min }, () => pool.connect()))
  clients.forEach((c) => c.release())
}

async function testConnection() {
  if (!sql) {
    return {
      connected: false,
      message: 'DATABASE_URL is missing. Please add your PostgreSQL connection string in .env',
    }
  }

  try {
    const result = await sql.query('SELECT NOW() as current_time, version() as version')
    return {
      connected: true,
      time: result[0]?.current_time,
      version: result[0]?.version,
    }
  } catch (err) {
    return {
      connected: false,
      error: err.message,
    }
  }
}

module.exports = {
  sql,
  pool,
  withTransaction,
  warmPool,
  testConnection,
}
