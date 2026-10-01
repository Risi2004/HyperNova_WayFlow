export default function OrderScheduleCard({
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
  const quickDates = [
    { label: 'Tomorrow (Sep 29)', value: 'Sep 29, 2026' },
    { label: 'Wed (Sep 30)', value: 'Sep 30, 2026' },
    { label: 'Thu (Oct 01)', value: 'Oct 01, 2026' },
  ]

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
        <span className="co-dispatch-tag">WayFlow Dispatch #04</span>
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
              type="text"
              className="co-text-input"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              placeholder="e.g. Sep 29, 2026"
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
              <option value="Morning (10:30 AM - 11:00 AM - Recommended Standard)">
                Morning (10:30 AM - 11:00 AM - Recommended Standard)
              </option>
              <option value="Early Morning (06:30 AM - 08:00 AM)">
                Early Morning (06:30 AM - 08:00 AM)
              </option>
              <option value="Midday (12:00 PM - 01:30 PM)">
                Midday (12:00 PM - 01:30 PM)
              </option>
              <option value="Afternoon (03:00 PM - 04:30 PM)">
                Afternoon (03:00 PM - 04:30 PM)
              </option>
            </select>
            <div className="co-select-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <span className="co-input-hint">
            Colombo 05 unloading dock has dedicated bay priority during morning slot.
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
            <span className="co-cutoff-title">Peliyagoda Cut-off in 4h 15m</span>
            <span className="co-cutoff-desc">
              Orders submitted by 18:00 PM will depart on tomorrow morning&apos;s Run #04.
            </span>
          </div>
        </div>

        <div className="co-cutoff-actions-right">
          <button type="button" className="btn-co-discard" onClick={onDiscard}>
            Discard
          </button>
          <button type="button" className="btn-co-save-draft" onClick={onSaveDraft}>
            Save Draft
          </button>
          <button type="button" className="btn-co-submit-primary" onClick={onSubmitOrder}>
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
