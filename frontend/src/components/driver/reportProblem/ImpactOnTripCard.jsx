export default function ImpactOnTripCard({
  selectedImpact = 'delay',
  onSelectImpact,
}) {
  const impacts = [
    { id: 'stop', label: 'Stop affected' },
    { id: 'delay', label: 'May delay remaining stops' },
    { id: 'cannot_continue', label: 'Cannot continue route' },
  ]

  return (
    <div className="report-sidebar-card impact-on-trip-card">
      <h4 className="sidebar-card-title">Impact on Trip</h4>

      <div className="impact-options-list">
        {impacts.map((option) => {
          const isSelected = selectedImpact === option.id
          return (
            <label
              key={option.id}
              className={`impact-radio-row ${isSelected ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="tripImpact"
                className="impact-hidden-radio"
                checked={isSelected}
                onChange={() => onSelectImpact && onSelectImpact(option.id)}
              />
              <span className={`custom-radio-circle ${isSelected ? 'selected' : ''}`}>
                {isSelected && <span className="custom-radio-dot" />}
              </span>
              <span className="impact-label-text">{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
