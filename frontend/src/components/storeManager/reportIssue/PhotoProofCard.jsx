import { useRef, useState } from 'react'
import { compressImage } from '../../../utils/tripFormat'

export default function PhotoProofCard({ photo, onChangePhoto }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Attach a photo (JPG or PNG).')
    setError(null)
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = await compressImage(reader.result)
      onChangePhoto({ name: file.name, size: `${Math.round((dataUrl.length * 0.75) / 1024)} KB`, dataUrl })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="ri-section-card">
      <div className="ri-section-header">
        <div className="ri-section-title-wrap">
          <div className="ri-step-bubble">4</div>
          <h2 className="ri-section-title">Supporting Photo</h2>
        </div>
        <span className="ri-badge-optional">OPTIONAL</span>
      </div>
      <p className="ri-section-subtitle">A photo of the damage, the short pallet or the delivery note helps dispatch resolve it faster.</p>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" capture="environment" />

      {!photo && (
        <div
          className="ri-upload-dropzone"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
        >
          <div className="ri-upload-left">
            <div className="ri-upload-icon-circle">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="ri-upload-text">
              <h4 className="ri-upload-title">Take or upload a photo</h4>
              <span className="ri-upload-types">JPG or PNG — compressed before sending</span>
            </div>
          </div>
          <button type="button" className="btn-ri-browse" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
            Browse
          </button>
        </div>
      )}

      {error && <p className="sm-page-state error">{error}</p>}

      {photo && (
        <div className="ri-uploaded-files-list">
          <div className="ri-uploaded-file-row">
            <div className="ri-file-info-left">
              <img src={photo.dataUrl} alt="Attached evidence" style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
              <span className="ri-file-name">{photo.name}</span>
              <span className="ri-file-size">({photo.size})</span>
            </div>
            <button type="button" className="btn-ri-remove-file" onClick={() => onChangePhoto(null)} title="Remove photo" aria-label="Remove photo">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
