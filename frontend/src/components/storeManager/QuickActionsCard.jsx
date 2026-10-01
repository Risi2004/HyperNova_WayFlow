import { useNavigate } from 'react-router-dom'

export default function QuickActionsCard({
  storeName = 'Store #05 — Colombo Central',
  operatingHours = 'Operating Hours 07:00 - 22:00 • Cold storage ready',
  onCreateOrder,
}) {
  const navigate = useNavigate()

  return (
    <div className="sm-quick-actions-card">
      <div className="sm-card-top-row">
        <div className="sm-card-title-wrap">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <h3 className="sm-subcard-title">Quick Actions</h3>
        </div>
      </div>

      <p className="sm-quick-card-subtitle">
        Store dispatch &amp; replenishment controls.
      </p>

      <button
        type="button"
        className="btn-create-order-primary-big"
        onClick={onCreateOrder || (() => navigate('/store-manager/create-order'))}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <span>Create New Order</span>
      </button>

      <div className="sm-store-info-footer-box">
        <div className="sm-store-icon-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <div className="sm-store-text-block">
          <span className="sm-store-heading">{storeName}</span>
          <span className="sm-store-operating-sub">{operatingHours}</span>
        </div>
      </div>
    </div>
  )
}
