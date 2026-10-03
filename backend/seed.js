require('dotenv').config()
const fs = require('fs')
const path = require('path')
const { sql } = require('./db')
const bcrypt = require('bcryptjs')
const { createSchema } = require('./schema')
const { seedProducts } = require('./seedProducts')
const { generatePeakDay } = require('./services/planner/scenario')
const { toColomboParts, now, addDays } = require('./services/orderSchedule')

// Helper to parse standard CSV text into array of objects
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8').trim()
  const lines = content.split(/\r?\n/)
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim())
  const rows = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Handle commas inside fields if any, otherwise simple split
    const values = []
    let inQuotes = false
    let current = ''

    for (let char of line) {
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }
    values.push(current.trim())

    const row = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx] : null
    })
    rows.push(row)
  }

  return rows
}

// Helper to execute parameterized batch inserts
async function batchInsert(tableName, columns, rows, batchSize = 400) {
  if (rows.length === 0) return

  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize)
    const valuePlaceholders = []
    const flatValues = []
    let paramIndex = 1

    for (const row of chunk) {
      const rowParams = []
      for (const col of columns) {
        rowParams.push(`$${paramIndex++}`)
        flatValues.push(row[col])
      }
      valuePlaceholders.push(`(${rowParams.join(', ')})`)
    }

    const query = `
      INSERT INTO ${tableName} (${columns.join(', ')})
      VALUES ${valuePlaceholders.join(',\n')}
      ON CONFLICT DO NOTHING;
    `
    await sql.query(query, flatValues)
  }
}

