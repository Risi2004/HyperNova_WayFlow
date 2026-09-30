export default function DeliveryConfirmationStatusCard({
  hasProof = false,
  outletName = 'Metro Grocers',
  orderId = 'ORD-1042',
}) {
  const steps = [
    {
      id: 'outlet',
      title: 'Outlet',
      statusText: `${outletName} Verified`,
      completed: true,
    },
    {
      id: 'order',
      title: 'Order',
      statusText: `${orderId} Verified`,
      completed: true,
    },
    {
      id: 'delivery',
      title: 'Delivery',
      statusText: 'Successfully Delivered',
      completed: true,
    },
    {
      id: 'proof',
      title: 'Proof',
      statusText: hasProof ? 'Proof Captured' : 'Not yet added',
      completed: hasProof,
    },
  ]

  return (
    <div className="delivery-confirmation-status-card">
      <h3 className="confirmation-card-title">Delivery Confirmation</h3>

      <div className="confirmation-steps-list">
        {steps.map((step) => (
          <div key={step.id} className={`confirmation-step-row ${step.completed ? 'completed' : 'pending'}`}>
            <div className={`step-status-icon-wrap ${step.completed ? 'completed' : 'pending'}`}>
              {step.completed ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="step-pending-dot" />
              )}
            </div>

            <div className="step-content-block">
              <span className="step-title-text">{step.title}</span>
              <span className={`step-status-text ${step.completed ? 'completed' : 'pending'}`}>
                {step.statusText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
