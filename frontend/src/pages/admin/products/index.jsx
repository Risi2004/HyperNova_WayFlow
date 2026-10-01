import { useState, useEffect, useMemo } from 'react'
import AdminSidebar from '../../../components/admin/AdminSidebar'
import AddProductModal from '../../../components/admin/AddProductModal'
import { productService } from '../../../services/productService'
import './AdminProducts.css'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [selectedTemp, setSelectedTemp] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await productService.getProducts({
        brand: selectedBrand,
        temp: selectedTemp,
        search: searchTerm,
      })
      setProducts(data.products || [])
      setStats(data.stats || {})
    } catch (err) {
      console.error('Failed to load products:', err)
      showToast('⚠️ Could not load products from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [selectedBrand, selectedTemp])

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts()
    }, 250)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage('')
    }, 4500)
  }

  // Handle adding new product
  const handleAddProduct = async (productData) => {
    const res = await productService.createProduct(productData)
    if (res.product) {
      setProducts((prev) => [res.product, ...prev])
      showToast(`✔ Added product ${res.product.product_id} (${res.product.product_name}) to catalog.`)
      fetchProducts()
    }
  }

  // Handle deleting product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove '${name}' (${id}) from the master catalog?`)) {
      return
    }
    try {
      await productService.deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.product_id !== id))
      showToast(`✔ Removed product ${id} from catalog.`)
      fetchProducts()
    } catch (err) {
      showToast(`❌ Failed to delete product: ${err.message}`)
    }
  }

  return (
    <div className="admin-products-container">
      {/* Static Left Sidebar */}
      <AdminSidebar activeTab="products" />

      {/* Scrollable Right Content */}
      <main className="admin-products-content">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="admin-toast-notification">
            <span>{toastMessage}</span>
            <button type="button" className="btn-toast-close" onClick={() => setToastMessage('')}>✕</button>
          </div>
        )}

        {/* Top Header */}
        <div className="admin-products-header">
          <div>
            <h1 className="admin-products-title">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              Commodity Products Master Catalog
            </h1>
            <p className="admin-products-subtitle">
              Enterprise SKU registry governing unit weights, volumetric footprints, and cold-chain assignments.
            </p>
          </div>

          <button
            type="button"
            className="btn-add-product"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Register New Product</span>
          </button>
        </div>

        {/* Catalog Statistics */}
        <div className="admin-product-stats-grid">
          {/* Card 1: Total */}
          <div className="product-stat-card">
            <div className="product-stat-card-header">
              <span className="product-stat-label">Total Catalog SKUs</span>
              <div className="product-stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
                📦
              </div>
            </div>
            <div className="product-stat-value">{stats.total || products.length}</div>
            <div className="product-stat-meta">
              <span>Verified logistics payloads across all 3 retail sectors</span>
            </div>
          </div>

          {/* Card 2: Fresh */}
          <div className="product-stat-card">
            <div className="product-stat-card-header">
              <span className="product-stat-label">Fresh (Perishables)</span>
              <div className="product-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                🥗
              </div>
            </div>
            <div className="product-stat-value">{stats.fresh_count || 55}</div>
            <div className="product-stat-meta">
              <span>{stats.reefer_count || 32} Reefer Cold-Chain &bull; 23 Ambient</span>
            </div>
          </div>

          {/* Card 3: Tech */}
          <div className="product-stat-card">
            <div className="product-stat-card-header">
              <span className="product-stat-label">Tech (Hardware)</span>
              <div className="product-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                ⚡
              </div>
            </div>
            <div className="product-stat-value">{stats.tech_count || 55}</div>
            <div className="product-stat-meta">
              <span>High-value computing, displays & networking</span>
            </div>
          </div>

          {/* Card 4: Style */}
          <div className="product-stat-card">
            <div className="product-stat-card-header">
              <span className="product-stat-label">Style (Lifestyle)</span>
              <div className="product-stat-icon" style={{ background: 'rgba(192, 132, 252, 0.15)', color: '#c084fc' }}>
                ✨
              </div>
            </div>
            <div className="product-stat-value">{stats.style_count || 55}</div>
            <div className="product-stat-meta">
              <span>Apparel, calfskin footwear & home linens</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="admin-products-toolbar">
          <div className="admin-products-search-row">
            <div className="product-search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="product-search-input"
                placeholder="Search products by title, SKU, or Product ID (e.g. Milk, PRD-TC-001)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>

            <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Showing <strong>{products.length}</strong> of <strong>{stats.total || products.length}</strong> products
            </div>
          </div>

          {/* Category & Temperature Filter Pills */}
          <div className="admin-filter-pills-row">
            {/* Brand Filter */}
            <div className="filter-pills-group">
              <span className="filter-pill-label">Category Brand:</span>
              {['All', 'Fresh', 'Tech', 'Style'].map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={`btn-filter-pill ${selectedBrand === brand ? 'active' : ''}`}
                  onClick={() => setSelectedBrand(brand)}
                >
                  {brand === 'Fresh' && '🥗'}
                  {brand === 'Tech' && '⚡'}
                  {brand === 'Style' && '✨'}
                  {brand === 'All' && '🌐'}
                  <span>{brand === 'All' ? 'All Brands' : brand}</span>
                </button>
              ))}
            </div>

            {/* Temperature Filter */}
            <div className="filter-pills-group">
              <span className="filter-pill-label">Thermal Mode:</span>
              {['All', 'reefer', 'ambient'].map((temp) => (
                <button
                  key={temp}
                  type="button"
                  className={`btn-filter-pill ${selectedTemp === temp ? 'active' : ''}`}
                  onClick={() => setSelectedTemp(temp)}
                >
                  {temp === 'reefer' && '❄️ Reefer Cold-Chain'}
                  {temp === 'ambient' && '📦 Ambient Dry-Box'}
                  {temp === 'All' && 'All Modes'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table Card */}
        <div className="admin-products-table-card">
          {loading ? (
            <div className="admin-products-empty">
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔄</div>
              <p>Loading master catalog from Neon database...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="admin-products-empty">
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
              <h3 style={{ color: '#f8fafc', margin: '0 0 6px 0' }}>No Products Found</h3>
              <p>No products match the selected filters or search keyword.</p>
            </div>
          ) : (
            <table className="admin-products-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Brand Category</th>
                  <th>Storage Thermal</th>
                  <th>Weight / Unit</th>
                  <th>Volume / Unit</th>
                  <th>Packaging Unit</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => {
                  const brandClass = item.brand.toLowerCase()
                  const isReefer = item.temperature_requirement?.toLowerCase() === 'reefer'
                  return (
                    <tr key={item.product_id}>
                      <td>
                        <span className="product-id-pill">{item.product_id}</span>
                      </td>
                      <td>
                        <span className="product-name-title">{item.product_name}</span>
                      </td>
                      <td>
                        <span className={`brand-pill ${brandClass}`}>
                          {item.brand === 'Fresh' && '🥗'}
                          {item.brand === 'Tech' && '⚡'}
                          {item.brand === 'Style' && '✨'}
                          {' '}{item.brand}
                        </span>
                      </td>
                      <td>
                        <span className={`temp-pill ${isReefer ? 'reefer' : 'ambient'}`}>
                          {isReefer ? '❄️ Reefer' : '📦 Ambient'}
                        </span>
                      </td>
                      <td>
                        <span className="metric-val">{parseFloat(item.weight_per_unit).toFixed(2)}</span>
                        <span className="metric-unit">kg</span>
                      </td>
                      <td>
                        <span className="metric-val">{parseFloat(item.volume_per_unit).toFixed(4)}</span>
                        <span className="metric-unit">m³</span>
                      </td>
                      <td>
                        <span className="unit-tag">{item.unit}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-delete-product"
                          title="Delete from Catalog"
                          onClick={() => handleDeleteProduct(item.product_id, item.product_name)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  )
}
