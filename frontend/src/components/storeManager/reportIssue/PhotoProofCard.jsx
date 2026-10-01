import { useRef } from 'react'

export default function PhotoProofCard({
  files,
  onAddFile,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        onAddFile({
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        })
      })
    }
  }

  return (
    <div className="ri-section-card">
      {/* Section Header */}
      <div className="ri-section-header">
        <div className="ri-section-title-wrap">
          <div className="ri-step-bubble">4</div>
          <h2 className="ri-section-title">Supporting Photo Proof</h2>
        </div>
        <span className="ri-badge-optional">OPTIONAL</span>
      </div>
      <p className="ri-section-subtitle">
        Upload tally sheet, delivery manifest, or damage photo
      </p>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="image/png,image/jpeg,application/pdf"
        multiple
      />

      {/* Upload Dropzone */}
      <div
        className="ri-upload-dropzone"
        onClick={() => fileInputRef.current?.click()}
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
            <h4 className="ri-upload-title">Upload or drag photo evidence</h4>
            <span className="ri-upload-types">PNG, JPG or PDF up to 10MB</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-ri-browse"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current?.click()
          }}
        >
          Browse Files
        </button>
      </div>

      {/* Uploaded Files List */}
      {files && files.length > 0 && (
        <div className="ri-uploaded-files-list">
          {files.map((file) => (
            <div key={file.id} className="ri-uploaded-file-row">
              <div className="ri-file-info-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="ri-file-name">{file.name}</span>
                <span className="ri-file-size">({file.size})</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.8">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <button
                type="button"
                className="btn-ri-remove-file"
                onClick={() => onRemoveFile(file.id)}
                title="Remove file"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
