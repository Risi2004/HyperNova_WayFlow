require('dotenv').config()
const { neon } = require('@neondatabase/serverless')

const databaseUrl = process.env.DATABASE_URL

let sql = null

if (databaseUrl) {
  try {
    sql = neon(databaseUrl)
  } catch (error) {
    console.error('Failed to initialize Neon database client:', error.message)
  }
} else {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  DATABASE_URL is not set in backend/.env. Please configure your Neon PostgreSQL connection string.')
}

async function testConnection() {
  if (!sql) {
    return {
      connected: false,
      message: 'DATABASE_URL is missing. Please add your Neon connection string in .env',
    }
  }

  try {
    const result = await sql`SELECT NOW() as current_time, version() as version`
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
  testConnection,
}
