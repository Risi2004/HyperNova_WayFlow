export default function SingleDeliveryItemsTable() {
  const items = [
    {
      product: 'Fresh Milk 1L',
      category: 'Dairy',
      qty: '120 units',
      weight: '120 kg',
      temp: 'Chilled (2â€“6Â°C)',
      status: 'Accepted â€” Perfect condition',
    },
    {
      product: 'Yoghurt Pack (6-pack)',
      category: 'Dairy',
      qty: '80 packs',
      weight: '80 kg',
      temp: 'Chilled (2â€“6Â°C)',
      status: 'Accepted â€” Perfect condition',
    },
    {
      product: 'Artisan Butter Blocks',
      category: 'Dairy',
      qty: '40 blocks',
      weight: '60 kg',
      temp: 'Chilled (2â€“6Â°C)',
      status: 'Accepted â€” Perfect condition',
    },
    {
      product: 'Farm Fresh Organic Eggs (Crates)',
      category: 'Poultry',
      qty: '50 crates',
      weight: '150 kg',
      temp: 'Ambient / Cool',
      status: 'Accepted â€” Intact seal',
    },
    {
      product: 'Imported Hard Cheeses',
      category: 'Dairy',
      qty: '30 wheels',
      weight: '90 kg',
      temp: 'Chilled (2â€“6Â°C)',
      status: 'Accepted â€” Perfect condition',
    },
    {
      product: 'Fresh Double Cream 500ml',
      category: 'Dairy',
      qty: '120 tubs',
      weight: '120 kg',
      temp: 'Chilled (2â€“6Â°C)',
      status: 'Accepted â€” Perfect condition',
    },
  ]

  return (
    <div className="single-card single-items-card">
      <div className="single-card-header flex-between">
        <div>
          <h2 className="single-card-title">Delivered Manifest & Acceptance</h2>
          <p className="single-card-subtitle">
            6 line items Â· 440 total units Â· 620 kg delivered weight
          </p>
        </div>
        <span className="all-items-accepted-pill">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>100% Items Accepted</span>
        </span>
      </div>

      <div className="table-responsive-container">
        <table className="delivery-items-grid-table">
          <thead>
            <tr>
              <th>PRODUCT</th>
              <th>CATEGORY</th>
              <th>QUANTITY</th>
              <th>WEIGHT</th>
              <th>TEMPERATURE CLASS</th>
              <th>RECEIVER STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="td-product-name bold">{item.product}</td>
                <td className="td-category">{item.category}</td>
                <td className="td-qty bold">{item.qty}</td>
                <td className="td-weight">{item.weight}</td>
                <td className="td-temp">{item.temp}</td>
                <td className="td-status">
                  <span className="accepted-condition-badge">
                    <span className="dot"></span>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
