export const ISSUE_CATEGORIES = [
  {
    id: 'missing-item',
    label: 'Missing Item',
    desc: 'Expected units absent',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
        <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'damaged-cargo',
    label: 'Damaged Cargo',
    desc: 'Crushed, broken seals',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M12 3v6l3-2 3 5" />
        <path d="M8 21v-4l4 1" />
      </svg>
    ),
  },
  {
    id: 'incorrect-item',
    label: 'Incorrect Item',
    desc: 'Different SKU received',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 3h5v5" />
        <path d="M4 20L21 3" />
        <path d="M21 16v5h-5" />
        <path d="M15 15l6 6" />
        <path d="M4 4l5 5" />
      </svg>
    ),
  },
  {
    id: 'quantity-count',
    label: 'Quantity Count',
    desc: 'Dock tally difference',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="16" y1="14" x2="16" y2="18" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="12" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
      </svg>
    ),
  },
  {
    id: 'delivery-delay',
    label: 'Delivery Delay',
    desc: 'Dock or driver issue',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'other-exception',
    label: 'Other Exception',
    desc: 'Custom dock remark',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
        <circle cx="5" cy="12" r="1.5" />
      </svg>
    ),
  },
]

export default function IssueCategorySelector({ selectedCategory, onSelectCategory }) {
  return (
    <div className="ri-section-card">
      {/* Section Header */}
      <div className="ri-section-header">
        <div className="ri-section-title-wrap">
          <div className="ri-step-bubble">1</div>
          <h2 className="ri-section-title">What is the issue?</h2>
        </div>
        <span className="ri-badge-required">REQUIRED</span>
      </div>
      <p className="ri-section-subtitle">
        Categorize this discrepancy to route to the correct team
      </p>

      {/* 3x2 Grid */}
      <div className="ri-category-grid">
        {ISSUE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id
          return (
            <div
              key={cat.id}
              className={`ri-category-tile ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault()
                  onSelectCategory(cat.id)
                }
              }}
            >
              {isSelected && (
                <div className="ri-tile-check">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              <div className={`ri-tile-icon-box ${isSelected ? 'icon-selected' : ''}`}>
                {cat.icon}
              </div>
              <h3 className="ri-tile-title">{cat.label}</h3>
              <p className="ri-tile-desc">{cat.desc}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
