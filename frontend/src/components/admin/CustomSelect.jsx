import { useState, useRef, useEffect } from 'react'

export default function CustomSelect({
  options = [],
  value,
  onChange,
  placeholder = '-- Select --',
  disabled = false,
  hasError = false,
  searchable = true,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef(null)
  const searchInputRef = useRef(null)

  // Normalize options to { value, label }
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'object' && opt !== null ? opt : { value: opt, label: opt }
  )

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)

  // Filter options if searchable
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus()
    }
    if (!isOpen) {
      setSearchTerm('')
    }
  }, [isOpen, searchable])

  const handleSelect = (val) => {
    onChange(val)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
    >
      <button
        type="button"
        className={`custom-select-trigger ${hasError ? 'has-error' : ''} ${!selectedOption ? 'is-placeholder' : ''}`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        disabled={disabled}
      >
        <span className="custom-select-label">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`custom-select-chevron ${isOpen ? 'rotated' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-select-menu">
          {searchable && normalizedOptions.length > 6 && (
            <div className="custom-select-search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                className="custom-select-search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="custom-select-search-clear"
                  onClick={() => setSearchTerm('')}
                >
                  ✕
                </button>
              )}
            </div>
          )}

          <div className="custom-select-options-list">
            {filteredOptions.length === 0 ? (
              <div className="custom-select-no-results">No matching records</div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <div
                    key={opt.value}
                    className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
