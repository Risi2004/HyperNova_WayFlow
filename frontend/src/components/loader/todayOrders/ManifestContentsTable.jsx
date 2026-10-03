// Rows are order items; the first row of each order carries the loader's check for that order.
export default function ManifestContentsTable({ items = [], canEdit = false, busyOrderId = null, onLoaded, onShort }) {
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
              {canEdit && <th>CHECK</th>}
              <th>PRODUCT / ITEM</th>
              <th>QUANTITY</th>
              <th>TEMP</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.key} className={`manifest-row ${row.firstOfOrder ? 'manifest-order-start' : ''}`}>
                <td className="td-manifest-outlet">{row.firstOfOrder ? row.outlet : ''}</td>
                <td className="td-manifest-order">
                  {row.firstOfOrder && <span className="manifest-order-link">{row.orderId}</span>}
                </td>
                {canEdit && (
                  <td className="td-manifest-check">
                    {row.firstOfOrder && !row.checked && (
                      <div className="manifest-check-actions">
                        <button
                          type="button"
                          className="btn-manifest-loaded"
                          disabled={busyOrderId === row.orderId}
                          onClick={() => onLoaded(row.orderId)}
                        >
                          ✓ Loaded
                        </button>
                        <button type="button" className="btn-manifest-short" onClick={() => onShort(row.orderId)}>
                          Short
                        </button>
                      </div>
                    )}
                <td className="td-manifest-product">{row.product}</td>
                <td className="td-manifest-qty">{row.quantity}</td>
                <td className="td-manifest-temp">
                  <span className={`temp-badge temp-${row.tempType}`}>
                    {row.temp}
                  </span>
                </td>
                <td className="td-manifest-status">
                  {row.firstOfOrder && (
                    <span className={`manifest-status-badge status-${row.statusType}`}>
                      {row.status}
                    </span>
                  )}
                </td>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
