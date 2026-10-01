const express = require('express')
const { sql } = require('../db')

const router = express.Router()

// GET /api/reference/outlets - All 120 outlets with district, depot, brand, dock type
router.get('/outlets', async (req, res) => {
  try {
    const outlets = await sql.query(`
      SELECT 
        outlet_id,
        brand,
        district,
        depot,
        dock_type,
        parking_constraint,
        mall_window,
        window_open_time,
        window_close_time
      FROM outlets
      ORDER BY outlet_id ASC
    `)

    res.json({
      status: 'success',
      count: outlets.length,
      outlets,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch outlets: ' + err.message })
  }
})

// GET /api/reference/vehicles - All 60 vehicles with type, temp, weight/vol caps, depot
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await sql.query(`
      SELECT 
        vehicle_id,
        type,
        temp,
        weight_cap_kg,
        volume_cap_m3,
        fuel_type,
        km_per_l,
        weekly_fuel_quota_l,
        depot
      FROM vehicles
      ORDER BY vehicle_id ASC
    `)

    res.json({
      status: 'success',
      count: vehicles.length,
      vehicles,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles: ' + err.message })
  }
})

module.exports = router
