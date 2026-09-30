import { useNavigate } from 'react-router-dom'

export default function RecentlyReceivedCard({
  recentDeliveries = [
    {
      id: 'ORD-1030',
      items: '12 Items',
      receivedTime: 'Received Today • 08:12 AM',
    },
    {
      id: 'ORD-1024',
      items: '20 Items',
      receivedTime: 'Sep 27, 2026 • 03:45 PM',
    },
    {
      id: 'ORD-1019',
      items: '06 Items',
      receivedTime: 'Sep 27, 2026 • 09:10 AM',
    },
  ],
}) {
  const navigate = useNavigate()

  return (
    <div className="sm-recently-received-card">
      <div className="sm-card-top-row">
        <div className="sm-card-title-wrap">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h3 className="sm-subcard-title">Recently Received</h3>
        </div>
        <button
          type="button"
          className="btn-log-history-link"
          onClick={() => navigate('/store-manager/order-history')}
        >
          Log History
        </button>
      </div>

      <p className="sm-recently-card-subtitle">
        Latest deliveries confirmed by your outlet staff.
      </p>

      <div className="sm-recently-items-list">
        {recentDeliveries.map((item) => (
          <div key={item.id} className="sm-recently-item-row">
            <div className="sm-recent-left">
              <div className="sm-recent-check-circle">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div className="sm-recent-text-block">
                <div className="sm-recent-code-row">
                  <span className="sm-recent-order-id">{item.id}</span>
                  <span className="sm-recent-items-badge">{item.items}</span>
                </div>
                <span className="sm-recent-time-sub">{item.receivedTime}</span>
              </div>
            </div>

            <button type="button" className="btn-receipt-detail-icon" title="View Receipt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
