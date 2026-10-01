import { useState } from 'react'

const AVAILABLE_CATALOG = [
  {
    id: 101,
    name: 'Samba Rice 5kg (Special Raw)',
    category: 'Ambient',
    type: 'ambient',
    sku: 'SKU: GRD-RIC-90422 Bags / Case: Groceries',
    weightPerCase: 50,
    defaultCases: 5,
  },
  {
    id: 102,
    name: 'Anchor Pure Butter 227g',
    category: 'Chilled (+4°C)',
    type: 'chilled',
    sku: 'Dairy Products  24 Packs / Case  SKU: DAI-BTR-004',
    weightPerCase: 8,
    defaultCases: 4,
  },
  {
    id: 103,
    name: 'Ocean Fresh Frozen Salmon Fillets 500g',
    category: 'Frozen (-18°C)',
    type: 'frozen',
    sku: 'Seafood/FRZ  FRZ-SEA-104-12 Packs / Case',
    weightPerCase: 12,
    defaultCases: 6,
  },
  {
    id: 104,
    name: 'Kotmale Full Cream Fresh Milk 1L',
    category: 'Chilled (+4°C)',
    type: 'chilled',
    sku: 'Dairy Products  12 Bottles / Case  SKU: DAI-KOT-012',
    weightPerCase: 14,
    defaultCases: 8,
  },
  {
    id: 105,
    name: 'Sunlight Washing Powder 1kg',
    category: 'Ambient',
    type: 'ambient',
    sku: 'Cleaning  10 Packs / Case  SKU: CLN-SUN-001',
    weightPerCase: 10,
    defaultCases: 10,
  },
]

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('ALL')

  if (!isOpen) return null

  const filteredItems = AVAILABLE_CATALOG.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    if (selectedFilter === 'ALL') return matchesSearch
    return matchesSearch && item.type === selectedFilter.toLowerCase()
  })

  return (
    <div className="co-modal-overlay" onClick={onClose}>
      <div className="co-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="co-modal-header">
          <div className="co-modal-title-col">
            <h3 className="co-modal-title">Add Product to Replenishment Order</h3>
            <span className="co-modal-sub">Select catalog items to add to order ORD-1043</span>
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
              placeholder="Search by product name or SKU..."
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
          {filteredItems.map((prod) => (
            <div key={prod.id} className="co-modal-product-item">
              <div className="co-modal-prod-info">
                <div className="co-modal-prod-name-row">
                  <span className="co-modal-prod-name">{prod.name}</span>
                  <span className={`co-category-tag ${prod.type}`}>{prod.category}</span>
                </div>
                <span className="co-modal-prod-sku">{prod.sku}</span>
              </div>
              <button
                type="button"
                className="btn-co-modal-add"
                onClick={() => {
                  onAddProduct({
                    id: Date.now(),
                    name: prod.name,
                    category: prod.category,
                    type: prod.type,
                    sku: prod.sku,
                    weightPerCase: prod.weightPerCase,
                    cases: prod.defaultCases,
                  })
                  onClose()
                }}
              >
                + Add Item
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
