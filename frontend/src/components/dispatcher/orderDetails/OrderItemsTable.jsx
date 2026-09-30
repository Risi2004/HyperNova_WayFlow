export default function OrderItemsTable() {
  const items = [
    {
      name: 'Fresh Milk 1L',
      category: 'Dairy',
      qty: 120,
      unit: 'Units',
      weight: '120 kg',
      volume: '0.8 mÂ³',
      requirement: 'Refrigerated',
      reqType: 'refrigerated',
    },
    {
      name: 'Yoghurt Pack',
      category: 'Dairy',
      qty: 80,
      unit: 'Units',
      weight: '80 kg',
      volume: '0.6 mÂ³',
      requirement: 'Refrigerated',
      reqType: 'refrigerated',
    },
    {
      name: 'Vegetable Pack',
      category: 'Fresh Produce',
      qty: 100,
      unit: 'Units',
      weight: '150 kg',
      volume: '1.2 mÂ³',
      requirement: 'Standard',
      reqType: 'standard',
    },
    {
      name: 'Fruit Crate',
      category: 'Fresh Produce',
      qty: 35,
      unit: 'Crates',
      weight: '70 kg',
      volume: '1.2 mÂ³',
      requirement: 'Standard',
      reqType: 'standard',
    },
  ]

  return (
    <div className="order-details-card items-table-card">
      <div className="card-top-title-group">
        <h2 className="details-card-title">Order Items</h2>
        <span className="details-card-subtitle">4 products &bull; complete load requirement</span>
      </div>

      <div className="table-responsive">
        <table className="items-data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Weight</th>
              <th>Volume</th>
              <th>Special Requirement</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td className="item-name-cell">{item.name}</td>
                <td className="item-cat-cell">{item.category}</td>
                <td className="item-qty-cell">{item.qty}</td>
                <td className="item-unit-cell">{item.unit}</td>
                <td className="item-weight-cell">{item.weight}</td>
                <td className="item-volume-cell">{item.volume}</td>
                <td>
                  <span className={`item-req-pill pill-${item.reqType}`}>
                    {item.reqType === 'refrigerated' ? (
                      <span className="req-pill-icon">&bull;</span>
                    ) : (
                      <span className="req-pill-icon">&#10003;</span>
                    )}
                    <span>{item.requirement}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="items-total-row">
              <td className="total-label-cell">Total</td>
              <td />
              <td />
              <td />
              <td className="total-val-cell">420 kg</td>
              <td className="total-val-cell">3.8 mÂ³</td>
              <td className="total-count-cell">4 products</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
