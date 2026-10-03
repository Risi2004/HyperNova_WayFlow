import { formatKg, formatM3, productCategory } from '../../../utils/orderFormat'

export default function OrderItemsTable({ items = [] }) {
  const totalWeight = items.reduce((sum, it) => sum + Number(it.total_weight_kg), 0)
  const totalVolume = items.reduce((sum, it) => sum + Number(it.total_volume_m3), 0)

  return (
    <div className="order-details-card items-table-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Order Items</h2>
        <span className="details-card-subtitle">
          {items.length} product{items.length === 1 ? '' : 's'} &bull; complete load requirement
        </span>
      </div>

      <div className="table-responsive">
        <table className="items-data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Weight</th>
              <th>Volume</th>
              <th>Special Requirement</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const category = productCategory(item)
              const cold = category.type !== 'ambient'
              return (
                <tr key={item.item_id}>
                  <td className="item-name-cell">{item.product_name}</td>
                  <td className="item-cat-cell">{item.product_code || '—'}</td>
                  <td className="item-qty-cell">{item.quantity}</td>
                  <td className="item-unit-cell">{item.unit || 'Unit'}</td>
                  <td className="item-weight-cell">{formatKg(item.total_weight_kg)}</td>
                  <td className="item-volume-cell">{formatM3(item.total_volume_m3)}</td>
                  <td>
                    <span className={`item-req-pill ${cold ? 'pill-refrigerated' : 'pill-standard'}`}>
                      {cold ? (
                        <span className="req-pill-icon">&bull;</span>
                      ) : (
                        <span className="req-pill-icon">&#10003;</span>
                      )}
                      <span>{cold ? category.label : 'Standard'}</span>
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="items-total-row">
              <td className="total-label-cell">Total</td>
              <td />
              <td />
              <td />
              <td className="total-val-cell">{formatKg(totalWeight)}</td>
              <td className="total-val-cell">{formatM3(totalVolume)}</td>
              <td className="total-count-cell">
                {items.length} product{items.length === 1 ? '' : 's'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
