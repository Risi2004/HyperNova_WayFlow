export default function OutletDetailsCard({
  storeName = 'Metro Grocers',
  storeCode = 'Code: OUT043',
  district = 'Colombo 05',
  address = '125 Main Street, Colombo 05',
  contactPerson = 'Outlet Manager',
  role = 'Contact Person',
  phone = '+94 11 234 5678',
  onOpenNavigation,
}) {
  return (
    <div className="stop-sidebar-card outlet-details-card">
      <h4 className="sidebar-card-title">OUTLET DETAILS</h4>

      <div className="outlet-info-stack">
        {/* Store */}
        <div className="outlet-info-row">
          <span className="outlet-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <div className="outlet-text-block">
            <span className="outlet-main-text">{storeName}</span>
            <span className="outlet-sub-text">{storeCode}</span>
          </div>
        </div>

        {/* Location */}
        <div className="outlet-info-row">
          <span className="outlet-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <div className="outlet-text-block">
            <span className="outlet-main-text">{district}</span>
            <span className="outlet-sub-text">{address}</span>
          </div>
        </div>

        {/* Contact Manager */}
        <div className="outlet-info-row">
          <span className="outlet-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </span>
          <div className="outlet-text-block">
            <span className="outlet-main-text">{contactPerson}</span>
            <span className="outlet-sub-text">{role}</span>
          </div>
        </div>

        {/* Phone */}
        <div className="outlet-info-row">
          <span className="outlet-icon-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <div className="outlet-text-block">
            <a href={`tel:${phone}`} className="outlet-phone-link">
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Open Navigation Link */}
      <button
        type="button"
        className="btn-open-navigation-link"
        onClick={onOpenNavigation}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        <span>Open Navigation</span>
      </button>
    </div>
  )
}
