import attentionIcon from '../../../assets/icons/attention.svg'

export default function NeedsAttentionCard() {
  const issues = [
    { id: 1, text: '3 orders cannot currently be assigned', action: 'Review orders', actionLink: '#review-orders', dotColor: '#ef4444' },
    { id: 2, text: 'Reefer capacity nearly full', action: '2 spaces left', actionLink: '#reefer-capacity', dotColor: '#f59e0b' },
    { id: 3, text: '2 deliveries delayed', action: 'View live', actionLink: '#delayed-deliveries', dotColor: '#ef4444' },
    { id: 4, text: '1 vehicle reported a loading issue', action: 'Check WP-142', actionLink: '#vehicle-issue', dotColor: '#f59e0b' },
    { id: 5, text: '4 orders approaching delivery window', action: 'Due within 45 min', actionLink: '#approaching-window', dotColor: '#f59e0b' },
  ]

  return (
    <div className="dashboard-card attention-card">
      <div className="card-header-row">
        <div className="attention-header-left">
          <img src={attentionIcon} alt="" className="attention-header-icon" aria-hidden="true" />
          <h2 className="card-heading">Needs Attention</h2>
        </div>
        <span className="attention-badge-count">5 ISSUES</span>
      </div>

      <ul className="attention-list">
        {issues.map((item) => (
          <li key={item.id} className="attention-item">
            <div className="attention-item-left">
              <span className="attention-dot" style={{ backgroundColor: item.dotColor }} />
              <span className="attention-text">{item.text}</span>
            </div>
            <a href={item.actionLink} className="attention-action-link">
              {item.action}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
