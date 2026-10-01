require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { sql, testConnection } = require('./db')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

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
    },
  })
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
app.listen(PORT, async () => {
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

module.exports = { app, sql }
