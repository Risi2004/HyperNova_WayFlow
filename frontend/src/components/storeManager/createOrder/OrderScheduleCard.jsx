import { useEffect, useState } from 'react'
import {
  colomboToday,
  formatCountdown,
  formatDate,
  formatDayLabel,
  formatWindow,
} from '../../../utils/orderFormat'

const toMinutes = (t) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const toTime = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`

// The outlet's full receiving window plus earlier / later halves so staff can be rostered.
function windowOptions(outlet) {
  const open = outlet.window_open
  const close = outlet.window_close
  const options = [{ value: `${open}-${close}`, label: `Full outlet window (${formatWindow(open, close)}) - Recommended` }]
  const span = toMinutes(close) - toMinutes(open)
  if (span >= 60) {
    const mid = toTime(toMinutes(open) + Math.round(span / 2 / 15) * 15)
    options.push({ value: `${open}-${mid}`, label: `Earlier slot (${formatWindow(open, mid)})` })
    options.push({ value: `${mid}-${close}`, label: `Later slot (${formatWindow(mid, close)})` })
  }
  return options
}

const ACCESS_HINTS = {
  van_only: 'Van-only access: the dispatcher will assign a van to this outlet.',
  mall_dock: 'Mall outlet: delivery must fit the mall access window.',
  normal: 'Any vehicle type can unload at this outlet.',
}

export default function OrderScheduleCard({
  outlet,
  deliveryOptions = [],
  deliveryOption,
  isBusy = false,
  deliveryDate,
  setDeliveryDate,
  deliveryWindow,
  setDeliveryWindow,
  priority,
  setPriority,
  outletRef,
  setOutletRef,
  orderNotes,
  setOrderNotes,
  onDiscard,
  onSaveDraft,
  onSubmitOrder,
}) {
  // Re-render every 30s so the cutoff countdown stays current.
  const [nowMs, setNowMs] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNowMs(Date.now()), 30000)
    return () => clearInterval(timer)
  }, [])

  const tomorrow = new Date(Date.parse(`${colomboToday()}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)
  const quickDates = deliveryOptions.slice(0, 3).map((o) => ({
    value: o.date,
    label: o.date === tomorrow ? `Tomorrow ${formatDayLabel(o.date).slice(4)}` : formatDayLabel(o.date),
  }))
  const windows = windowOptions(outlet)
  const cutoffAt = deliveryOption?.cutoffAt

  return (
    <div className="co-card co-schedule-card">
      {/* Header */}
      <div className="co-card-header">
        <div className="co-card-title-group">
          <div className="co-card-icon-wrap blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h2 className="co-card-title">Order Details &amp; Delivery Schedule</h2>
        </div>
        <span className="co-dispatch-tag">{outlet.depot} Dispatch</span>
      </div>

      {/* Form Grid */}
      <div className="co-form-grid">
        {/* Row 1 Left: Requested Delivery Date */}
        <div className="co-form-group">
          <label className="co-form-label">
            Requested Delivery Date <span className="co-required-star">*</span>
          </label>
          <div className="co-input-with-icon">
            <input
              type="date"
              className="co-text-input"
              value={deliveryDate}
              min={deliveryOptions[0]?.date}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
            <div className="co-input-icon-btn" title="Select Date">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          {/* Quick Date Pills */}
          <div className="co-quick-date-row">
            {quickDates.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`co-date-pill-btn ${deliveryDate === item.value ? 'active' : ''}`}
                onClick={() => setDeliveryDate(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1 Right: Preferred Delivery Window */}
        <div className="co-form-group">
          <label className="co-form-label">
            Preferred Delivery Window <span className="co-required-star">*</span>
          </label>
          <div className="co-select-wrap">
            <select
              className="co-select-input"
              value={deliveryWindow}
              onChange={(e) => setDeliveryWindow(e.target.value)}
            >
              {windows.map((w) => (
                <option key={w.value} value={w.value}>
                  {w.label}
                </option>
              ))}
            </select>
            <div className="co-select-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <span className="co-input-hint">
            {ACCESS_HINTS[outlet.parking_constraint] || ACCESS_HINTS.normal}
          </span>
        </div>

        {/* Row 2 Left: Order Priority Level */}
        <div className="co-form-group">
          <label className="co-form-label">Order Priority Level</label>
          <div className="co-priority-toggle-row">
            <button
              type="button"
              className={`co-priority-btn ${priority === 'normal' ? 'active' : ''}`}
              onClick={() => setPriority('normal')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span>Normal Restock</span>
            </button>
            <button
              type="button"
              className={`co-priority-btn ${priority === 'urgent' ? 'active urgent' : ''}`}
              onClick={() => setPriority('urgent')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              <span>Urgent / Stockout</span>
            </button>
          </div>
        </div>

        {/* Row 2 Right: Internal Outlet Reference / Tag */}
        <div className="co-form-group">
          <label className="co-form-label">Internal Outlet Reference / Tag</label>
          <input
            type="text"
            className="co-text-input"
            value={outletRef}
            onChange={(e) => setOutletRef(e.target.value)}
            placeholder="e.g. STORE-05-WK40-RESTOCK"
          />
        </div>

        {/* Row 3 Full Width: Order Notes & Receiving Constraints */}
        <div className="co-form-group col-span-2">
          <div className="co-label-between-row">
            <label className="co-form-label">Order Notes &amp; Receiving Constraints</label>
            <span className="co-optional-label">Optional</span>
          </div>
          <input
            type="text"
            className="co-text-input"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="e.g. Cold storage bay 2 open from 10:00 AM..."
          />
        </div>
      </div>

      {/* Bottom Cut-off & Actions Bar */}
      <div className="co-cutoff-footer-strip">
        <div className="co-cutoff-info-left">
          <div className="co-cutoff-clock-circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="co-cutoff-text-col">
            <span className="co-cutoff-title">
              {cutoffAt
                ? `${outlet.depot} cut-off for ${formatDayLabel(deliveryDate)} in ${formatCountdown(cutoffAt, nowMs)}`
                : 'No delivery available on the selected date'}
            </span>
            <span className="co-cutoff-desc">
              {cutoffAt
                ? `Submit before ${new Date(cutoffAt).toLocaleString('en-GB', { timeZone: 'Asia/Colombo', weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} to be planned for ${formatDate(deliveryDate)} delivery.`
                : `Choose one of the available dates${quickDates[0] ? ` — the next is ${quickDates[0].label}` : ''}.`}
            </span>
          </div>
        </div>

        <div className="co-cutoff-actions-right">
          <button type="button" className="btn-co-discard" onClick={onDiscard} disabled={isBusy}>
            Discard
          </button>
          <button type="button" className="btn-co-save-draft" onClick={onSaveDraft} disabled={isBusy}>
            Save Draft
          </button>
          <button type="button" className="btn-co-submit-primary" onClick={onSubmitOrder} disabled={isBusy || !cutoffAt}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Submit Order</span>
          </button>
        </div>
      </div>
    </div>
  )
}
