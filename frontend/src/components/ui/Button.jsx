export default function Button({
  type = 'button',
  variant = 'primary', // 'primary' | 'sso' | 'outline' | 'text'
  onClick,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}) {
  const getButtonClass = () => {
    switch (variant) {
      case 'sso':
        return 'sso-btn'
      case 'outline':
        return 'outline-btn'
      case 'text':
        return 'text-btn'
      case 'primary':
      default:
        return 'submit-btn'
    }
  }

  return (
    <button
      type={type}
      className={`${getButtonClass()} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span>{loadingText}</span>
      ) : (
        <>
          {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
