import { useRef } from 'react'

export default function ProofUploadCard({
  uploadedImage,
  onImageSelected,
  onRemoveImage,
}) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        onImageSelected && onImageSelected({
          file,
          previewUrl: event.target.result,
          name: file.name,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSimulateCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="proof-upload-card">
      <div className="proof-upload-card-header">
        <h3 className="proof-section-title">Proof of Delivery</h3>
        <p className="proof-section-subtitle">
          Add the required proof that the delivery was completed.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden-file-input"
        onChange={handleFileChange}
      />

      {!uploadedImage ? (
        <div className="proof-upload-dropzone" onClick={handleSimulateCapture}>
          <div className="proof-camera-icon-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          <h4 className="dropzone-main-title">Add Proof of Delivery</h4>
          <p className="dropzone-sub-instruction">
            Take a photo or upload delivery proof from this device.
          </p>

          <button
            type="button"
            className="btn-capture-upload-outline"
            onClick={(e) => {
              e.stopPropagation()
              handleSimulateCapture()
            }}
          >
            Capture / Upload Proof
          </button>
        </div>
      ) : (
        <div className="proof-uploaded-preview-box">
          <div className="preview-image-wrapper">
            <img src={uploadedImage.previewUrl} alt="Delivery Proof" className="preview-image" />
            <div className="preview-badge-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Captured</span>
            </div>
          </div>

          <div className="preview-details-block">
            <div className="preview-meta-row">
              <span className="preview-filename">{uploadedImage.name || 'delivery_proof_img.jpg'}</span>
              <span className="preview-timestamp">Recorded at {uploadedImage.timestamp}</span>
            </div>

            <div className="preview-actions-row">
              <button
                type="button"
                className="btn-retake-photo"
                onClick={handleSimulateCapture}
              >
                Retake Photo
              </button>
              <button
                type="button"
                className="btn-remove-photo"
                onClick={onRemoveImage}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
