import { useEffect, useState } from 'react'
import { productService } from '../../../services/productService'
import { productCategory } from '../../../utils/orderFormat'

export default function AddProductModal({ isOpen, brand, orderLabel, onClose, onAddProduct }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')
  const [catalog, setCatalog] = useState(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [quantities, setQuantities] = useState({})

  // Load the outlet brand's catalog the first time the modal opens (and again after Retry).
  useEffect(() => {
    if (!isOpen || !brand || catalog || loadFailed) return
    let active = true
    productService
      .getProducts({ brand })
      .then((res) => active && setCatalog(res.products || []))
      .catch(() => active && setLoadFailed(true))
    return () => {
      active = false
    }
  }, [isOpen, brand, catalog, loadFailed])

  if (!isOpen) return null

  const status = loadFailed ? 'error' : catalog ? 'ready' : 'loading'
  const filteredItems = (catalog || []).filter((item) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch = item.product_name.toLowerCase().includes(q) || item.product_id.toLowerCase().includes(q)
    if (selectedFilter === 'ALL') return matchesSearch
    return matchesSearch && productCategory(item).type === selectedFilter.toLowerCase()
  })

  return (
    <div className="co-modal-overlay" onClick={onClose}>
      <div className="co-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="co-modal-header">
          <div className="co-modal-title-col">
            <h3 className="co-modal-title">Add Product to Replenishment Order</h3>
            <span className="co-modal-sub">Waypoint {brand} catalog • adding to {orderLabel}</span>
          </div>
          <button type="button" className="btn-co-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Filters & Search */}
        <div className="co-modal-search-row">
          <div className="co-modal-search-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by product name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="co-modal-filter-pills">
            {['ALL', 'AMBIENT', 'CHILLED', 'FROZEN'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`co-modal-filter-pill ${selectedFilter === cat ? 'active' : ''}`}
                onClick={() => setSelectedFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products List */}
        <div className="co-modal-products-list">
          {status === 'loading' && <div className="co-modal-state">Loading catalog…</div>}
          {status === 'error' && (
            <div className="co-modal-state">
              Could not load the catalog.{' '}
              <button type="button" className="co-modal-retry" onClick={() => setLoadFailed(false)}>
                Retry
              </button>
            </div>
          )}
          {status === 'ready' && filteredItems.length === 0 && (
            <div className="co-modal-state">No products match your search.</div>
          )}

          {filteredItems.map((prod) => {
            const category = productCategory(prod)
            const qty = quantities[prod.product_id] || 1
            return (
              <div key={prod.product_id} className="co-modal-product-item">
                <div className="co-modal-prod-info">
                  <div className="co-modal-prod-name-row">
                    <span className="co-modal-prod-name">{prod.product_name}</span>
                    <span className={`co-category-tag ${category.type}`}>{category.label}</span>
                  </div>
                  <span className="co-modal-prod-sku">
                    {prod.product_id} • {Number(prod.weight_per_unit)} kg / {Number(prod.volume_per_unit)} m³ per {prod.unit}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  className="co-modal-qty-input"
                  value={qty}
                  onChange={(e) => setQuantities((prev) => ({ ...prev, [prod.product_id]: Math.max(1, parseInt(e.target.value, 10) || 1) }))}
                  aria-label={`Quantity of ${prod.product_name}`}
                />
                <button
                  type="button"
                  className="btn-co-modal-add"
                  onClick={() => {
                    onAddProduct(prod, qty)
                    onClose()
                  }}
                >
                  + Add Item
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
