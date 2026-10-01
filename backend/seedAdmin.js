require('dotenv').config()
const bcrypt = require('bcryptjs')
const { sql } = require('./db')

async function seedAdmin() {
  console.log('👑 Seeding Admin Account into Neon PostgreSQL...')

  const email = 'wayflow@gmail.com'
  const plainPassword = 'admin123'
  const passwordHash = await bcrypt.hash(plainPassword, 10)

  const adminUser = {
    user_id: 'USR-ADMIN',
    email: email.toLowerCase().trim(),
    password_hash: passwordHash,
    full_name: 'WayFlow Administrator',
    role: 'Admin',
    facility: 'Regional HQ - Colombo',
    outlet_id: null,
    assigned_vehicle_id: null,
    phone: '+94 11 234 5678',
    status: 'Active',
    avatar: 'WA',
    joined_date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    requires_password_change: false,
  }

  // Insert or Update Admin
  const query = `
    INSERT INTO users (
      user_id, email, password_hash, full_name, role, facility,
      outlet_id, assigned_vehicle_id, phone, status, avatar, joined_date, requires_password_change
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = 'Admin',
      status = 'Active',
      requires_password_change = false;
  `

  await sql.query(query, [
    adminUser.user_id,
    adminUser.email,
    adminUser.password_hash,
    adminUser.full_name,
    adminUser.role,
    adminUser.facility,
    adminUser.outlet_id,
    adminUser.assigned_vehicle_id,
    adminUser.phone,
    adminUser.status,
    adminUser.avatar,
    adminUser.joined_date,
    adminUser.requires_password_change,
  ])

  console.log('✔ Admin user seeded successfully!')
  console.log(`   Email: ${adminUser.email}`)
  console.log(`   Password: ${plainPassword}`)
  console.log(`   Role: ${adminUser.role}`)
}

if (require.main === module) {
  seedAdmin()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed admin:', err)
      process.exit(1)
    })
}

module.exports = { seedAdmin }
