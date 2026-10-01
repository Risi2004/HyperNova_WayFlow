export default function PayloadBreakdownCard({
  palletFootprint = '1.2 Euro Pallets',
}) {
  const payloadItems = [
    { name: 'Fresh Farm Milk 1L', count: '24 crates', type: 'chilled' },
    { name: 'Yogurt Assorted 120g', count: '18 crates', type: 'chilled' },
    { name: 'Mineral Water 500ml', count: '40 cases', type: 'ambient' },
    { name: 'Savory Snack Packs', count: '25 cases', type: 'ambient' },
  ]

  return (
    <div className="td-payload-card">
      <div className="td-payload-header">
        <h4 className="td-payload-title">PAYLOAD BREAKDOWN</h4>
        <span className="td-pallet-footprint-tag">{palletFootprint}</span>
      </div>

      <div className="td-payload-items-list">
        {payloadItems.map((item, idx) => (
          <div key={idx} className="td-payload-item-row">
            <div className="td-payload-name-col">
              <span className={`td-payload-bullet ${item.type}`} />
              <span className="td-payload-product-name">{item.name}</span>
            </div>
            <span className="td-payload-count-val">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
