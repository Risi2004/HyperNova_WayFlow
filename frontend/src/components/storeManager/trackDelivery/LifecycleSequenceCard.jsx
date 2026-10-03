import { formatTimestamp } from '../../../utils/orderFormat'

const STEPS = [
  { name: 'Planned', reached: ['planned'] },
  { name: 'Loaded', reached: ['loaded', 'shortfall'] },
  { name: 'On the road', reached: ['dispatched'] },
  { name: 'Delivered', reached: ['delivered', 'partial', 'failed'] },
  { name: 'Receipt confirmed', reached: ['received', 'disputed'] },
]

// Each step's time is the first time the order reached it in its status history.
export default function LifecycleSequenceCard({ events, status, depot }) {
  const reachedAt = STEPS.map((step) => events.find((e) => step.reached.includes(e.to_status))?.created_at || null)
  const current = STEPS.findIndex((step) => step.reached.includes(status))
  const last = current >= 0 ? current : reachedAt.reduce((acc, at, i) => (at ? i : acc), -1)

  return (
    <div className="td-lifecycle-card">
      <div className="td-lifecycle-header">
        <div className="td-lifecycle-title-group">
          <span className="td-lifecycle-title">DELIVERY LIFECYCLE</span>
        </div>
        <span className="td-lifecycle-dispatched-sub">From the {depot} depot</span>
      </div>

      <div className="td-lifecycle-stepper-wrap">
        <div className="td-stepper-line-track">
          <div className="td-stepper-line-fill" style={{ width: `${Math.max(0, last) * 25}%` }} />
        </div>

        <div className="td-stepper-steps-row">
          {STEPS.map((step, i) => {
            const state = i < last ? 'completed' : i === last ? 'active' : 'upcoming'
            const at = reachedAt[i]
            const label = i === 3 && ['partial', 'failed'].includes(status) ? (status === 'partial' ? 'Part delivered' : 'Not delivered') : i === 4 && status === 'disputed' ? 'Disputed' : step.name
            return (
              <div key={step.name} className={`td-step-item ${state}`}>
                <div className={`td-step-circle ${state}`}>
                  {state === 'completed' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className={`td-step-name ${state === 'active' ? 'blue-bold' : ''}`}>{label}</span>
                <span className="td-step-time">{at ? `${formatTimestamp(at).time}` : '—'}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
