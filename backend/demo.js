require('dotenv').config()
const { sql, withTransaction, pool } = require('./db')
const { generatePeakDay } = require('./services/planner/scenario')
const { generatePlan, publishPlan } = require('./services/planner/planService')
const { toColomboParts, now, addDays } = require('./services/orderSchedule')

// Prepares a demo delivery day: loads the peak-day scenario (165 orders, 10 vehicles in the
// workshop), runs the planner and publishes the plan so loaders and drivers have trips.
//
//   npm run demo                 → next operating day
//   npm run demo -- 2026-10-12   → a specific date
//   npm run demo -- 2026-10-12 --draft   → stop after "Suggest Plan" (publish from the UI)

const DISPATCHER = 'USR-102'

async function nextOperatingDay(db, date) {
  const [row] = await db.query(
    `SELECT date FROM operating_calendar WHERE date > $1 AND is_operating = true ORDER BY date LIMIT 1`,
    [date]
  )
  return row?.date || addDays(date, 1)
}

async function main() {
  const args = process.argv.slice(2)
  const draftOnly = args.includes('--draft')
  const date = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || (await nextOperatingDay(sql, toColomboParts(now()).date))

  const [dispatcher] = await sql.query('SELECT user_id FROM users WHERE user_id = $1', [DISPATCHER])
  if (!dispatcher) throw new Error('Demo accounts are missing. Run `npm run seed` first.')

  const scenario = await withTransaction((tx) => generatePeakDay(tx, date, { actorUserId: DISPATCHER }))
  console.log(`✔ Peak-day scenario for ${scenario.date}: ${scenario.created} orders, ${scenario.in_workshop} vehicles in the workshop.`)

  const plan = await withTransaction((tx) => generatePlan(tx, date, { userId: DISPATCHER }))
  console.log(`✔ Suggested plan: ${plan.planned} orders on ${plan.trips} trips, ${plan.unscheduled} could not be scheduled.`)
  if (draftOnly) return

  const actor = { userId: DISPATCHER, role: 'Dispatcher' }
  const published = await withTransaction((tx) => publishPlan(tx, date, actor, (d) => nextOperatingDay(tx, d)))
  console.log(`✔ Published: ${published.planned} orders on ${published.trips} trips; ${published.deferred} deferred to ${published.next_date}.`)
}

main()
  .then(() => pool.end())
  .catch(async (err) => {
    console.error('❌ Demo setup failed:', err.message)
    await pool.end()
    process.exit(1)
  })
