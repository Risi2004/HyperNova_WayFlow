import { useState } from 'react'
import Logo from '../../components/ui/Logo'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Checkbox from '../../components/ui/Checkbox'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberDevice, setRememberDevice] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleSignIn = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setStatusMessage('')

    setTimeout(() => {
      setIsLoading(false)
      setStatusMessage('Signed in successfully!')
    }, 800)
  }

  const handleSSOSignIn = () => {
    setIsLoading(true)
    setStatusMessage('')
    setTimeout(() => {
      setIsLoading(false)
      setStatusMessage('Authenticating with WayFlow SSO...')
    }, 800)
  }

  return (
    <main className="login-page">
      <div className="login-overlay" aria-hidden="true" />

      {/* Hero statement on bottom-left */}
      <section className="hero-content">
        <h1 className="hero-title">
          Next–generation fleet and<br />
          delivery intelligence.
        </h1>
        <p className="hero-subtitle">
          Unified dispatching, inventory handling, driver routing, and store coordination in one real-time mission–critical operational console.
        </p>
      </section>

      {/* Floating Glassmorphic Login Card on right */}
      <div className="login-card-container">
        <div className="login-glass-card">
          {/* Logo */}
          <Logo width={68} />

          {/* Heading */}
          <div className="card-header">
            <h2 className="card-title">Welcome back</h2>
            <p className="card-subtitle">Sign in to your WayFlow account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} noValidate>
            {/* Email / Corporate ID */}
            <Input
              id="corporate-id"
              label="EMAIL ADDRESS OR CORPORATE ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marcus.vance@wayflowgroup.com"
              autoComplete="username"
              required
              requiredText="Required"
              leftIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="9" cy="11" r="2.5" />
                  <path d="M15 9h3" />
                  <path d="M15 13h3" />
                </svg>
              }
            />

            {/* Password */}
            <Input
              id="password-input"
              label="PASSWORD"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
              headerRight={
                <a
                  href="#forgot-password"
                  className="forgot-link"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset instructions will be sent to your administrator.')
                  }}
                >
                  Forgot password?
                </a>
              }
              leftIcon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              }
              rightElement={
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              }
            />

            {/* Remember Device Checkbox */}
            <Checkbox
              id="remember-device"
              label="Remember this device for 30 days"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
            />

            {/* Primary Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              loadingText="Signing in..."
              rightIcon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              }
            >
              Sign in to Console
            </Button>
          </form>

          {/* Divider */}
          <div className="divider-row">
            <span className="divider-line" />
            <span className="divider-text">OR CONTINUE WITH</span>
            <span className="divider-line" />
          </div>

          {/* SSO Button */}
          <Button
            type="button"
            variant="sso"
            onClick={handleSSOSignIn}
            disabled={isLoading}
            leftIcon={
              <span className="sso-icon-badge" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <path d="M9 14h6" />
                  <path d="M9 17h3" />
                </svg>
              </span>
            }
          >
            Sign in with WayFlow SSO (Okta / Azure AD)
          </Button>

          {/* Feedback notice if any */}
          {statusMessage && (
            <div className="toast-notice success" role="status">
              {statusMessage}
            </div>
          )}

          {/* Card Footer Help */}
          <footer className="card-footer">
            Need account access? Contact{' '}
            <a href="mailto:dispatch@wayflow.internal" className="help-link">
              Hub Dispatcher
            </a>{' '}
            or{' '}
            <a href="mailto:it-helpdesk@wayflow.internal" className="help-link">
              IT Helpdesk
            </a>
          </footer>
        </div>
      </div>
    </main>
  )
}
