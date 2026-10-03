require('dotenv').config()
const { sql } = require('./db')

const TABLES = [
  // 1. Operating Calendar
  `CREATE TABLE IF NOT EXISTS operating_calendar (
    date DATE PRIMARY KEY,
    dow SMALLINT NOT NULL,
    dow_name VARCHAR(10) NOT NULL,
    is_weekend BOOLEAN NOT NULL,
    iso_year INTEGER NOT NULL,
    iso_week SMALLINT NOT NULL,
    is_payday BOOLEAN NOT NULL,
    festival VARCHAR(50),
    festival_ramp NUMERIC(3,2) DEFAULT 0.0,
    is_holiday BOOLEAN NOT NULL,
    monsoon BOOLEAN NOT NULL,
    is_operating BOOLEAN NOT NULL
  );`,

  // 2. District Travel
  `CREATE TABLE IF NOT EXISTS district_travel (
    district VARCHAR(30) NOT NULL,
    depot VARCHAR(30) NOT NULL,
    road_class VARCHAR(20) NOT NULL,
    free_flow_kmh NUMERIC(5,2) NOT NULL,
    depot_to_district_km NUMERIC(8,2) NOT NULL,
    depot_to_district_freeflow_min INTEGER NOT NULL,
    inter_stop_km NUMERIC(8,2) NOT NULL,
    inter_stop_freeflow_min INTEGER NOT NULL,
    PRIMARY KEY (district, depot)
  );`,

  // 3. Service Allowance
  `CREATE TABLE IF NOT EXISTS service_allowance (
    brand VARCHAR(20) NOT NULL,
    dock_type VARCHAR(20) NOT NULL,
    service_allowance_min INTEGER NOT NULL,
    PRIMARY KEY (brand, dock_type)
  );`,

  // 4. Outlets
  `CREATE TABLE IF NOT EXISTS outlets (
    outlet_id VARCHAR(10) PRIMARY KEY,
    brand VARCHAR(20) NOT NULL,
    district VARCHAR(30) NOT NULL,
    depot VARCHAR(30) NOT NULL,
    dock_type VARCHAR(20) NOT NULL,
    parking_constraint VARCHAR(20) NOT NULL,
    mall_window VARCHAR(30),
    window_open_time TIME NOT NULL,
    window_close_time TIME NOT NULL
  );`,

  // 5. Vehicles
  `CREATE TABLE IF NOT EXISTS vehicles (
    vehicle_id VARCHAR(10) PRIMARY KEY,
    type VARCHAR(10) NOT NULL,
    temp VARCHAR(10) NOT NULL,
    weight_cap_kg NUMERIC(10,2) NOT NULL,
    volume_cap_m3 NUMERIC(10,2) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL DEFAULT 'diesel',
    km_per_l NUMERIC(5,2) NOT NULL,
    weekly_fuel_quota_l NUMERIC(10,2) NOT NULL,
    depot VARCHAR(30) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true
  );`,

  // 6. Traffic Speed Index
  `CREATE TABLE IF NOT EXISTS traffic_speed_index (
    district VARCHAR(30) NOT NULL,
    hour SMALLINT NOT NULL,
    monsoon SMALLINT NOT NULL,
    speed_index NUMERIC(5,2) NOT NULL,
    PRIMARY KEY (district, hour, monsoon)
  );`,

  // 7. Road Disruptions
  `CREATE TABLE IF NOT EXISTS road_disruptions (
    district VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    disruption_index NUMERIC(5,2) NOT NULL,
    PRIMARY KEY (district, date)
  );`,

  // 8. Users
  `CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(20) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL,
    facility VARCHAR(100) NOT NULL,
    outlet_id VARCHAR(10) REFERENCES outlets(outlet_id),
    assigned_vehicle_id VARCHAR(10) REFERENCES vehicles(vehicle_id),
    phone VARCHAR(30),
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    avatar VARCHAR(10),
    joined_date VARCHAR(30),
    requires_password_change BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 9. Catalog Products
  `CREATE TABLE IF NOT EXISTS catalog_products (
    product_id SERIAL PRIMARY KEY,
    brand VARCHAR(20) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    temp_requirement VARCHAR(20) NOT NULL,
    weight_per_unit_kg NUMERIC(8,2) NOT NULL,
    volume_per_unit_m3 NUMERIC(8,4) NOT NULL,
    pack_description VARCHAR(100)
  );`,

  // 10. Master Products Catalog
  `CREATE TABLE IF NOT EXISTS products (
    product_id VARCHAR(30) PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    brand VARCHAR(30) NOT NULL,
    temperature_requirement VARCHAR(30) NOT NULL,
    weight_per_unit NUMERIC(10,2) NOT NULL,
    volume_per_unit NUMERIC(10,4) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 10. Orders
  `CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(30) PRIMARY KEY,
    outlet_id VARCHAR(10) NOT NULL REFERENCES outlets(outlet_id),
    brand VARCHAR(20) NOT NULL,
    district VARCHAR(30) NOT NULL,
    depot VARCHAR(30) NOT NULL,
    order_date DATE NOT NULL,
    target_delivery_date DATE NOT NULL,
    cutoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
    placed_before_cutoff BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted',
    temp_requirement VARCHAR(20) NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 0,
    total_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    total_volume_m3 NUMERIC(10,3) NOT NULL DEFAULT 0.0,
    requested_window_open TIME,
    requested_window_close TIME,
    order_notes TEXT,
    created_by_user_id VARCHAR(20) REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 11. Order Items
  `CREATE TABLE IF NOT EXISTS order_items (
    item_id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(30) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES catalog_products(product_id),
    product_name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    temp_requirement VARCHAR(20) NOT NULL,
    quantity_cases INTEGER NOT NULL,
    weight_per_case_kg NUMERIC(8,2) NOT NULL,
    volume_per_case_m3 NUMERIC(8,4) NOT NULL,
    total_item_weight_kg NUMERIC(10,2) NOT NULL,
    total_item_volume_m3 NUMERIC(10,3) NOT NULL
  );`,

  // 12. Trips
  `CREATE TABLE IF NOT EXISTS trips (
    trip_id VARCHAR(50) PRIMARY KEY,
    delivery_date DATE NOT NULL,
    vehicle_id VARCHAR(10) NOT NULL REFERENCES vehicles(vehicle_id),
    trip_number SMALLINT NOT NULL CHECK (trip_number IN (1, 2)),
    depot VARCHAR(30) NOT NULL,
    brand VARCHAR(20) NOT NULL,
    district VARCHAR(30) NOT NULL,
    driver_user_id VARCHAR(20) REFERENCES users(user_id),
    planned_departure_time TIME NOT NULL,
    planned_return_time TIME,
    total_planned_distance_km NUMERIC(8,2) NOT NULL DEFAULT 0.0,
    total_planned_duration_min INTEGER NOT NULL DEFAULT 0,
    total_weight_kg NUMERIC(10,2) NOT NULL DEFAULT 0.0,
    total_volume_m3 NUMERIC(10,3) NOT NULL DEFAULT 0.0,
    status VARCHAR(30) NOT NULL DEFAULT 'planned',
    dispatched_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_vehicle_day_trip UNIQUE (delivery_date, vehicle_id, trip_number)
  );`,

  // 13. Trip Stops
  `CREATE TABLE IF NOT EXISTS trip_stops (
    stop_id BIGSERIAL PRIMARY KEY,
    trip_id VARCHAR(50) NOT NULL REFERENCES trips(trip_id) ON DELETE CASCADE,
    order_id VARCHAR(30) NOT NULL UNIQUE REFERENCES orders(order_id),
    stop_sequence INTEGER NOT NULL,
    loading_sequence INTEGER NOT NULL,
    from_point VARCHAR(30) NOT NULL,
    to_outlet_id VARCHAR(10) NOT NULL REFERENCES outlets(outlet_id),
    distance_km NUMERIC(8,2) NOT NULL,
    planned_travel_min INTEGER NOT NULL,
    planned_arrival_time TIME NOT NULL,
    planned_departure_time TIME NOT NULL,
    planned_handling_min INTEGER NOT NULL,
    actual_arrival_time TIME,
    actual_departure_time TIME,
    status VARCHAR(30) NOT NULL DEFAULT 'scheduled',
    CONSTRAINT uq_trip_sequence UNIQUE (trip_id, stop_sequence)
  );`,

  // 14. Order Deferrals
  `CREATE TABLE IF NOT EXISTS order_deferrals (
    deferral_id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(30) NOT NULL REFERENCES orders(order_id),
    outlet_id VARCHAR(10) NOT NULL REFERENCES outlets(outlet_id),
    planning_date DATE NOT NULL,
    deferral_reason VARCHAR(50) NOT NULL,
    explanation TEXT,
    consecutive_deferral_count INTEGER NOT NULL DEFAULT 1,
    next_scheduled_date DATE,
    decided_by_user_id VARCHAR(20) REFERENCES users(user_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 15. Loading Verifications
  `CREATE TABLE IF NOT EXISTS loading_verifications (
    verification_id BIGSERIAL PRIMARY KEY,
    trip_id VARCHAR(50) NOT NULL REFERENCES trips(trip_id),
    order_id VARCHAR(30) NOT NULL REFERENCES orders(order_id),
    loader_user_id VARCHAR(20) NOT NULL REFERENCES users(user_id),
    bay_number VARCHAR(20),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    shortfall_flag BOOLEAN NOT NULL DEFAULT false,
    shortfall_units INTEGER DEFAULT 0,
    shortfall_reason VARCHAR(100),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 16. Delivery Records (Proof of Delivery)
  `CREATE TABLE IF NOT EXISTS delivery_records (
    delivery_record_id BIGSERIAL PRIMARY KEY,
    trip_id VARCHAR(50) NOT NULL REFERENCES trips(trip_id),
    order_id VARCHAR(30) NOT NULL UNIQUE REFERENCES orders(order_id),
    stop_id BIGINT NOT NULL REFERENCES trip_stops(stop_id),
    driver_user_id VARCHAR(20) NOT NULL REFERENCES users(user_id),
    actual_arrival_time TIME NOT NULL,
    actual_departure_time TIME NOT NULL,
    handling_duration_min INTEGER NOT NULL,
    is_late BOOLEAN NOT NULL DEFAULT false,
    lateness_minutes INTEGER DEFAULT 0,
    outcome VARCHAR(30) NOT NULL,
    received_by_name VARCHAR(100),
    signature_data TEXT,
    proof_photo_url VARCHAR(255),
    driver_notes TEXT,
    recorded_offline BOOLEAN NOT NULL DEFAULT false,
    synced_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 17. Receipt Confirmations
  `CREATE TABLE IF NOT EXISTS receipt_confirmations (
    confirmation_id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(30) NOT NULL UNIQUE REFERENCES orders(order_id),
    outlet_id VARCHAR(10) NOT NULL REFERENCES outlets(outlet_id),
    manager_user_id VARCHAR(20) NOT NULL REFERENCES users(user_id),
    receipt_status VARCHAR(30) NOT NULL,
    received_cases INTEGER NOT NULL,
    damaged_cases INTEGER NOT NULL DEFAULT 0,
    missing_cases INTEGER NOT NULL DEFAULT 0,
    temp_check_celsius NUMERIC(4,1),
    confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    manager_notes TEXT
  );`,

  // 18. Operational Issues
  `CREATE TABLE IF NOT EXISTS operational_issues (
    issue_id BIGSERIAL PRIMARY KEY,
    reported_by_role VARCHAR(20) NOT NULL,
    reported_by_user_id VARCHAR(20) NOT NULL REFERENCES users(user_id),
    related_order_id VARCHAR(30) REFERENCES orders(order_id),
    related_trip_id VARCHAR(50) REFERENCES trips(trip_id),
    outlet_id VARCHAR(10) REFERENCES outlets(outlet_id),
    issue_category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    resolution_status VARCHAR(20) NOT NULL DEFAULT 'open',
    resolution_notes TEXT,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 19. Order Status Events (audit trail of every order status change)
  `CREATE TABLE IF NOT EXISTS order_status_events (
    event_id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(30) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    actor_user_id VARCHAR(20) REFERENCES users(user_id),
    actor_role VARCHAR(30) NOT NULL DEFAULT 'System',
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`,

  // 20. Order Intake Closures (dispatcher closes intake for a delivery date)
  `CREATE TABLE IF NOT EXISTS order_intake_closures (
    delivery_date DATE PRIMARY KEY,
    closed_by_user_id VARCHAR(20) REFERENCES users(user_id),
    closed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    confirmed_order_count INTEGER NOT NULL DEFAULT 0
  );`,
]

// 21. Delivery plans: one plan per delivery date, drafted by the planner and published by the dispatcher
TABLES.push(`CREATE TABLE IF NOT EXISTS delivery_plans (
    delivery_date DATE PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    unscheduled JSONB NOT NULL DEFAULT '{}'::jsonb,
    generated_by_user_id VARCHAR(20) REFERENCES users(user_id),
    generated_at TIMESTAMP WITH TIME ZONE,
    published_by_user_id VARCHAR(20) REFERENCES users(user_id),
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );`)

// 22. Vehicle availability exceptions (e.g. in the workshop on a given date)
TABLES.push(`CREATE TABLE IF NOT EXISTS vehicle_availability (
    vehicle_id VARCHAR(10) NOT NULL REFERENCES vehicles(vehicle_id),
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_workshop',
    reason TEXT,
    PRIMARY KEY (vehicle_id, date)
  );`)

// Additive changes for databases created before these columns existed.
const MIGRATIONS = [
  `CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority VARCHAR(10) NOT NULL DEFAULT 'normal';`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS outlet_reference VARCHAR(60);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_group_id VARCHAR(30);`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE;`,
  `ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;`,
  `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_code VARCHAR(30);`,
  `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit VARCHAR(30);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders (target_delivery_date, status);`,
  `CREATE INDEX IF NOT EXISTS idx_orders_outlet ON orders (outlet_id, target_delivery_date);`,
  `CREATE INDEX IF NOT EXISTS idx_order_events_order ON order_status_events (order_id, created_at);`,
  `CREATE INDEX IF NOT EXISTS idx_order_deferrals_order ON order_deferrals (order_id);`,
  `CREATE INDEX IF NOT EXISTS idx_trips_date ON trips (delivery_date, vehicle_id);`,
  `ALTER TABLE trips ADD COLUMN IF NOT EXISTS planned_fuel_l NUMERIC(8,2) NOT NULL DEFAULT 0;`,
  `ALTER TABLE trips ADD COLUMN IF NOT EXISTS budget_minutes INTEGER NOT NULL DEFAULT 0;`,
  `ALTER TABLE trips ADD COLUMN IF NOT EXISTS loading_completed_at TIMESTAMP WITH TIME ZONE;`,
  // Proof of delivery photo (compressed JPEG data URL) and idempotency key for offline replay
  `ALTER TABLE delivery_records ADD COLUMN IF NOT EXISTS proof_photo_data TEXT;`,
  `ALTER TABLE delivery_records ADD COLUMN IF NOT EXISTS client_event_id VARCHAR(64);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uq_delivery_client_event ON delivery_records (client_event_id) WHERE client_event_id IS NOT NULL;`,
  `ALTER TABLE operational_issues ADD COLUMN IF NOT EXISTS impact VARCHAR(30);`,
  `ALTER TABLE operational_issues ADD COLUMN IF NOT EXISTS photo_data TEXT;`,
  `ALTER TABLE operational_issues ADD COLUMN IF NOT EXISTS client_event_id VARCHAR(64);`,
  `CREATE UNIQUE INDEX IF NOT EXISTS uq_issue_client_event ON operational_issues (client_event_id) WHERE client_event_id IS NOT NULL;`,
  `ALTER TABLE loading_verifications ADD COLUMN IF NOT EXISTS issue_type VARCHAR(40);`,
  `ALTER TABLE loading_verifications ADD COLUMN IF NOT EXISTS item_name VARCHAR(150);`,
  `ALTER TABLE loading_verifications ADD COLUMN IF NOT EXISTS planned_units INTEGER;`,
  `ALTER TABLE loading_verifications ADD COLUMN IF NOT EXISTS notes TEXT;`,
  `CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips (driver_user_id, delivery_date);`,
  `ALTER TABLE receipt_confirmations ADD COLUMN IF NOT EXISTS line_details JSONB;`,
  `CREATE INDEX IF NOT EXISTS idx_issues_open ON operational_issues (resolution_status, reported_at);`,
  // Repair accounts unlinked by the old user-update bug: the facility label written at creation
  // ("Store OUT101 - …", "… Fleet Hub (VEH012)") still names the outlet / vehicle.
  `UPDATE users u SET outlet_id = substring(u.facility from 'Store (OUT[0-9]{3})')
   WHERE u.role = 'Store Manager' AND u.outlet_id IS NULL
     AND EXISTS (SELECT 1 FROM outlets o WHERE o.outlet_id = substring(u.facility from 'Store (OUT[0-9]{3})'));`,
  `UPDATE users u SET assigned_vehicle_id = substring(u.facility from '\\((VEH[0-9]{3})\\)')
   WHERE u.role = 'Driver' AND u.assigned_vehicle_id IS NULL
     AND EXISTS (SELECT 1 FROM vehicles v WHERE v.vehicle_id = substring(u.facility from '\\((VEH[0-9]{3})\\)'));`,
]

async function createSchema(dropFirst = false) {
  if (!sql) {
    throw new Error('Database connection not initialized. Please set DATABASE_URL.')
  }

  console.log('🔄 Setting up WayFlow PostgreSQL Schema on Neon...')

  if (dropFirst) {
    console.log('⚠️  Dropping existing tables...')
    const dropQuery = `
      DROP TABLE IF EXISTS vehicle_availability CASCADE;
      DROP TABLE IF EXISTS delivery_plans CASCADE;
      DROP TABLE IF EXISTS order_intake_closures CASCADE;
      DROP TABLE IF EXISTS order_status_events CASCADE;
      DROP TABLE IF EXISTS operational_issues CASCADE;
      DROP TABLE IF EXISTS receipt_confirmations CASCADE;
      DROP TABLE IF EXISTS delivery_records CASCADE;
      DROP TABLE IF EXISTS loading_verifications CASCADE;
      DROP TABLE IF EXISTS order_deferrals CASCADE;
      DROP TABLE IF EXISTS trip_stops CASCADE;
      DROP TABLE IF EXISTS trips CASCADE;
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS catalog_products CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP SEQUENCE IF EXISTS order_number_seq;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS road_disruptions CASCADE;
      DROP TABLE IF EXISTS traffic_speed_index CASCADE;
      DROP TABLE IF EXISTS vehicles CASCADE;
      DROP TABLE IF EXISTS outlets CASCADE;
      DROP TABLE IF EXISTS service_allowance CASCADE;
      DROP TABLE IF EXISTS district_travel CASCADE;
      DROP TABLE IF EXISTS operating_calendar CASCADE;
    `
    await sql.query(dropQuery)
    console.log('✔ Dropped existing tables.')
  }

  for (const tableSql of TABLES) {
    await sql.query(tableSql)
  }
  for (const migrationSql of MIGRATIONS) {
    await sql.query(migrationSql)
  }

  console.log(`✔ All ${TABLES.length} tables verified/created and ${MIGRATIONS.length} migrations applied.`)
}

if (require.main === module) {
  const shouldDrop = process.argv.includes('--drop')
  createSchema(shouldDrop)
    .then(() => {
      console.log('✔ Schema setup complete.')
      process.exit(0)
    })
    .catch((err) => {
      console.error('❌ Schema setup failed:', err)
      process.exit(1)
    })
}

module.exports = { createSchema }
