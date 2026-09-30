export default function ManifestContentsTable({
  items = [
    {
      outlet: 'Colombo 03',
      orderId: 'ORD-1042',
      product: 'Fresh Milk 1L',
      quantity: '120 units',
      temp: 'CHILLED',
      tempType: 'chilled',
      status: 'LOADED',
      statusType: 'loaded',
    },
    {
      outlet: 'Colombo 03',
      orderId: 'ORD-1043',
      product: 'Butter 250g',
      quantity: '80 units',
      temp: 'CHILLED',
      tempType: 'chilled',
      status: 'LOADED',
      statusType: 'loaded',
    },
    {
      outlet: 'Bambalapitiya',
      orderId: 'ORD-1048',
      product: 'Yogurt Cups',
      quantity: '80 units',
      temp: 'CHILLED',
      tempType: 'chilled',
      status: 'LOADED',
      statusType: 'loaded',
    },
    {
      outlet: 'Wellawatte',
      orderId: 'ORD-1051',
      product: 'Rice 5kg',
      quantity: '60 units',
      temp: 'AMBIENT',
      tempType: 'ambient',
      status: 'PENDING',
      statusType: 'pending',
    },
    {
      outlet: 'Dehiwala',
      orderId: 'ORD-1057',
      product: 'Frozen Chicken',
      quantity: '40 units',
      temp: 'FROZEN',
      tempType: 'frozen',
      status: 'PENDING',
      statusType: 'pending',
    },
    {
      outlet: 'Mount Lavinia',
      orderId: 'ORD-1061',
      product: 'Fresh Vegetables',
      quantity: '90 units',
      temp: 'CHILLED',
      tempType: 'chilled',
      status: 'PENDING',
      statusType: 'pending',
    },
  ],
}) {
  return (
    <div className="loader-detail-card manifest-contents-card">
      <div className="detail-card-header">
        <h3 className="detail-card-title">Manifest Load Contents</h3>
        <p className="detail-card-subtitle">
          Manifest of chilled, frozen, and ambient cargo allocated to vehicle bay
        </p>
      </div>

      <div className="manifest-table-responsive">
        <table className="manifest-table">
          <thead>
            <tr>
              <th>OUTLET</th>
              <th>ORDER ID</th>
              <th>PRODUCT / ITEM</th>
              <th>QUANTITY</th>
              <th>TEMP</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.orderId} className="manifest-row">
                <td className="td-manifest-outlet">{row.outlet}</td>
                <td className="td-manifest-order">
                  <span className="manifest-order-link">{row.orderId}</span>
                </td>
                <td className="td-manifest-product">{row.product}</td>
                <td className="td-manifest-qty">{row.quantity}</td>
                <td className="td-manifest-temp">
                  <span className={`temp-badge temp-${row.tempType}`}>
                    {row.temp}
                  </span>
                </td>
                <td className="td-manifest-status">
                  <span className={`manifest-status-badge status-${row.statusType}`}>
                    {row.status}
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
