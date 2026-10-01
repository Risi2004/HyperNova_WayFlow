const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'wayflow_jwt_secret_production_key_2026_tech_triathlon'

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing or invalid. Please sign in.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please sign in again.' })
  }
}

// Role-based authorization middleware
function requireRole(...allowedRoles) {
  const roles = allowedRoles.flat().map((r) => (typeof r === 'string' ? r.toLowerCase() : ''))
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const userRole = (req.user.role || '').toLowerCase()
    const isAllowed = roles.includes(userRole)

    if (!isAllowed) {
      return res.status(403).json({
        error: `Access denied. Role '${req.user.role}' is not authorized for this resource.`,
      })
    }

    next()
  }
}

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
      facility: user.facility,
      outletId: user.outlet_id,
      assignedVehicleId: user.assigned_vehicle_id,
      requiresPasswordChange: user.requires_password_change,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

module.exports = {
  verifyToken,
  requireRole,
  generateToken,
  JWT_SECRET,
}
