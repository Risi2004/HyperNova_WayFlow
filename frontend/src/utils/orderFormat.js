// Display helpers shared by the store manager and dispatcher order screens.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const parseDate = (dateStr) => new Date(`${String(dateStr).slice(0, 10)}T00:00:00Z`)

// 'YYYY-MM-DD' → 'Oct 06, 2026'
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = parseDate(dateStr)
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}, ${d.getUTCFullYear()}`
}

// 'YYYY-MM-DD' → '06 Oct'
export function formatShortDate(dateStr) {
  if (!dateStr) return '—'
  const d = parseDate(dateStr)
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTHS[d.getUTCMonth()]}`
}

// 'YYYY-MM-DD' → 'Tue (Oct 06)'
export function formatDayLabel(dateStr) {
  const d = parseDate(dateStr)
  return `${WEEKDAYS[d.getUTCDay()]} (${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')})`
}

// Today's date in Asia/Colombo as 'YYYY-MM-DD'
export function colomboToday() {
  return new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10)
}

// Timestamp → { date: 'Oct 03, 2026', time: '05:45 PM' } in Colombo time
export function formatTimestamp(ts) {
  if (!ts) return { date: '—', time: '' }
  const shifted = new Date(new Date(ts).getTime() + 330 * 60000)
  const iso = shifted.toISOString()
  return { date: formatDate(iso.slice(0, 10)), time: formatTime(iso.slice(11, 16)) }
}

// '05:30:00' → '5:30 AM'
export function formatTime(time) {
  if (!time) return '—'
  const [h, m] = String(time).split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, '0')} ${suffix}`
}

export const formatWindow = (open, close) => `${formatTime(open)} – ${formatTime(close)}`

export const formatKg = (kg) => `${Number(kg || 0).toLocaleString(undefined, { maximumFractionDigits: 1 })} kg`
export const formatM3 = (m3) => `${Number(m3 || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} m³`

// Remaining time until an instant, e.g. '1d 4h 15m'
export function formatCountdown(target, nowMs = Date.now()) {
  let mins = Math.max(0, Math.floor((new Date(target).getTime() - nowMs) / 60000))
  const days = Math.floor(mins / 1440)
  mins -= days * 1440
  const hours = Math.floor(mins / 60)
  const parts = []
  if (days) parts.push(`${days}d`)
  if (days || hours) parts.push(`${hours}h`)
  parts.push(`${mins % 60}m`)
  return parts.join(' ')
}

export const outletLabel = (order) => `Waypoint ${order.brand} – ${order.district} (${order.outlet_id})`

export const DEFERRAL_REASONS = {
  capacity_exceeded: 'Vehicle capacity exceeded',
  no_reefer_available: 'No refrigerated vehicle available',
  no_van_available: 'No van for van-only outlet',
  time_window: 'Delivery window cannot be met',
  fuel_quota: 'Weekly fuel quota exhausted',
  outlet_access: 'Outlet access restriction',
  dispatcher_decision: 'Dispatcher prioritisation decision',
  failed_delivery: 'Failed delivery — rescheduled',
}

// Lifecycle status → Store Manager "My Orders" status vocabulary.
export const STORE_STATUS = {
  submitted: 'PENDING',
  confirmed: 'CONFIRMED',
  planned: 'SCHEDULED',
  loading: 'SCHEDULED',
  loaded: 'SCHEDULED',
  shortfall: 'SCHEDULED',
  dispatched: 'IN_DELIVERY',
  delivered: 'COMPLETED',
  partial: 'COMPLETED',
  received: 'COMPLETED',
  disputed: 'COMPLETED',
  failed: 'DEFERRED',
  deferred: 'DEFERRED',
}

// Lifecycle status → Dispatcher Orders table tag.
export const DISPATCH_STATUS = {
  submitted: { label: 'Awaiting Cutoff', type: 'pending' },
  confirmed: { label: 'Pending Planning', type: 'pending' },
  planned: { label: 'Planned', type: 'planned' },
  loading: { label: 'Loading', type: 'loading' },
  loaded: { label: 'Loaded', type: 'loading' },
  shortfall: { label: 'Load Shortfall', type: 'exception' },
  dispatched: { label: 'In Transit', type: 'planned' },
  delivered: { label: 'Delivered', type: 'planned' },
  partial: { label: 'Part Delivered', type: 'exception' },
  failed: { label: 'Failed Delivery', type: 'exception' },
  received: { label: 'Received', type: 'planned' },
  disputed: { label: 'Disputed', type: 'exception' },
  deferred: { label: 'Deferred', type: 'deferred' },
  cancelled: { label: 'Cancelled', type: 'deferred' },
}

export const dispatchStatusOf = (status) => DISPATCH_STATUS[status] || { label: status, type: 'pending' }

// Vehicle constraints the planner must satisfy for this order.
export function requirementOf(order) {
  const chilled = order.temp_requirement === 'chilled'
  if (order.parking_constraint === 'van_only') {
    return { label: chilled ? 'Reefer Van' : 'Van Only', type: chilled ? 'refrigerated' : 'van' }
  }
  if (chilled) return { label: 'Refrigerated', type: 'refrigerated' }
  if (order.parking_constraint === 'mall_dock') return { label: 'Mall Window', type: 'van' }
  return { label: 'Standard', type: 'standard' }
}

// Product temperature → item category shown in the order form (catalog uses 'reefer').
export function productCategory(product) {
  const isCold = ['reefer', 'chilled', 'frozen'].includes(String(product.temperature_requirement || product.temp_requirement).toLowerCase())
  if (!isCold) return { type: 'ambient', label: 'Ambient' }
  if (/frozen/i.test(product.product_name || product.name || '')) return { type: 'frozen', label: 'Frozen (-18°C)' }
  return { type: 'chilled', label: 'Chilled (+4°C)' }
}