async function seedDatabase() {
  console.log('🌱 Starting WayFlow Database Seeding...\n')
  await createSchema()
  const datasetsDir = process.env.DATASETS_DIR || path.resolve(__dirname, '..', 'datasets')

  // 1. Seed District Travel (12 rows)
  console.log('📍 Seeding district_travel...')
  const districtRows = parseCSV(path.join(datasetsDir, 'district_travel.csv')).map((r) => ({
    district: r.district,
    depot: r.depot,
    road_class: r.road_class,
    free_flow_kmh: parseFloat(r.free_flow_kmh),
    depot_to_district_km: parseFloat(r.depot_to_district_km),
    depot_to_district_freeflow_min: parseInt(r.depot_to_district_freeflow_min, 10),
    inter_stop_km: parseFloat(r.inter_stop_km),
    inter_stop_freeflow_min: parseInt(r.inter_stop_freeflow_min, 10),
  }))
  await batchInsert(
    'district_travel',
    [
      'district',
      'depot',
      'road_class',
      'free_flow_kmh',
      'depot_to_district_km',
      'depot_to_district_freeflow_min',
      'inter_stop_km',
      'inter_stop_freeflow_min',
    ],
    districtRows
  )
  console.log(`✔ Seeded ${districtRows.length} district_travel records.`)

  // 2. Seed Service Allowance (9 rows)
  console.log('⏱️  Seeding service_allowance...')
  const allowanceRows = parseCSV(path.join(datasetsDir, 'service_allowance.csv')).map((r) => ({
    brand: r.brand,
    dock_type: r.dock_type,
    service_allowance_min: parseInt(r.service_allowance_min, 10),
  }))
  await batchInsert('service_allowance', ['brand', 'dock_type', 'service_allowance_min'], allowanceRows)
  console.log(`✔ Seeded ${allowanceRows.length} service_allowance records.`)

  // 3. Seed Outlets (120 rows)
  console.log('🏪 Seeding outlets...')
  const outletRows = parseCSV(path.join(datasetsDir, 'outlets.csv')).map((r) => ({
    outlet_id: r.outlet_id,
    brand: r.brand,
    district: r.district,
    depot: r.depot,
    dock_type: r.dock_type,
    parking_constraint: r.parking_constraint,
    mall_window: r.mall_window || null,
    window_open_time: r.window_open_time,
    window_close_time: r.window_close_time,
  }))
  await batchInsert(
    'outlets',
    [
      'outlet_id',
      'brand',
      'district',
      'depot',
      'dock_type',
      'parking_constraint',
      'mall_window',
      'window_open_time',
      'window_close_time',
    ],
    outletRows
  )
  console.log(`✔ Seeded ${outletRows.length} outlets.`)

  // 4. Seed Vehicles (60 rows)
  console.log('🚛 Seeding vehicles...')
  const vehicleRows = parseCSV(path.join(datasetsDir, 'vehicles.csv')).map((r) => ({
    vehicle_id: r.vehicle_id,
    type: r.type,
    temp: r.temp,
    weight_cap_kg: parseFloat(r.weight_cap_kg),
    volume_cap_m3: parseFloat(r.volume_cap_m3),
    fuel_type: r.fuel_type || 'diesel',
    km_per_l: parseFloat(r.km_per_l),
    weekly_fuel_quota_l: parseFloat(r.weekly_fuel_quota_l),
    depot: r.depot,
    is_active: true,
  }))
  await batchInsert(
    'vehicles',
    [
      'vehicle_id',
      'type',
      'temp',
      'weight_cap_kg',
      'volume_cap_m3',
      'fuel_type',
      'km_per_l',
      'weekly_fuel_quota_l',
      'depot',
      'is_active',
    ],
    vehicleRows
  )
  console.log(`✔ Seeded ${vehicleRows.length} vehicles.`)

  // 5. Seed Calendar (910 rows + extend to October 2026 for hackathon active dates)
  console.log('📅 Seeding operating_calendar...')
  const calendarRows = parseCSV(path.join(datasetsDir, 'calendar.csv')).map((r) => ({
    date: r.date,
    dow: parseInt(r.dow, 10),
    dow_name: r.dow_name,
    is_weekend: r.is_weekend === '1',
    iso_year: parseInt(r.iso_year, 10),
    iso_week: parseInt(r.iso_week, 10),
    is_payday: r.is_payday === '1',
    festival: r.festival || null,
    festival_ramp: parseFloat(r.festival_ramp || 0),
    is_holiday: r.is_holiday === '1',
    monsoon: r.monsoon === '1',
    is_operating: r.is_operating === '1',
  }))

  // Auto-extend calendar to 2026-10-31 so Sep/Oct 2026 dates used in frontend/hackathon operate cleanly
  const lastRecorded = new Date(calendarRows[calendarRows.length - 1].date)
  const targetEnd = new Date('2026-10-31')
  const DOW_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  let curr = new Date(lastRecorded)
  curr.setDate(curr.getDate() + 1)

  while (curr <= targetEnd) {
    const yyyy = curr.getFullYear()
    const mm = String(curr.getMonth() + 1).padStart(2, '0')
    const dd = String(curr.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    // JavaScript day: 0=Sun, 1=Mon... convert to 0=Mon ... 6=Sun
    const jsDay = curr.getDay()
    const dow = (jsDay + 6) % 7
    const dow_name = DOW_NAMES[dow]
    const is_weekend = dow >= 5
    const is_operating = dow !== 6 // Operates Mon-Sat

    // ISO week estimation
    const firstDayOfYear = new Date(yyyy, 0, 1)
    const pastDaysOfYear = (curr - firstDayOfYear) / 86400000
    const iso_week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)

    calendarRows.push({
      date: dateStr,
      dow,
      dow_name,
      is_weekend,
      iso_year: yyyy,
      iso_week: iso_week > 52 ? 52 : iso_week,
      is_payday: dd === '25' || dd === '28',
      festival: null,
      festival_ramp: 0.0,
      is_holiday: is_weekend,
      monsoon: curr.getMonth() >= 4 && curr.getMonth() <= 8, // Monsoon season
      is_operating,
    })

    curr.setDate(curr.getDate() + 1)
  }

  await batchInsert(
    'operating_calendar',
    [
      'date',
      'dow',
      'dow_name',
      'is_weekend',
      'iso_year',
      'iso_week',
      'is_payday',
      'festival',
      'festival_ramp',
      'is_holiday',
      'monsoon',
      'is_operating',
    ],
    calendarRows,
    300
  )
  console.log(`✔ Seeded ${calendarRows.length} operating_calendar records (extended through Oct 2026).`)

  // 6. Seed Traffic Speed Index (576 rows)
  console.log('🚦 Seeding traffic_speed_index...')
  const trafficRows = parseCSV(path.join(datasetsDir, 'traffic_speed.csv')).map((r) => ({
    district: r.district,
    hour: parseInt(r.hour, 10),
    monsoon: parseInt(r.monsoon, 10),
    speed_index: parseFloat(r.speed_index),
  }))
  await batchInsert('traffic_speed_index', ['district', 'hour', 'monsoon', 'speed_index'], trafficRows, 300)
  console.log(`✔ Seeded ${trafficRows.length} traffic_speed_index records.`)

  // 7. Seed Road Disruptions (10,920 rows)
  console.log('🚧 Seeding road_disruptions (10,920 records)...')
  const disruptionRows = parseCSV(path.join(datasetsDir, 'road_conditions.csv')).map((r) => ({
    district: r.district,
    date: r.date,
    disruption_index: parseFloat(r.disruption_index),
  }))
  await batchInsert('road_disruptions', ['district', 'date', 'disruption_index'], disruptionRows, 400)
  console.log(`✔ Seeded ${disruptionRows.length} road_disruptions records.`)

  // 8. Seed Default Users (Supporting the 4 Roles + Admin)
  console.log('👤 Seeding default users...')
  const initialUsers = [
    {
      user_id: 'USR-101',
      email: 'alex.vance@wayflow.internal',
      password_hash: 'admin123', // In production or demo, pre-set test credentials
      full_name: 'Alexander Vance',
      role: 'Admin',
      facility: 'Regional HQ - Colombo',
      outlet_id: null,
      phone: '+94 11 234 5678',
      status: 'Active',
      avatar: 'AV',
      joined_date: '15 Jan 2025',
    },
    {
      user_id: 'USR-102',
      email: 'kasun.fernando@wayflow.internal',
      password_hash: 'dispatcher123',
      full_name: 'Kasun Fernando',
      role: 'Dispatcher',
      facility: 'Peliyagoda Central Planning Hub',
      outlet_id: null,
      phone: '+94 77 123 4567',
      status: 'Active',
      avatar: 'KF',
      joined_date: '02 Feb 2025',
    },
    {
      user_id: 'USR-103',
      email: 'rohan.j@wayflow.internal',
      password_hash: 'dispatcher123',
      full_name: 'Rohan Jayawardena',
      role: 'Dispatcher',
      facility: 'Kandy Regional Planning Hub',
      outlet_id: null,
      phone: '+94 77 998 1122',
      status: 'Active',
      avatar: 'RJ',
      joined_date: '18 Feb 2025',
    },
    {
      user_id: 'USR-104',
      email: 'sarah.perera@wayflow.internal',
      password_hash: 'store123',
      full_name: 'Sarah Perera',
      role: 'Store Manager',
      facility: 'Store OUT001 - Colombo (Fresh)',
      outlet_id: 'OUT001',
      phone: '+94 71 890 2234',
      status: 'Active',
      avatar: 'SP',
      joined_date: '10 Mar 2025',
    },
    {
      user_id: 'USR-105',
      email: 'nimali.r@wayflow.internal',
      password_hash: 'store123',
      full_name: 'Nimali Rathnayake',
      role: 'Store Manager',
      facility: 'Store OUT081 - Kandy (Fresh)',
      outlet_id: 'OUT081',
      phone: '+94 72 901 3345',
      status: 'Active',
      avatar: 'NR',
      joined_date: '22 Apr 2025',
    },
    {
      user_id: 'USR-106',
      email: 'jordan.davis@wayflow.internal',
      password_hash: 'loader123',
      full_name: 'Jordan Davis',
      role: 'Loader',
      facility: 'Peliyagoda DC - Bay 02 (Chilled / Reefer)',
      outlet_id: null,
      phone: '+94 77 342 1092',
      status: 'Active',
      avatar: 'JD',
      joined_date: '05 May 2025',
    },
    {
      user_id: 'USR-107',
      email: 'praveen.w@wayflow.internal',
      password_hash: 'loader123',
      full_name: 'Praveen Wickrama',
      role: 'Loader',
      facility: 'Kandy Hub - Bay 01 (Ambient Dry-Box)',
      outlet_id: null,
      phone: '+94 75 443 2190',
      status: 'Active',
      avatar: 'PW',
      joined_date: '14 Jun 2025',
    },
    {
      user_id: 'USR-108',
      email: 'marcus.vance@wayflow.internal',
      password_hash: 'driver123',
      full_name: 'Marcus Vance',
      role: 'Driver',
      facility: 'Peliyagoda Fleet Hub (VEH035)',
      outlet_id: null,
      assigned_vehicle_id: 'VEH035',
      phone: '+94 76 554 9912',
      status: 'Active',
      avatar: 'MV',
      joined_date: '19 Jul 2025',
    },
    {
      user_id: 'USR-109',
      email: 'dinesh.silva@wayflow.internal',
      password_hash: 'driver123',
      full_name: 'Dinesh Silva',
      role: 'Driver',
      facility: 'Peliyagoda Fleet Hub (VEH009)',
      outlet_id: null,
      assigned_vehicle_id: 'VEH009',
      phone: '+94 70 887 6543',
      status: 'Active',
      avatar: 'DS',
      joined_date: '29 Aug 2025',
    },
  ]
  // Store bcrypt hashes; the plain values above are the documented demo passwords.
  for (const user of initialUsers) {
    user.password_hash = await bcrypt.hash(user.password_hash, 10)
  }
  await batchInsert(
    'users',
    [
      'user_id',
      'email',
      'password_hash',
      'full_name',
      'role',
      'facility',
      'outlet_id',
      'assigned_vehicle_id',
      'phone',
      'status',
      'avatar',
      'joined_date',
    ],
    initialUsers.map((u) => ({ assigned_vehicle_id: null, ...u }))
  )
  console.log(`✔ Seeded ${initialUsers.length} system users across all roles.`)

  // 9. Seed Catalog Products (Fresh, Style, Tech)
  console.log('📦 Seeding catalog_products...')
  const catalogProducts = [
    // Fresh
    {
      brand: 'Fresh',
      sku: 'GRD-RIC-90410',
      name: 'Premium White Rice 5kg',
      category: 'Ambient',
      temp_requirement: 'ambient',
      weight_per_unit_kg: 50.0,
      volume_per_unit_m3: 0.08,
      pack_description: '10 Bags / Case: Groceries',
    },
    {
      brand: 'Fresh',
      sku: 'DAI-MLK-001',
      name: 'Fresh Highland Milk 1L',
      category: 'Chilled (+4°C)',
      temp_requirement: 'chilled',
      weight_per_unit_kg: 12.0,
      volume_per_unit_m3: 0.035,
      pack_description: '12 Bottles / Case',
    },
    {
      brand: 'Fresh',
      sku: 'FRZ-VEG-999',
      name: 'Frozen Farm Mixed Vegetables 1kg',
      category: 'Frozen (-18°C)',
      temp_requirement: 'frozen',
      weight_per_unit_kg: 10.0,
      volume_per_unit_m3: 0.03,
      pack_description: '10 Packs / Case',
    },
    {
      brand: 'Fresh',
      sku: 'POUL-EGG-030',
      name: 'Farm Fresh Brown Eggs',
      category: 'Ambient',
      temp_requirement: 'ambient',
      weight_per_unit_kg: 6.0,
      volume_per_unit_m3: 0.025,
      pack_description: '30 Eggs / Tray (4 Trays)',
    },
    {
      brand: 'Fresh',
      sku: 'DAI-BUT-200',
      name: 'Pure Butter Salted 200g',
      category: 'Chilled (+4°C)',
      temp_requirement: 'chilled',
      weight_per_unit_kg: 8.0,
      volume_per_unit_m3: 0.02,
      pack_description: '40 Blocks / Case',
    },
    // Style
    {
      brand: 'Style',
      sku: 'STY-TSH-100',
      name: 'Cotton Crew T-Shirts Assorted Pack',
      category: 'Apparel',
      temp_requirement: 'ambient',
      weight_per_unit_kg: 20.0,
      volume_per_unit_m3: 0.45,
      pack_description: '50 Garments / Carton',
    },
    {
      brand: 'Style',
      sku: 'STY-JNS-200',
      name: 'Denim Jeans Regular Fit',
      category: 'Apparel',
      temp_requirement: 'ambient',
      weight_per_unit_kg: 25.0,
      volume_per_unit_m3: 0.5,
      pack_description: '30 Pairs / Carton',
    },
    // Tech
    {
      brand: 'Tech',
      sku: 'TCH-TV43-4K',
      name: '43-inch 4K UHD Smart Television',
      category: 'Electronics',
      temp_requirement: 'ambient',
      weight_per_unit_kg: 14.5,
      volume_per_unit_m3: 0.35,
      pack_description: '1 Unit Box (Fragile)',
    },
    {
      brand: 'Tech',
      sku: 'TCH-REF-320',
      name: 'Inverter Refrigerator 320L',
      category: 'Appliances',
      temp_requirement: 'ambient',
      weight_per_unit_kg: 68.0,
      volume_per_unit_m3: 0.95,
      pack_description: 'Heavy Pallet Crated Unit',
    },
  ]
  await batchInsert(
    'catalog_products',
    [
      'brand',
      'sku',
      'name',
      'category',
      'temp_requirement',
      'weight_per_unit_kg',
      'volume_per_unit_m3',
      'pack_description',
    ],
    catalogProducts
  )
  console.log(`✔ Seeded ${catalogProducts.length} catalog products.`)

  // 10. Seed Realistic Delivery Day Walkthrough Data
  // 10. Master product catalog used by store-manager ordering
  await seedProducts()

  console.log('🚚 Seeding realistic delivery day walkthrough data (Scenario Day: 2026-09-29)...')
  const demoDate = '2026-09-29'
  const cutoffTime = `${demoDate}T16:00:00+05:30`

  // Orders for OUT001 (Colombo Fresh, van_only)
  const sampleOrders = [
    {
      order_id: 'ORD-2026-00101',
      outlet_id: 'OUT001',
      brand: 'Fresh',
      district: 'Colombo',
      depot: 'Peliyagoda',
      order_date: '2026-09-28',
      target_delivery_date: demoDate,
      cutoff_time: cutoffTime,
      placed_before_cutoff: true,
      status: 'delivered',
      temp_requirement: 'chilled',
      total_units: 24,
      total_weight_kg: 656.0,
      total_volume_m3: 1.26,
      requested_window_open: '05:00',
      requested_window_close: '07:30',
      order_notes: 'Cold storage bay 2 open from 05:00 AM. Unloading team prepared with hydraulic pallet jacks.',
      created_by_user_id: 'USR-104',
    },
    {
      order_id: 'ORD-2026-00102',
      outlet_id: 'OUT002',
      brand: 'Fresh',
      district: 'Colombo',
      depot: 'Peliyagoda',
      order_date: '2026-09-28',
      target_delivery_date: demoDate,
      cutoff_time: cutoffTime,
      placed_before_cutoff: true,
      status: 'loading',
      temp_requirement: 'chilled',
      total_units: 18,
      total_weight_kg: 360.0,
      total_volume_m3: 0.95,
      requested_window_open: '05:30',
      requested_window_close: '08:00',
      order_notes: 'Morning produce delivery.',
      created_by_user_id: 'USR-104',
    },
    {
      order_id: 'ORD-2026-00103',
      outlet_id: 'OUT004',
      brand: 'Fresh',
      district: 'Colombo',
      depot: 'Peliyagoda',
      order_date: '2026-09-28',
      target_delivery_date: demoDate,
      cutoff_time: cutoffTime,
      placed_before_cutoff: true,
      status: 'planned',
      temp_requirement: 'chilled',
      total_units: 30,
      total_weight_kg: 720.0,
      total_volume_m3: 1.45,
      requested_window_open: '05:30',
      requested_window_close: '08:00',
      order_notes: 'Standard morning stock.',
      created_by_user_id: 'USR-104',
    },
    {
      order_id: 'ORD-2026-00104',
      outlet_id: 'OUT015',
      brand: 'Style',
      district: 'Colombo',
      depot: 'Peliyagoda',
      order_date: '2026-09-28',
      target_delivery_date: demoDate,
      cutoff_time: cutoffTime,
      placed_before_cutoff: true,
      status: 'submitted',
      temp_requirement: 'ambient',
      total_units: 40,
      total_weight_kg: 950.0,
      total_volume_m3: 19.5,
      requested_window_open: '09:00',
      requested_window_close: '11:00',
      order_notes: 'Mall bay loading required.',
      created_by_user_id: 'USR-104',
    },
    {
      order_id: 'ORD-2026-00105',
      outlet_id: 'OUT021',
      brand: 'Tech',
      district: 'Colombo',
      depot: 'Peliyagoda',
      order_date: '2026-09-28',
      target_delivery_date: demoDate,
      cutoff_time: cutoffTime,
      placed_before_cutoff: true,
      status: 'deferred',
      temp_requirement: 'ambient',
      total_units: 8,
      total_weight_kg: 480.0,
      total_volume_m3: 6.8,
      requested_window_open: '10:30',
      requested_window_close: '12:30',
      order_notes: 'Heavy appliance replenishment.',
      created_by_user_id: 'USR-104',
    },
  ]

  // Orders were placed the morning before the scenario day, before the 4 PM cutoff.
  sampleOrders.forEach((order) => {
    order.created_at = `${order.order_date}T08:30:00+05:30`
    order.submitted_at = order.created_at
  })
  await batchInsert(
    'orders',
    [
      'order_id',
      'outlet_id',
      'brand',
      'district',
      'depot',
      'order_date',
      'target_delivery_date',
      'cutoff_time',
      'placed_before_cutoff',
      'status',
      'temp_requirement',
      'total_units',
      'total_weight_kg',
      'total_volume_m3',
      'requested_window_open',
      'requested_window_close',
      'order_notes',
      'created_by_user_id',
      'created_at',
      'submitted_at',
    ],
    sampleOrders
  )

  // Activity trail for the sample orders, so Order Details shows how each reached its status
  const LIFECYCLE = ['submitted', 'confirmed', 'planned', 'loading', 'loaded', 'dispatched', 'delivered']
  // Placed the morning before, confirmed at the 4 PM cutoff, planned that evening,
  // loaded and dispatched before dawn on the delivery day.
  const EVENT_TIMES = {
    submitted: (o) => `${o.order_date}T08:30:00+05:30`,
    confirmed: (o) => `${o.order_date}T16:00:00+05:30`,
    planned: (o) => `${o.order_date}T17:30:00+05:30`,
    deferred: (o) => `${o.order_date}T17:45:00+05:30`,
    loading: (o) => `${o.target_delivery_date}T03:30:00+05:30`,
    loaded: (o) => `${o.target_delivery_date}T04:00:00+05:30`,
    dispatched: (o) => `${o.target_delivery_date}T04:15:00+05:30`,
    delivered: (o) => `${o.target_delivery_date}T05:08:00+05:30`,
  }
  const sampleEvents = []
  for (const order of sampleOrders) {
    const path = order.status === 'deferred' ? ['submitted', 'confirmed', 'deferred'] : LIFECYCLE.slice(0, LIFECYCLE.indexOf(order.status) + 1)
    path.forEach((status, i) => {
      sampleEvents.push({
        order_id: order.order_id,
        from_status: i === 0 ? null : path[i - 1],
        to_status: status,
        actor_user_id: status === 'submitted' ? order.created_by_user_id : status === 'confirmed' ? null : 'USR-102',
        actor_role: status === 'submitted' ? 'Store Manager' : status === 'confirmed' ? 'System' : 'Dispatcher',
        note: status === 'submitted' ? 'Order placed by store manager' : status === 'confirmed' ? 'Order intake closed — order confirmed for planning' : null,
        created_at: EVENT_TIMES[status](order),
      })
    })
  }
  await batchInsert(
    'order_status_events',
    ['order_id', 'from_status', 'to_status', 'actor_user_id', 'actor_role', 'note', 'created_at'],
    sampleEvents
  )

  // Seed Order Items for ORD-2026-00101
  const sampleItems = [
    {
      order_id: 'ORD-2026-00101',
      product_name: 'Premium White Rice 5kg',
      sku: 'GRD-RIC-90410',
      temp_requirement: 'ambient',
      quantity_cases: 10,
      weight_per_case_kg: 50.0,
      volume_per_case_m3: 0.08,
      total_item_weight_kg: 500.0,
      total_item_volume_m3: 0.8,
    },
    {
      order_id: 'ORD-2026-00101',
      product_name: 'Fresh Highland Milk 1L',
      sku: 'DAI-MLK-001',
      temp_requirement: 'chilled',
      quantity_cases: 8,
      weight_per_case_kg: 12.0,
      volume_per_case_m3: 0.035,
      total_item_weight_kg: 96.0,
      total_item_volume_m3: 0.28,
    },
    {
      order_id: 'ORD-2026-00101',
      product_name: 'Frozen Farm Mixed Vegetables 1kg',
      sku: 'FRZ-VEG-999',
      temp_requirement: 'frozen',
      quantity_cases: 6,
      weight_per_case_kg: 10.0,
      volume_per_case_m3: 0.03,
      total_item_weight_kg: 60.0,
      total_item_volume_m3: 0.18,
    },
  ]
  await batchInsert(
    'order_items',
    [
      'order_id',
      'product_name',
      'sku',
      'temp_requirement',
      'quantity_cases',
      'weight_per_case_kg',
      'volume_per_case_m3',
      'total_item_weight_kg',
      'total_item_volume_m3',
    ],
    sampleItems
  )

  // Seed Trip TR-024: reefer van VEH035 (Peliyagoda, 1040 kg / 7.0 m³) serving the van_only
  // Fresh outlets OUT001 and OUT002 with chilled orders (1016 kg, 2.21 m³ — within capacity).
  const sampleTrip = {
    trip_id: 'TR-024',
    delivery_date: demoDate,
    vehicle_id: 'VEH035',
    trip_number: 1,
    depot: 'Peliyagoda',
    brand: 'Fresh',
    district: 'Colombo',
    driver_user_id: 'USR-108',
    planned_departure_time: '04:15',
    planned_return_time: '07:45',
    total_planned_distance_km: 16.0,
    total_planned_duration_min: 72,
    total_weight_kg: 1016.0,
    total_volume_m3: 2.21,
    status: 'in_progress',
  }
  await batchInsert(
    'trips',
    [
      'trip_id',
      'delivery_date',
      'vehicle_id',
      'trip_number',
      'depot',
      'brand',
      'district',
      'driver_user_id',
      'planned_departure_time',
      'planned_return_time',
      'total_planned_distance_km',
      'total_planned_duration_min',
      'total_weight_kg',
      'total_volume_m3',
      'status',
    ],
    [sampleTrip]
  )

  // Seed Trip Stops
  const sampleStops = [
    {
      trip_id: 'TR-024',
      order_id: 'ORD-2026-00101',
      stop_sequence: 1,
      loading_sequence: 2,
      from_point: 'DEPOT',
      to_outlet_id: 'OUT001',
      distance_km: 12.0,
      planned_travel_min: 24,
      planned_arrival_time: '04:45',
      planned_departure_time: '05:01',
      planned_handling_min: 16, // Fresh street dock
      actual_arrival_time: '04:50',
      actual_departure_time: '05:08',
      status: 'delivered',
    },
    {
      trip_id: 'TR-024',
      order_id: 'ORD-2026-00102',
      stop_sequence: 2,
      loading_sequence: 1,
      from_point: 'OUT001',
      to_outlet_id: 'OUT002',
      distance_km: 4.0,
      planned_travel_min: 8,
      planned_arrival_time: '05:16',
      planned_departure_time: '05:32',
      planned_handling_min: 16,
      actual_arrival_time: null,
      actual_departure_time: null,
      status: 'in_transit',
    },
  ]
  await batchInsert(
    'trip_stops',
    [
      'trip_id',
      'order_id',
      'stop_sequence',
      'loading_sequence',
      'from_point',
      'to_outlet_id',
      'distance_km',
      'planned_travel_min',
      'planned_arrival_time',
      'planned_departure_time',
      'planned_handling_min',
      'actual_arrival_time',
      'actual_departure_time',
      'status',
    ],
    sampleStops
  )

  // Seed Deferral record for ORD-2026-00105
  const sampleDeferral = {
    order_id: 'ORD-2026-00105',
    outlet_id: 'OUT021',
    planning_date: demoDate,
    deferral_reason: 'capacity_exceeded',
    explanation: 'Appliance volume exceeds available morning vehicle volume. Scheduled for next priority slot.',
    consecutive_deferral_count: 1,
    next_scheduled_date: '2026-09-30',
    decided_by_user_id: 'USR-102',
  }
  await batchInsert(
    'order_deferrals',
    [
      'order_id',
      'outlet_id',
      'planning_date',
      'deferral_reason',
      'explanation',
      'consecutive_deferral_count',
      'next_scheduled_date',
      'decided_by_user_id',
    ],
    [sampleDeferral]
  )

  // Seed Delivery Record (Proof of Delivery for stop 1)
  const sampleDeliveryRecord = {
    trip_id: 'TR-024',
    order_id: 'ORD-2026-00101',
    stop_id: 1,
    driver_user_id: 'USR-108',
    actual_arrival_time: '04:50',
    actual_departure_time: '05:08',
    handling_duration_min: 18,
    is_late: false,
    lateness_minutes: 0,
    outcome: 'delivered_full',
    received_by_name: 'Sarah Perera (Store Manager)',
    signature_data: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMCA1MCBDIDIwIDIwLCA0MCA4MCwgNjAgNTAgUyA4MCAyMCwgMTAwIDUwIiBzdHJva2U9IiMwZjE3MmEiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+',
    proof_photo_url: null,
    driver_notes: 'Delivered before store opening. Verified 24 cases into walk-in cooler.',
    recorded_offline: false,
    synced_at: `${demoDate}T05:08:00+05:30`,
  }
  await batchInsert(
    'delivery_records',
    [
      'trip_id',
      'order_id',
      'stop_id',
      'driver_user_id',
      'actual_arrival_time',
      'actual_departure_time',
      'handling_duration_min',
      'is_late',
      'lateness_minutes',
      'outcome',
      'received_by_name',
      'signature_data',
      'proof_photo_url',
      'driver_notes',
      'recorded_offline',
      'synced_at',
    ],
    [sampleDeliveryRecord]
  )

  // Seed Receipt Confirmation by Store Manager
  const sampleReceiptConfirmation = {
    order_id: 'ORD-2026-00101',
    outlet_id: 'OUT001',
    manager_user_id: 'USR-104',
    receipt_status: 'accepted_in_full',
    received_cases: 24,
    damaged_cases: 0,
    missing_cases: 0,
    temp_check_celsius: 3.8,
    manager_notes: 'All items received in good condition. Temperature verified at 3.8°C.',
    confirmed_at: `${demoDate}T05:20:00+05:30`,
  }
  await batchInsert(
    'receipt_confirmations',
    [
      'order_id',
      'outlet_id',
      'manager_user_id',
      'receipt_status',
      'received_cases',
      'damaged_cases',
      'missing_cases',
      'temp_check_celsius',
      'manager_notes',
      'confirmed_at',
    ],
    [sampleReceiptConfirmation]
  )

  console.log('✔ Seeded realistic delivery day with orders, trips, stops, deferrals, POD, and receipt confirmation.')

  // Peak-day planning scenario: demand exceeds the available fleet (SCENARIO_DATE or the next
  // operating day). The dispatcher can reload it for any date from the Delivery Planner.
  let scenarioDate = process.env.SCENARIO_DATE
  if (!scenarioDate) {
    const [row] = await sql.query(
      `SELECT date FROM operating_calendar WHERE date > $1 AND is_operating = true ORDER BY date LIMIT 1`,
      [toColomboParts(now()).date]
    )
    scenarioDate = row?.date || addDays(toColomboParts(now()).date, 1)
  }
  const scenario = await generatePeakDay(sql, scenarioDate, { actorUserId: 'USR-102' })
  console.log(`✔ Peak-day scenario for ${scenario.date}: ${scenario.created} orders, ${scenario.in_workshop} vehicles in workshop.`)
  console.log('\n🎉 Database seeding completed successfully!')
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Seeding failed:', err)
      process.exit(1)
    })
}

module.exports = { seedDatabase }
