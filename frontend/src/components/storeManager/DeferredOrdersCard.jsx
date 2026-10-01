import { useNavigate } from 'react-router-dom'

export default function DeferredOrdersCard({
  deferredList = [
    {
      id: 'ORD-1032',
      items: '24 Items',
      origDate: 'Sep 28',
      newDate: 'Sep 29',
      reason: 'Vehicle capacity unavailable',
    },
    {
      id: 'ORD-1027',
      items: '16 Items',
      origDate: 'Sep 28',
      newDate: 'Sep 30',
      reason: 'Delivery capacity constraint',
    },
  ],
}) {
  const navigate = useNavigate()

  return (
    <div className="sm-deferred-orders-card">
      <div className="sm-card-top-row">
        <div className="sm-card-title-wrap">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h3 className="sm-subcard-title">Deferred Orders</h3>
        </div>
        <span className="sm-notice-tag-red">NOTICE</span>
      </div>

      <p className="sm-deferred-card-subtitle">
        These orders have been moved to a later delivery run by regional dispatch.
      </p>

      <div className="sm-deferred-items-stack">
        {deferredList.map((item) => (
          <div key={item.id} className="sm-deferred-item-block">
            <div className="sm-deferred-head-row">
              <span className="sm-deferred-order-id">{item.id}</span>
              <span className="sm-deferred-items-pill">{item.items}</span>
            </div>

            <div className="sm-deferred-dates-row">
              <span className="date-orig">Originally: {item.origDate}</span>
              <span className="date-arrow">&rarr;</span>
              <span className="date-new">New Date: {item.newDate}</span>
            </div>

            <div className="sm-deferred-reason-banner">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Reason: {item.reason}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn-view-deferred-outline"
        onClick={() => navigate('/store-manager/orders')}
      >
        View Deferred Orders ({deferredList.length})
      </button>
    </div>
  )
}
