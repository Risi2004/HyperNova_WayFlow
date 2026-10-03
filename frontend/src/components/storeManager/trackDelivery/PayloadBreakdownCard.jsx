import { formatKg, formatM3 } from '../../../utils/orderFormat'

export default function PayloadBreakdownCard({ items, order }) {
  return (
    <div className="td-payload-card">
      <div className="td-payload-header">
        <h4 className="td-payload-title">YOUR ORDER</h4>
        <span className="td-pallet-footprint-tag">
          {formatKg(order.total_weight_kg)} &bull; {formatM3(order.total_volume_m3)}
        </span>
      </div>

      <div className="td-payload-items-list">
        {items.map((item) => (
          <div key={item.item_id} className="td-payload-item-row">
            <div className="td-payload-name-col">
              <span className={`td-payload-bullet ${item.temp_requirement === 'chilled' ? 'chilled' : 'ambient'}`} />
              <span className="td-payload-product-name">{item.product_name}</span>
            </div>
            <span className="td-payload-count-val">
              {item.quantity} {item.unit.toLowerCase()}{item.quantity === 1 ? '' : 's'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
