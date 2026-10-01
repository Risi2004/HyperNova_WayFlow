export default function ManifestModal({
  isOpen,
  onClose,
  orderId = 'ORD-1042',
  tripId = 'TR-024',
}) {
  if (!isOpen) return null

  const items = [
    { name: 'Fresh Farm Milk 1L', category: 'Chilled (+4°C)', qty: '24 Crates', weight: '240 kg' },
    { name: 'Yogurt Assorted 120g', category: 'Chilled (+4°C)', qty: '18 Crates', weight: '90 kg' },
    { name: 'Mineral Water 500ml', category: 'Ambient', qty: '40 Cases', weight: '200 kg' },
    { name: 'Savory Snack Packs', category: 'Ambient', qty: '25 Cases', weight: '110 kg' },
  ]

  return (
    <div className="td-modal-overlay" onClick={onClose}>
      <div className="td-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="td-modal-header">
          <div className="td-modal-title-col">
            <h3 className="td-modal-title">Order Manifest — {orderId}</h3>
            <span className="td-modal-sub">Assigned Trip: {tripId} &bull; Delivery Unit WP-REF-007</span>
          </div>
          <button type="button" className="btn-td-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="td-modal-content">
          <div className="td-manifest-meta-grid">
            <div>
              <span className="label">Destination:</span>
              <span className="val">Colombo 05 Store (OUT043)</span>
            </div>
            <div>
              <span className="label">Receiving Bay:</span>
              <span className="val">Bay 02 Dock Ramp</span>
            </div>
            <div>
              <span className="label">Total Units:</span>
              <span className="val">107 Units (4 Product Lines)</span>
            </div>
            <div>
              <span className="label">Estimated Gross Weight:</span>
              <span className="val">~640 kg</span>
            </div>
          </div>

          <table className="td-manifest-items-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>QUANTITY</th>
                <th>WEIGHT</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => (
                <tr key={i}>
                  <td><strong>{it.name}</strong></td>
                  <td><span className={`cat-pill ${it.category.includes('Chilled') ? 'chilled' : 'ambient'}`}>{it.category}</span></td>
                  <td>{it.qty}</td>
                  <td>{it.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="td-modal-footer">
          <button type="button" className="btn-td-secondary" onClick={onClose}>Close</button>
          <button type="button" className="btn-td-primary" onClick={() => window.print()}>Print Manifest</button>
        </div>
      </div>
    </div>
  )
}
