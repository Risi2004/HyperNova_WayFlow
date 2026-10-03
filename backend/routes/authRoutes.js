const express = require('express')
const bcrypt = require('bcryptjs')
const { sql } = require('../db')
const { generateToken, verifyToken } = require('../middleware/auth')

const router = express.Router()

// Public profile of a user, including the outlet (store managers) or vehicle (drivers) they are
// linked to, so every screen can show who is signed in and where they work.
async function loadProfile(userId) {
  const rows = await sql.query(
    `SELECT u.user_id, u.email, u.full_name, u.role, u.facility, u.outlet_id, u.assigned_vehicle_id,
            u.phone, u.status, u.avatar, u.requires_password_change,
            o.brand AS outlet_brand, o.district AS outlet_district, o.depot AS outlet_depot,
            o.dock_type AS outlet_dock_type, o.parking_constraint AS outlet_parking_constraint,
            o.mall_window AS outlet_mall_window,
            v.type AS vehicle_type, v.temp AS vehicle_temp, v.depot AS vehicle_depot
     FROM users u
     LEFT JOIN outlets o ON o.outlet_id = u.outlet_id
     LEFT JOIN vehicles v ON v.vehicle_id = u.assigned_vehicle_id
     WHERE u.user_id = $1`,
    [userId]
  )
  const u = rows[0]
  if (!u) return null
  return {
    id: u.user_id,
    email: u.email,
    name: u.full_name,
    role: u.role,
    facility: u.facility,
    outlet_id: u.outlet_id,
    assigned_vehicle_id: u.assigned_vehicle_id,
    phone: u.phone,
    status: u.status,
    avatar: u.avatar,
    requires_password_change: u.requires_password_change,
    outlet: u.outlet_id && u.outlet_brand
      ? {
        outlet_id: u.outlet_id,
        brand: u.outlet_brand,
        district: u.outlet_district,
        depot: u.outlet_depot,
        dock_type: u.outlet_dock_type,
        parking_constraint: u.outlet_parking_constraint,
        mall_window: u.outlet_mall_window,
      }
      : null,
    vehicle: u.assigned_vehicle_id && u.vehicle_type
      ? { vehicle_id: u.assigned_vehicle_id, type: u.vehicle_type, temp: u.vehicle_temp, depot: u.vehicle_depot }
      : null,
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter both email and password.' })
  }

  try {
    const users = await sql.query(
      `SELECT user_id, email, password_hash, full_name, role, facility, outlet_id,
              assigned_vehicle_id, phone, status, avatar, requires_password_change
       FROM users WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: 'No account found with this email address.' })
    }

    const user = users[0]

    if (user.status === 'Inactive' || user.status === 'Suspended') {
      return res.status(403).json({
        error: `Account is ${user.status}. Please contact your system administrator.`,
      })
    }

    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password. Please verify and try again.' })
    }

    const token = generateToken(user)

    res.json({
      success: true,
      token,
      user: await loadProfile(user.user_id),
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Internal authentication error: ' + err.message })
  }
})

// POST /api/auth/change-password
router.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const userId = req.user.userId

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' })
  }

  try {
    const users = await sql.query('SELECT password_hash FROM users WHERE user_id = $1', [userId])
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const user = users[0]

    // If oldPassword is provided, verify it
    if (oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password_hash)
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect.' })
      }
    }

    const newHash = await bcrypt.hash(newPassword, 10)
    await sql.query(
      `UPDATE users
       SET password_hash = $1, requires_password_change = false
       WHERE user_id = $2`,
      [newHash, userId]
    )

    res.json({
      success: true,
      message: 'Password changed successfully! You can now proceed to your console.',
    })
  } catch (err) {
    console.error('Password change error:', err)
    res.status(500).json({ error: 'Failed to update password: ' + err.message })
  }
})

// GET /api/auth/activity — the signed-in user's most recent order decisions (audit trail).
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const events = await sql.query(
      `SELECT e.order_id, e.from_status, e.to_status, e.note, e.created_at
       FROM order_status_events e
       WHERE e.actor_user_id = $1
       ORDER BY e.created_at DESC, e.event_id DESC
       LIMIT 5`,
      [req.user.userId]
    )
    res.json({ events })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const profile = await loadProfile(req.user.userId)
    if (!profile) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(profile)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
