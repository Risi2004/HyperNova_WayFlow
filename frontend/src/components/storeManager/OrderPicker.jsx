import { useNavigate } from 'react-router-dom'
import { dispatchStatusOf, formatShortDate } from '../../utils/orderFormat'
import './OrderPicker.css'

// Lists the outlet's orders a page can act on when it was opened without ?orderId.
export default function OrderPicker({ title, hint, orders, path, emptyText }) {
  const navigate = useNavigate()
  return (
    <section className="sm-order-picker">
      <h2>{title}</h2>
      {hint && <p className="sm-order-picker-hint">{hint}</p>}
      {orders.length === 0 ? (
        <p className="sm-order-picker-empty">{emptyText}</p>
      ) : (
        <ul>
          {orders.map((o) => (
            <li key={o.order_id}>
              <button type="button" onClick={() => navigate(`${path}?orderId=${encodeURIComponent(o.order_id)}`)}>
                <span className="sm-order-picker-id">{o.order_id}</span>
                <span>{formatShortDate(o.target_delivery_date)} • {o.total_units} units • {o.temp_requirement}</span>
                <span className={`sm-order-picker-status ${dispatchStatusOf(o.status).type}`}>{dispatchStatusOf(o.status).label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
