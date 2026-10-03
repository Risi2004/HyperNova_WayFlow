const express = require('express')
const bcrypt = require('bcryptjs')
const { sql } = require('../db')
const { verifyToken, requireRole } = require('../middleware/auth')
const { sendWelcomeEmail, sendStatusNotificationEmail } = require('../mailer')

const router = express.Router()

// All user management routes require Admin authorization
router.use(verifyToken, requireRole('Admin'))

// GET /api/users - Fetch all users from Neon
router.get('/', async (req, res) => {
  try {
    const users = await sql.query(`
      SELECT 
        u.user_id as id,
        u.email,
        u.full_name as name,
        u.role,
        u.facility,
        u.outlet_id,
        u.assigned_vehicle_id,
        u.phone,
        u.status,
        u.avatar,
        u.joined_date as "joinedDate",
        u.requires_password_change,
        u.created_at
      FROM users u
      ORDER BY u.created_at DESC
    `)

    res.json({
      status: 'success',
      count: users.length,
      users,
    })
  } catch (err) {
    console.error('Fetch users error:', err)
    res.status(500).json({ error: 'Failed to retrieve users: ' + err.message })
  }
})

// GET /api/users/activity - recent account provisioning and order decisions across all roles
router.get('/activity', async (req, res) => {
  try {
    const activity = await sql.query(`
      SELECT * FROM (
        SELECT 'account' AS kind, u.full_name AS actor_name, u.role AS actor_role,
               NULL::varchar AS order_id, NULL::varchar AS from_status, NULL::varchar AS to_status,
               u.facility AS note, u.created_at AS at
        FROM users u
        UNION ALL
        SELECT 'order' AS kind, COALESCE(u.full_name, 'System') AS actor_name, e.actor_role,
               e.order_id, e.from_status, e.to_status, e.note, e.created_at AS at
        FROM order_status_events e
        LEFT JOIN users u ON u.user_id = e.actor_user_id
      ) feed
      ORDER BY at DESC NULLS LAST
      LIMIT 6
    `)
    res.json({ activity })
  } catch (err) {
    res.status(500).json({ error: 'Failed to load activity: ' + err.message })
  }
})

// POST /api/users - Provision new user into Neon and send credential email
router.post('/', async (req, res) => {
  const {
    name,
    email,
    role,
    facility,
    outlet_id,
    assigned_vehicle_id,
    phone,
    status = 'Active',
    temporaryPassword,
  } = req.body

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and operational role are required.' })
  }

  // Generate temporary password if not provided
  const tempPass = temporaryPassword || `WayFlow@${Math.floor(1000 + Math.random() * 9000)}`

  try {
    // Check if email already registered
    const existing = await sql.query('SELECT user_id FROM users WHERE LOWER(email) = LOWER($1)', [
      email.trim(),
    ])
    if (existing.length > 0) {
      return res.status(409).json({ error: `An account with email '${email}' already exists.` })
    }

    const passwordHash = await bcrypt.hash(tempPass, 10)
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    const randomSuffix = Math.floor(100 + Math.random() * 900)
    const userId = `USR-${randomSuffix}`

    const joinedDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    const finalFacility = facility || (outlet_id ? `Store ${outlet_id}` : 'General Fleet Hub')

    const insertQuery = `
      INSERT INTO users (
        user_id, email, password_hash, full_name, role, facility,
        outlet_id, assigned_vehicle_id, phone, status, avatar, joined_date, requires_password_change
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true)
      RETURNING user_id, email, full_name, role, facility, outlet_id, assigned_vehicle_id, phone, status, avatar, joined_date, requires_password_change;
    `

    const result = await sql.query(insertQuery, [
      userId,
      email.trim().toLowerCase(),
      passwordHash,
      name.trim(),
      role,
      finalFacility,
      outlet_id || null,
      assigned_vehicle_id || null,
      phone || null,
      status,
      initials || 'WF',
      joinedDate,
    ])

    const newUser = result[0]

    // Dispatch welcome email asynchronously with temporary password
    const emailResult = await sendWelcomeEmail({
      toEmail: newUser.email,
      fullName: newUser.full_name,
      role: newUser.role,
      facility: newUser.facility,
      tempPassword: tempPass,
    })

    res.status(201).json({
      status: 'success',
      message: `User '${newUser.full_name}' provisioned successfully!`,
      user: {
        id: newUser.user_id,
        email: newUser.email,
        name: newUser.full_name,
        role: newUser.role,
        facility: newUser.facility,
        outlet_id: newUser.outlet_id,
        assigned_vehicle_id: newUser.assigned_vehicle_id,
        phone: newUser.phone,
        status: newUser.status,
        avatar: newUser.avatar,
        joinedDate: newUser.joined_date,
        requires_password_change: newUser.requires_password_change,
      },
      temporaryPassword: tempPass,
      emailDispatch: emailResult,
    })
  } catch (err) {
    console.error('Provision user error:', err)
    res.status(500).json({ error: 'Failed to provision user: ' + err.message })
  }
})

// PUT /api/users/:id - Update existing user
router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { name, role, facility, outlet_id, assigned_vehicle_id, phone, status, statusReason } = req.body

  try {
    // 1. Fetch previous user state to compare status
    const previous = await sql.query(
      `SELECT user_id, email, full_name, role, facility, status FROM users WHERE user_id = $1`,
      [id]
    )

    if (previous.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const prevUser = previous[0]

    // 2. Perform database update
    const updateQuery = `
      UPDATE users
      SET 
        full_name = COALESCE($1, full_name),
        role = COALESCE($2, role),
        facility = COALESCE($3, facility),
        outlet_id = CASE WHEN $9 THEN $4 ELSE outlet_id END,
        assigned_vehicle_id = CASE WHEN $10 THEN $5 ELSE assigned_vehicle_id END,
        phone = COALESCE($6, phone),
        status = COALESCE($7, status)
      WHERE user_id = $8
      RETURNING user_id, email, full_name, role, facility, outlet_id, assigned_vehicle_id, phone, status, avatar, joined_date, requires_password_change;
    `

    const result = await sql.query(updateQuery, [
      name,
      role,
      facility,
      outlet_id || null,
      assigned_vehicle_id || null,
      phone,
      status,
      id,
      // Partial updates (e.g. the status toggle) omit these keys and must not unlink
      // a store manager from their outlet or a driver from their vehicle.
      outlet_id !== undefined,
      assigned_vehicle_id !== undefined,
    ])

    const u = result[0]

    // 3. Dispatch status notification email if status changed to Active or Inactive
    let emailNotice = null
    const prevStatusNorm = (prevUser.status || '').toLowerCase()
    const nextStatusNorm = (status || '').toLowerCase()

    if (status && prevStatusNorm !== nextStatusNorm) {
      try {
        emailNotice = await sendStatusNotificationEmail({
          toEmail: u.email,
          fullName: u.full_name,
          role: u.role,
          facility: u.facility,
          newStatus: u.status,
          reason: statusReason || undefined,
        })
      } catch (mailErr) {
        console.warn('Failed to send status update email notice:', mailErr.message)
      }
    }

    res.json({
      status: 'success',
      message: `User updated successfully.${emailNotice?.success ? ` Email notification sent to ${u.email}.` : ''}`,
      emailNotice,
      user: {
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
        joinedDate: u.joined_date,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user: ' + err.message })
  }
})

// DELETE /api/users/:id - Delete user from Neon
router.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const result = await sql.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id, email', [id])
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }
    res.json({ status: 'success', message: 'User removed from database.' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user: ' + err.message })
  }
})

module.exports = router
