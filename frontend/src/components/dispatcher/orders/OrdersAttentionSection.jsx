import attentionIcon from '../../../assets/icons/attention.svg'

export default function OrdersAttentionSection({ onClearFilters }) {
  const attentionItems = [
    {
      id: 'ORD-2026-1052',
      outlet: 'Waypoint Fresh â€“ Kandy',
      reason: 'Delivery window starts in 45 minutes',
      statusText: 'Pending Planning',
      statusType: 'amber',
    },
    {
      id: 'ORD-2026-1061',
      outlet: 'Waypoint Tech â€“ Nugegoda',
      reason: 'Refrigerated requirement',
      statusText: 'No suitable vehicle assigned',
      statusType: 'red',
    },
    {
      id: 'ORD-2026-1070',
      outlet: 'Waypoint Fresh â€“ Colombo 07',
      reason: 'Vehicle capacity constraint',
      statusText: 'Needs planning review',
      statusType: 'red',
    },
  ]

  return (
    <div className="orders-bottom-grid">
      {/* Left Attention Card */}
      <div className="orders-card-panel attention-panel">
        <div className="panel-header-row">
          <div>
            <h3 className="panel-title">Orders Requiring Attention</h3>
            <span className="panel-subtitle">Immediate assignment or planning review</span>
          </div>
          <span className="attention-item-count">3 attention items</span>
        </div>

        <div className="attention-items-list">
          {attentionItems.map((item) => (
            <div key={item.id} className="attention-row-item">
              <div className="attention-row-left">
                <img
                  src={attentionIcon}
                  alt=""
                  className={`attention-row-icon icon-${item.statusType}`}
                  aria-hidden="true"
                />
                <div className="attention-order-meta">
                  <span className="attention-order-id">{item.id}</span>
                  <span className="attention-order-outlet">{item.outlet}</span>
                </div>
              </div>

              <div className="attention-reason-col">
                <span>{item.reason}</span>
              </div>

              <div className="attention-action-col">
                <a
                  href={`#${item.id}`}
                  className={`attention-status-link link-${item.statusType}`}
                >
                  <span>{item.statusText}</span>
                  <span className="link-arrow">&rsaquo;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Alternate Empty State Demo Card */}
      <div className="orders-card-panel no-orders-demo-panel">
        <div className="empty-state-content">
          <div className="empty-icon-box">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </div>
          <h4 className="empty-title">No orders found</h4>
          <p className="empty-desc">Try changing your filters or search criteria.</p>
          <button type="button" className="empty-clear-btn" onClick={onClearFilters}>
            Clear Filters
          </button>
          <span className="empty-state-tag">ALTERNATE NO-RESULTS STATE</span>
        </div>
      </div>
    </div>
  )
}
