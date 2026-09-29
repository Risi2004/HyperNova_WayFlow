export default function Checkbox({
  id,
  checked,
  onChange,
  label,
  className = '',
}) {
  return (
    <div className={`remember-row ${className}`}>
      <input
        id={id}
        type="checkbox"
        className="custom-checkbox"
        checked={checked}
        onChange={onChange}
      />
      {label && (
        <label htmlFor={id} className="remember-label">
          {label}
        </label>
      )}
    </div>
  )
}
