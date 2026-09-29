import logoImg from '../../assets/images/logo.png'

export default function Logo({ width = 68, className = '', alt = 'WayFlow Logo' }) {
  return (
    <div className={`logo-wrapper ${className}`} style={{ display: 'flex', justifyContent: 'center' }}>
      <img
        src={logoImg}
        alt={alt}
        className="login-logo"
        style={{ width: `${width}px`, height: 'auto', objectFit: 'contain' }}
      />
    </div>
  )
}
