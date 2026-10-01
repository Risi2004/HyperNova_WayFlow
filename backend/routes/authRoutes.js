const express = require('express')
const bcrypt = require('bcryptjs')
const { sql } = require('../db')
const { generateToken, verifyToken } = require('../middleware/auth')

const router = express.Router()

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
      user: {
        id: user.user_id,
        email: user.email,
        name: user.full_name,
        role: user.role,
        facility: user.facility,
        outlet_id: user.outlet_id,
        assigned_vehicle_id: user.assigned_vehicle_id,
        phone: user.phone,
        status: user.status,
        avatar: user.avatar,
        requires_password_change: user.requires_password_change,
      },
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

// GET /api/auth/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const users = await sql.query(
      `SELECT user_id, email, full_name, role, facility, outlet_id,
              assigned_vehicle_id, phone, status, avatar, requires_password_change
       FROM users WHERE user_id = $1`,
      [req.user.userId]
    )

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = users[0]
    res.json({
      id: user.user_id,
      email: user.email,
      name: user.full_name,
      role: user.role,
      facility: user.facility,
      outlet_id: user.outlet_id,
      assigned_vehicle_id: user.assigned_vehicle_id,
      phone: user.phone,
      status: user.status,
      avatar: user.avatar,
      requires_password_change: user.requires_password_change,
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
