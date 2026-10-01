export default function DeliveredItemsTable({
  items,
  onUpdateDeliveredQty,
  onUpdateCondition,
  onSetAllGood,
}) {
  const verifiedCount = items.filter((it) => it.condition === 'Good').length

  const totalOrdered = items.reduce((acc, it) => acc + it.orderedQty, 0)
  const totalReceived = items.reduce((acc, it) => acc + it.deliveredQty, 0)

  return (
    <div className="cr-table-card">
      {/* Top Header */}
      <div className="cr-table-header">
        <div className="cr-table-title-col">
          <div className="cr-title-row">
            <h3 className="cr-table-title">Delivered Items</h3>
            <span className="cr-verified-badge">{verifiedCount} of {items.length} Verified</span>
          </div>
          <p className="cr-table-subtitle">
            Review the delivered quantities and condition before confirming receipt.
          </p>
        </div>

        <button
          type="button"
          className="btn-set-all-good"
          onClick={onSetAllGood}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Set All as Good</span>
        </button>
      </div>

      {/* Table */}
      <div className="cr-items-table-wrapper">
        <table className="cr-items-table">
          <thead>
            <tr>
              <th className="th-product">PRODUCT &amp; SKU</th>
              <th className="th-class">CLASS</th>
              <th className="th-ordered">ORDERED</th>
              <th className="th-delivered">DELIVERED QTY</th>
              <th className="th-condition">CONDITION</th>
              <th className="th-status text-right">LINE STATUS</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="cr-table-row">
                {/* Product & SKU */}
                <td className="td-product">
                  <div className="cr-product-cell">
                    <div className="cr-product-thumb">
                      {item.category === 'chilled' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                        </svg>
                      )}
                    </div>
                    <div className="cr-product-text">
                      <h4 className="cr-product-name">{item.name}</h4>
                      <span className="cr-product-sku">{item.sku}</span>
                    </div>
                  </div>
                </td>

                {/* Class */}
                <td className="td-class">
                  <span className={`cr-class-tag ${item.category}`}>
                    {item.classLabel}
                  </span>
                </td>

                {/* Ordered */}
                <td className="td-ordered">
                  <span className="cr-ordered-text">{item.orderedQty} {item.unit}</span>
                </td>

                {/* Delivered Qty Stepper */}
                <td className="td-delivered">
                  <div className="cr-stepper-wrap">
                    <button
                      type="button"
                      className="btn-cr-stepper"
                      onClick={() => onUpdateDeliveredQty(item.id, -1)}
                      disabled={item.deliveredQty <= 0}
                    >
                      −
                    </button>
                    <span className="cr-stepper-val">{item.deliveredQty}</span>
                    <button
                      type="button"
                      className="btn-cr-stepper"
                      onClick={() => onUpdateDeliveredQty(item.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Condition Pills */}
                <td className="td-condition">
                  <div className="cr-condition-segment">
                    <button
                      type="button"
                      className={`btn-condition ${item.condition === 'Good' ? 'active-good' : ''}`}
                      onClick={() => onUpdateCondition(item.id, 'Good')}
                    >
                      Good
                    </button>
                    <button
                      type="button"
                      className={`btn-condition ${item.condition === 'Damaged' ? 'active-damaged' : ''}`}
                      onClick={() => onUpdateCondition(item.id, 'Damaged')}
                    >
                      Damaged
                    </button>
                    <button
                      type="button"
                      className={`btn-condition ${item.condition === 'Missing' ? 'active-missing' : ''}`}
                      onClick={() => onUpdateCondition(item.id, 'Missing')}
                    >
                      Missing
                    </button>
                  </div>
                </td>

                {/* Line Status */}
                <td className="td-status text-right">
                  <span className={`cr-line-status ${item.condition === 'Good' ? 'ready' : 'flagged'}`}>
                    {item.condition === 'Good' ? 'Ready' : item.condition}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Totals Footer */}
      <div className="cr-table-footer-bar">
        <div className="cr-footer-stats-left">
          <span>Total Ordered: <strong>{totalOrdered} Units</strong></span>
          <span className="sep">&bull;</span>
          <span>Total Received: <strong>{totalReceived} Units</strong></span>
          <span className="sep">&bull;</span>
          <span>Pallet Footprint: <strong>~1.2 Euro Pallets</strong></span>
        </div>

        <div className="cr-footer-verified-right">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>All Items Scanned &amp; Count Verified</span>
        </div>
      </div>
    </div>
  )
}
