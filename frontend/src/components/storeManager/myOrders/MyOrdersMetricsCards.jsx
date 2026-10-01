export default function MyOrdersMetricsCards({
  counts = {
    all: 24,
    pending: 3,
    inDelivery: 2,
    completed: 17,
    deferred: 2,
  },
  activeFilter = 'ALL',
  onSelectFilter,
}) {
  const cards = [
    {
      id: 'ALL',
      label: 'All Orders',
      count: counts.all < 10 ? `0${counts.all}` : `${counts.all}`,
      sub: 'Total outlet orders',
      colorClass: 'default',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      id: 'PENDING',
      label: 'Pending',
      count: counts.pending < 10 ? `0${counts.pending}` : `${counts.pending}`,
      sub: 'Depot staging',
      colorClass: 'orange',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'IN_DELIVERY',
      label: 'In Delivery',
      count: counts.inDelivery < 10 ? `0${counts.inDelivery}` : `${counts.inDelivery}`,
      sub: 'En route transit',
      colorClass: 'blue',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: 'COMPLETED',
      label: 'Completed',
      count: counts.completed < 10 ? `0${counts.completed}` : `${counts.completed}`,
      sub: 'Receipts verified',
      colorClass: 'green',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      id: 'DEFERRED',
      label: 'Deferred',
      count: counts.deferred < 10 ? `0${counts.deferred}` : `${counts.deferred}`,
      sub: 'Rescheduled',
      colorClass: 'red',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <line x1="10" y1="14" x2="14" y2="18" />
          <line x1="14" y1="14" x2="10" y2="18" />
        </svg>
      ),
    },
  ]

  return (
    <div className="mo-metrics-row">
      {cards.map((card) => {
        const isSelected = activeFilter === card.id
        return (
          <div
            key={card.id}
            className={`mo-metric-card ${card.colorClass} ${isSelected ? 'active-filter' : ''}`}
            onClick={() => onSelectFilter && onSelectFilter(card.id)}
            role="button"
            tabIndex={0}
          >
            <div className="mo-metric-top">
              <span className="mo-metric-label">{card.label}</span>
              <div className={`mo-metric-icon-box ${card.colorClass}`}>
                {card.icon}
              </div>
            </div>

            <div className="mo-metric-bottom">
              <span className={`mo-metric-count ${card.colorClass}`}>
                {card.count}
              </span>
              <span className="mo-metric-sub">{card.sub}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
