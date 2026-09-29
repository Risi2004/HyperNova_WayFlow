export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  requiredText = 'Required',
  leftIcon,
  rightElement,
  autoComplete,
  headerRight,
  error,
}) {
  return (
    <div className="form-group">
      {(label || headerRight || required) && (
        <div className="form-label-row">
          {label && (
            <label htmlFor={id} className="form-label">
              {label}
            </label>
          )}
          {headerRight ? (
            headerRight
          ) : required ? (
            <span className="form-badge-required">{requiredText}</span>
          ) : null}
        </div>
      )}

      <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
        {leftIcon && (
          <span className="input-icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className="form-input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
        />
        {rightElement}
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  )
}
