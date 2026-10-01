require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { sql, testConnection } = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

// Import API Routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const referenceRoutes = require('./routes/referenceRoutes')
const productRoutes = require('./routes/productRoutes')

// Middleware
app.use(cors())
app.use(express.json())

// Mount API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/reference', referenceRoutes)
app.use('/api/products', productRoutes)

// Root Route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'WayFlow Delivery Intelligence Backend',
    database: 'Neon Serverless PostgreSQL',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      dbCheck: '/api/db-check',
      dbSummary: '/api/db-summary',
    },
  })
})

// Database Summary Endpoint (Table Row Counts)
app.get('/api/db-summary', async (req, res) => {
  try {
    const tables = [
      'operating_calendar',
      'district_travel',
      'service_allowance',
      'outlets',
      'vehicles',
      'traffic_speed_index',
      'road_disruptions',
      'users',
      'products',
      'catalog_products',
      'orders',
      'order_items',
      'trips',
      'trip_stops',
      'order_deferrals',
      'delivery_records',
      'receipt_confirmations',
    ]
    const counts = await Promise.all(
      tables.map(async (t) => {
        const result = await sql.query(`SELECT count(*)::int as count FROM ${t}`)
        return { table: t, count: result[0].count }
      })
    )
    res.json({
      status: 'success',
      database: 'Neon PostgreSQL',
      tables: counts,
    })
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
  }
})

// System Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

// Neon Database Health & Connectivity Check
app.get('/api/db-check', async (req, res) => {
  const check = await testConnection()
  if (check.connected) {
    return res.json({
      status: 'connected',
      database: 'Neon PostgreSQL',
      currentTime: check.time,
      postgresVersion: check.version,
    })
  }

  return res.status(503).json({
    status: 'disconnected',
    database: 'Neon PostgreSQL',
    error: check.error || check.message,
    hint: 'Ensure your DATABASE_URL in backend/.env is set to your Neon connection string.',
  })
})

// Start Server
const server = app.listen(PORT, async () => {
  console.log(`\n🚀 WayFlow Backend server running on: http://localhost:${PORT}`)
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`)
  console.log(`🗄️  Neon DB Check: http://localhost:${PORT}/api/db-check\n`)

  // Check Neon database connectivity on startup
  const dbStatus = await testConnection()
  if (dbStatus.connected) {
    console.log(`\x1b[32m✔ Successfully connected to Neon PostgreSQL database!\x1b[0m\n`)
  } else {
    console.log(`\x1b[33mℹ️  Neon DB not connected yet: ${dbStatus.error || dbStatus.message}\x1b[0m`)
    console.log(`   Paste your connection string into backend/.env (DATABASE_URL=...)\n`)
  }
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n\x1b[31m❌ Port ${PORT} is already in use by another running Node process.\x1b[0m`)
    console.error(`   To free it up, terminate the existing process or run:`)
    console.error(`   Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force\n`)
    process.exit(1)
  } else {
    console.error(`❌ Server error:`, err.message)
    process.exit(1)
  }
})

module.exports = { app, server, sql }
