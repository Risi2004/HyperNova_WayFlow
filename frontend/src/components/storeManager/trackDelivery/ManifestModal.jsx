import { formatKg } from '../../../utils/orderFormat'

export default function ManifestModal({ isOpen, onClose, order, plan, items, outletName }) {
  if (!isOpen) return null

  return (
    <div className="td-modal-overlay" onClick={onClose}>
      <div className="td-modal-box" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="td-modal-header">
          <div className="td-modal-title-col">
            <h3 className="td-modal-title">Order Manifest — {order.order_id}</h3>
            <span className="td-modal-sub">{plan ? `Trip ${plan.trip_id} • ${plan.vehicle_id}` : 'Not on a trip yet'}</span>
          </div>
          <button type="button" className="btn-td-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="td-modal-content">
          <div className="td-manifest-meta-grid">
            <div>
              <span className="label">Destination:</span>
              <span className="val">{outletName} ({order.outlet_id})</span>
            </div>
            <div>
              <span className="label">Temperature:</span>
              <span className="val">{order.temp_requirement === 'chilled' ? 'Chilled' : 'Ambient'}</span>
            </div>
            <div>
              <span className="label">Total units:</span>
              <span className="val">{order.total_units} ({order.sku_count} lines)</span>
            </div>
            <div>
              <span className="label">Gross weight:</span>
              <span className="val">{formatKg(order.total_weight_kg)}</span>
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
              {items.map((it) => (
                <tr key={it.item_id}>
                  <td><strong>{it.product_name}</strong></td>
                  <td><span className={`cat-pill ${it.temp_requirement === 'chilled' ? 'chilled' : 'ambient'}`}>{it.temp_requirement === 'chilled' ? 'Chilled' : 'Ambient'}</span></td>
                  <td>{it.quantity} {it.unit.toLowerCase()}{it.quantity === 1 ? '' : 's'}</td>
                  <td>{formatKg(it.total_weight_kg)}</td>
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
