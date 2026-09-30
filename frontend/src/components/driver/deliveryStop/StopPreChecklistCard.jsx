export default function StopPreChecklistCard({
  checks = [
    { id: 1, label: 'Correct outlet verified', checked: true },
    { id: 2, label: 'Delivery window checked and matched', checked: true },
    { id: 3, label: 'Order information reviewed and items counted', checked: true },
    { id: 4, label: 'Delivery instructions reviewed completely', checked: true },
  ],
  onToggleCheck,
}) {
  return (
    <div className="stop-detail-card stop-prechecklist-card">
      <h3 className="card-section-title">Before Recording Delivery</h3>

      <div className="prechecklist-items-list">
        {checks.map((item) => (
          <label key={item.id} className="precheck-item-row">
            <input
              type="checkbox"
              className="precheck-hidden-input"
              checked={item.checked}
              onChange={() => onToggleCheck && onToggleCheck(item.id)}
            />
            <span className={`precheck-custom-checkbox ${item.checked ? 'checked' : ''}`}>
              {item.checked && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span className={`precheck-label-text ${item.checked ? 'verified' : ''}`}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
