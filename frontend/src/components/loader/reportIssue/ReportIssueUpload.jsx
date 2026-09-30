import { useState, useRef } from 'react'

export default function ReportIssueUpload({ onPhotoChange }) {
  const [fileName, setFileName] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileName(file.name)
      if (onPhotoChange) onPhotoChange(file)
    }
  }

  return (
    <div className="report-upload-wrapper">
      <label className="report-field-label">Evidence Photo (Optional)</label>
      <div
        className="photo-upload-dropzone"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/png, image/jpeg"
          style={{ display: 'none' }}
        />
        <svg
          className="photo-upload-camera-icon"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>

        {fileName ? (
          <p className="photo-upload-filename">Selected: {fileName}</p>
        ) : (
          <>
            <p className="photo-upload-prompt">Drop a photo here or click to upload</p>
            <p className="photo-upload-hint">JPG, PNG up to 10MB</p>
          </>
        )}

        <button
          type="button"
          className="btn-photo-upload"
          onClick={(e) => {
            e.stopPropagation()
            fileInputRef.current && fileInputRef.current.click()
          }}
        >
          Upload Photo
        </button>
      </div>
    </div>
  )
}
