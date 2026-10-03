import { ISSUE_CATEGORIES } from './issueCategories'

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
