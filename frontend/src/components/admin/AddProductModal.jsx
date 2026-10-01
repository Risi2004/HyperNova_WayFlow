import { useState } from 'react'
import CustomSelect from './CustomSelect'
import './AdminModal.css'

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('Fresh')
  const [temp, setTemp] = useState('reefer')
  const [weight, setWeight] = useState('')
  const [volume, setVolume] = useState('')
  const [unit, setUnit] = useState('Crate')
  const [customId, setCustomId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Auto-adjust default temp when brand changes
  const handleBrandChange = (newBrand) => {
    setBrand(newBrand)
    if (newBrand === 'Tech' || newBrand === 'Style') {
      setTemp('ambient')
    } else {
      setTemp('reefer')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please provide a descriptive product name.')
      return
    }

    const parsedWeight = parseFloat(weight)
    const parsedVolume = parseFloat(volume)

    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setError('Weight per unit must be a positive number (kg).')
      return
    }

    if (isNaN(parsedVolume) || parsedVolume <= 0) {
      setError('Volume per unit must be a positive number (m³).')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        product_id: customId.trim() || undefined,
        product_name: name.trim(),
        brand,
        temperature_requirement: temp,
        weight_per_unit: parsedWeight,
        volume_per_unit: parsedVolume,
        unit: unit.trim(),
      }

      await onAddProduct(payload)
      setIsSubmitting(false)
      onClose()
    } catch (err) {
      setIsSubmitting(false)
      setError(err.message || 'Failed to create product.')
    }
  }

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-box">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title-group">
            <span className="admin-modal-badge">COMMODITY LOGISTICS CATALOG</span>
            <h2 className="admin-modal-title">Register New Master Product</h2>
            <p className="admin-modal-desc">
              Define standard SKU metrics, transport density, packaging unit, and thermal storage clearance.
            </p>
          </div>
          <button
            type="button"
            className="btn-admin-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="admin-modal-form">
          {error && <div className="admin-form-alert error">{error}</div>}

          {/* Product Name */}
          <div className="admin-form-group">
            <label className="admin-form-label">
              PRODUCT NAME / COMMERCIAL TITLE <span className="admin-required-star">*</span>
            </label>
            <input
              type="text"
              className="admin-form-input"
              placeholder="e.g. Organic Dairy Butter (250g Block)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Brand & Temperature Classification */}
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">
                COMMODITY BRAND / CATEGORY <span className="admin-required-star">*</span>
              </label>
              <CustomSelect
                options={[
                  { value: 'Fresh', label: '🥗 Fresh (Cold Chain / Groceries)' },
                  { value: 'Tech', label: '⚡ Tech (Electronics & Computing)' },
                  { value: 'Style', label: '✨ Style (Apparel & Lifestyle)' },
                ]}
                value={brand}
                onChange={handleBrandChange}
                searchable={false}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                THERMAL STORAGE CLEARANCE <span className="admin-required-star">*</span>
              </label>
              <CustomSelect
                options={[
                  { value: 'reefer', label: '❄️ Reefer (Cold Chain / Chilled)' },
                  { value: 'ambient', label: '📦 Ambient (Standard Dry-Box)' },
                ]}
                value={temp}
                onChange={(val) => setTemp(val)}
                searchable={false}
              />
            </div>
          </div>

          {/* Physical Specifications */}
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">
                WEIGHT PER UNIT (KG) <span className="admin-required-star">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="admin-form-input"
                placeholder="e.g. 1.25"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                VOLUME PER UNIT (M³) <span className="admin-required-star">*</span>
              </label>
              <input
                type="number"
                step="0.0001"
                min="0.0001"
                className="admin-form-input"
                placeholder="e.g. 0.0025"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Packaging Unit & Custom ID */}
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">
                PACKAGING UNIT <span className="admin-required-star">*</span>
              </label>
              <CustomSelect
                options={[
                  { value: 'Crate', label: 'Crate' },
                  { value: 'Case', label: 'Case' },
                  { value: 'Box', label: 'Box' },
                  { value: 'Carton', label: 'Carton' },
                  { value: 'Bottle', label: 'Bottle' },
                  { value: 'Piece', label: 'Piece' },
                  { value: 'Tray', label: 'Tray' },
                  { value: 'Pack', label: 'Pack' },
                  { value: 'Tub', label: 'Tub' },
                  { value: 'Shoebox', label: 'Shoebox' },
                ]}
                value={unit}
                onChange={(val) => setUnit(val)}
                searchable={false}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">CUSTOM PRODUCT ID (OPTIONAL)</label>
              <input
                type="text"
                className="admin-form-input"
                placeholder="Auto-generated if blank"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
              />
            </div>
          </div>

          {/* Density Estimation Card */}
          {weight && volume && parseFloat(volume) > 0 && (
            <div className="admin-confirm-card">
              <div className="admin-confirm-grid">
                <div className="admin-confirm-item">
                  <span className="admin-confirm-label">Bulk Density Factor</span>
                  <span className="admin-confirm-value" style={{ color: '#38bdf8' }}>
                    {(parseFloat(weight) / parseFloat(volume)).toFixed(1)} kg / m³
                  </span>
                </div>
                <div className="admin-confirm-item">
                  <span className="admin-confirm-label">10-Unit Vehicle Footprint</span>
                  <span className="admin-confirm-value">
                    {(parseFloat(weight) * 10).toFixed(2)} kg &bull; {(parseFloat(volume) * 10).toFixed(4)} m³
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="admin-modal-footer">
            <button
              type="button"
              className="btn-admin-modal-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-admin-modal-submit"
              disabled={isSubmitting}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{isSubmitting ? 'Registering Product...' : 'Add Product to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
