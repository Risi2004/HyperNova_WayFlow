import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/images/logo.png'
import './LandingPage.css'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('all')

  const roles = [
    {
      id: 'dispatcher',
      role: 'Central Dispatcher',
      title: 'Route Planning & Dispatch Hub',
      badge: 'Planning Tier',
      badgeColor: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
      desc: 'Orchestrate multi-stop deliveries, reorder optimal route graphs, monitor live vehicle payloads, and defer backlog orders with intelligent algorithms.',
      highlights: [
        'Dynamic multi-depot route sequencing',
        'Vehicle capacity & refrigeration balance',
        'Real-time traffic & trip telematics',
        'Deferred orders & backlog management',
      ],
      path: '/dispatcher/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      id: 'storeManager',
      role: 'Store Manager',
      title: 'Outlet Intake & Receipt Sign-Off',
      badge: 'Retail Outlet',
      badgeColor: { bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
      desc: 'Track approaching delivery trucks on live radar, confirm pallet item counts, sign off digital proofs of delivery, and immediately report cargo discrepancies.',
      highlights: [
        'Live inbound truck radar with ETA countdown',
        'Digital receipt sign-off with e-signatures',
        'Barcode discrepancy photo logging',
        'Historical order receipt auditing',
      ],
      path: '/store-manager/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      id: 'loader',
      role: 'Warehouse Loader',
      title: 'Dock Bay Staging & Barcode Scan',
      badge: 'Warehouse Bay',
      badgeColor: { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
      desc: 'Ensure flawless loading sequence at the depot dock. Validate pallet tags, monitor payload weight limits, and report packaging defects before trucks depart.',
      highlights: [
        'Bay assignment & vehicle door staging',
        'Load order reverse-stacking validation',
        'Instant cargo weight distribution alerts',
        'Defect & damaged crate documentation',
      ],
      path: '/loader/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      id: 'driver',
      role: 'Fleet Driver',
      title: 'Turn-by-Turn Delivery Navigation',
      badge: 'Mobile Fleet',
      badgeColor: { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
      desc: 'Mobile-first driver terminal with optimized turn-by-turn routes, offline POD signature capture, and instant roadside traffic delay reporting.',
      highlights: [
        'Live turn-by-turn stop navigation',
        'Digital Proof of Delivery (signature & camera)',
        'Roadblock, puncture & delay reporting',
        'Real-time stop completion synchronization',
      ],
      path: '/driver/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      id: 'admin',
      role: 'System Administrator',
      title: 'Enterprise RBAC & Infrastructure',
      badge: 'Admin Console',
      badgeColor: { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' },
      desc: 'Centralized governance terminal with full dark theme. Provision and deprovision users, enforce role-based access, and inspect live security audits.',
      highlights: [
        'User management across all 5 roles',
        'Custom credential creation & temporary passwords',
        'API latency & gateway health telemetry',
        'Comprehensive security audit event logs',
      ],
      path: '/admin/dashboard',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
  ]

  const pipelineSteps = [
    {
      num: 'PHASE 01',
      title: 'Order Placement & AI Sequencing',
      desc: 'Stores submit demand payloads. Central planning algorithms batch and sequence multi-stop delivery routes to minimize mileage.',
      role: 'Store Manager &bull; Dispatcher',
      color: '#2563eb',
    },
    {
      num: 'PHASE 02',
      title: 'Dock Staging & Barcode Verification',
      desc: 'Warehouse bays stage cargo in reverse delivery order. Loaders verify pallet IDs, refrigerated container seals, and net weight limits.',
      role: 'Warehouse Loader',
      color: '#d97706',
    },
    {
      num: 'PHASE 03',
      title: 'In-Transit Telematics & Navigation',
      desc: 'Drivers navigate turn-by-turn stops while live GPS telematics stream vehicle coordinates, speed, and real-time ETAs to all parties.',
      role: 'Fleet Driver &bull; Dispatcher',
      color: '#059669',
    },
    {
      num: 'PHASE 04',
      title: 'Receipt Sign-Off & Discrepancy Audits',
      desc: 'Store managers inspect crates at delivery, record digital signatures, and immediately document damaged or short quantities with photo proof.',
      role: 'Store Manager &bull; Driver',
      color: '#7c3aed',
    },
  ]

  return (
    <div className="landing-page light-theme">
      {/* Background ambient lighting */}
      <div className="landing-ambient-glow" />
      <div className="landing-ambient-glow-secondary" />

      {/* Top Static Navigation */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <img src={logoImg} alt="WayFlow Logo" className="landing-brand-logo" />
          <span className="landing-brand-text">WAYFLOW</span>
          <span className="landing-brand-tag">LOGISTICS</span>
        </div>

        <div className="landing-nav-links">
          <a href="#pipeline" className="landing-nav-link">Delivery Lifecycle</a>
          <a href="#roles" className="landing-nav-link">Role Consoles</a>
          <a href="#infrastructure" className="landing-nav-link">Architecture</a>
        </div>

        <div className="landing-nav-actions">
          <Link to="/login" className="landing-btn-login">
            <span>Console Sign In</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-badge">
          <span className="landing-pulse-indicator" />
          <span>WayFlow Operating System v4.9 &bull; Mission-Critical Fleet Intelligence</span>
        </div>

        <h1 className="landing-hero-title">
          Next–Generation Fleet &<br />
          <span className="landing-hero-gradient-text">Delivery Intelligence.</span>
        </h1>

        <p className="landing-hero-subtitle">
          Unified dispatch optimization, dock bay staging, turn-by-turn driver navigation, and store receipt coordination in one real-time operational ecosystem.
        </p>

        <div className="landing-hero-buttons">
          <Link to="/login" className="landing-btn-hero-primary">
            <span>Launch Live Console</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <a href="#roles" className="landing-btn-hero-secondary">
            <span>Explore 5 Role Terminals</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

        {/* Hero Interactive Frame Preview */}
        <div className="landing-preview-frame">
          <div className="landing-preview-header">
            <div className="landing-preview-dots">
              <span className="preview-dot" style={{ background: '#ef4444' }} />
              <span className="preview-dot" style={{ background: '#f59e0b' }} />
              <span className="preview-dot" style={{ background: '#10b981' }} />
            </div>
            <span className="landing-preview-title">WAYFLOW LIVE SYSTEM STREAM &bull; COLOMBO REGIONAL LOGISTICS NODE</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>● Active Telematics</span>
          </div>

          <div className="landing-preview-grid">
            <div className="preview-card-item">
              <div className="preview-item-top">
                <span className="preview-role-pill" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}>Dispatcher</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Trip TR-024</span>
              </div>
              <div className="preview-value">88.4%</div>
              <div className="preview-desc">Vehicle Load Capacity Optimized</div>
            </div>

            <div className="preview-card-item">
              <div className="preview-item-top">
                <span className="preview-role-pill" style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>Warehouse</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Bay 02</span>
              </div>
              <div className="preview-value">100%</div>
              <div className="preview-desc">Pallet Barcodes Verified & Staged</div>
            </div>

            <div className="preview-card-item">
              <div className="preview-item-top">
                <span className="preview-role-pill" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>Driver</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Live En-Route</span>
              </div>
              <div className="preview-value">18 mins</div>
              <div className="preview-desc">Estimated Arrival at Colombo 05</div>
            </div>

            <div className="preview-card-item">
              <div className="preview-item-top">
                <span className="preview-role-pill" style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>Store Manager</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>#ORD-9021</span>
              </div>
              <div className="preview-value">Signed Off</div>
              <div className="preview-desc">Digital Proof of Delivery Captured</div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <section className="landing-metrics-bar">
        <div className="landing-metrics-grid">
          <div>
            <div className="metric-number">99.98%</div>
            <div className="metric-label">On-Time Delivery SLA</div>
            <div className="metric-sub">Across all regional fleet corridors</div>
          </div>
          <div>
            <div className="metric-number">42%</div>
            <div className="metric-label">Route Mileage Saved</div>
            <div className="metric-sub">Algorithmic dynamic sequencing</div>
          </div>
          <div>
            <div className="metric-number">10,000+</div>
            <div className="metric-label">Daily Payloads Dispatched</div>
            <div className="metric-sub">Peliyagoda & Colombo Central hubs</div>
          </div>
          <div>
            <div className="metric-number">Sub-Second</div>
            <div className="metric-label">GPS Telematics Sync</div>
            <div className="metric-sub">Real-time driver & store coordination</div>
          </div>
        </div>
      </section>

      {/* The WayFlow Delivery Pipeline */}
      <section id="pipeline" className="landing-section">
        <div className="section-header">
          <span className="section-eyebrow">UNIFIED DELIVERY LIFECYCLE</span>
          <h2 className="section-title">From Order Intake to Store Sign-Off</h2>
          <p className="section-desc">
            Traditional logistics suffer from fragmented communication between warehouse docks, drivers, and store managers. WayFlow integrates every touchpoint into one continuous real-time workflow.
          </p>
        </div>

        <div className="pipeline-steps-grid">
          {pipelineSteps.map((step) => (
            <div key={step.num} className="pipeline-step-card" style={{ '--step-accent': step.color }}>
              <div className="pipeline-step-num" style={{ color: step.color }}>
                <span>●</span> {step.num}
              </div>
              <h3 className="pipeline-step-title">{step.title}</h3>
              <p className="pipeline-step-desc">{step.desc}</p>
              <div className="pipeline-step-role" dangerouslySetInnerHTML={{ __html: step.role }} />
            </div>
          ))}
        </div>
      </section>

      {/* The 5 Role Consoles */}
      <section id="roles" className="landing-section" style={{ paddingTop: '20px' }}>
        <div className="section-header">
          <span className="section-eyebrow">TAILORED OPERATIONAL WORKSPACES</span>
          <h2 className="section-title">5 Specialized Consoles, 1 Core Engine</h2>
          <p className="section-desc">
            Every team member gets a dedicated, purpose-built console optimized for their physical operational environment—from handheld mobile devices to multi-monitor dispatch rooms.
          </p>
        </div>

        <div className="roles-grid">
          {roles.map((item) => (
            <div key={item.id} className="role-feature-card">
              <div>
                <div className="role-card-top">
                  <div className="role-icon-box" style={{ background: item.badgeColor.bg }}>
                    {item.icon}
                  </div>
                  <span
                    className="role-card-badge"
                    style={{
                      backgroundColor: item.badgeColor.bg,
                      color: item.badgeColor.text,
                      border: `1px solid ${item.badgeColor.border}`,
                    }}
                  >
                    {item.badge}
                  </span>
                </div>

                <h3 className="role-card-title">{item.title}</h3>
                <p className="role-card-desc">{item.desc}</p>

                <ul className="role-checklist">
                  {item.highlights.map((h, idx) => (
                    <li key={idx}>
                      <span className="role-check-icon">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link to={item.path} className="role-card-btn">
                <span>Open {item.role} Portal</span>
                <span style={{ fontSize: '1rem' }}>&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Architecture */}
      <section id="infrastructure" className="landing-section" style={{ paddingTop: '20px' }}>
        <div className="section-header">
          <span className="section-eyebrow">ENTERPRISE ARCHITECTURE</span>
          <h2 className="section-title">Engineered for Zero Downtime & High Concurrency</h2>
          <p className="section-desc">
            Built with modern reactive micro-interfaces, lightweight client-side state caching, and hardened role-based permissions.
          </p>
        </div>

        <div className="landing-preview-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div className="preview-card-item" style={{ padding: '24px' }}>
            <div style={{ color: '#0284c7', fontSize: '1.6rem', marginBottom: '12px' }}>⚡</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px' }}>Real-Time Synchronization</h4>
            <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
              Immediate state dissemination ensures drivers, dispatchers, and receiving outlets see live cargo status with zero reload delay.
            </p>
          </div>

          <div className="preview-card-item" style={{ padding: '24px' }}>
            <div style={{ color: '#059669', fontSize: '1.6rem', marginBottom: '12px' }}>🛡️</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px' }}>Hardened Security & RBAC</h4>
            <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
              Multi-facility clearance, credential rotation, and session isolation prevent unauthorized role escalation across sensitive nodes.
            </p>
          </div>

          <div className="preview-card-item" style={{ padding: '24px' }}>
            <div style={{ color: '#7c3aed', fontSize: '1.6rem', marginBottom: '12px' }}>📱</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px' }}>Responsive Touch Optimizations</h4>
            <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
              Optimized for handheld driver smartphones, warehouse tablet docks, and wide high-density dispatcher desktops.
            </p>
          </div>

          <div className="preview-card-item" style={{ padding: '24px' }}>
            <div style={{ color: '#d97706', fontSize: '1.6rem', marginBottom: '12px' }}>📷</div>
            <h4 style={{ color: '#0f172a', fontSize: '1.15rem', fontWeight: 700, margin: '0 0 8px' }}>Photo Evidence & Digital Sign-off</h4>
            <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: 1.55 }}>
              Instant camera proof attachment, digital signature capture, and automated claim escalation resolve discrepancies before disputes occur.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-section" style={{ paddingTop: '20px', paddingBottom: '90px' }}>
        <div className="landing-cta-banner">
          <h2 className="landing-cta-title">
            Take Control of Your Fleet & Delivery Ecosystem.
          </h2>
          <p className="landing-cta-desc">
            Experience real-time delivery intelligence across Dispatcher, Warehouse, Driver, Store Manager, and Admin terminals.
          </p>
          <div className="landing-cta-actions">
            <Link to="/login" className="landing-btn-hero-primary" style={{ padding: '14px 34px' }}>
              <span>Sign In to Console</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="#roles" className="landing-btn-hero-secondary" style={{ padding: '14px 28px' }}>
              <span>Explore Role Consoles</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-left">
          <img src={logoImg} alt="WayFlow Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          <span>&copy; {new Date().getFullYear()} WayFlow Delivery Management System. All rights reserved.</span>
        </div>

        <div className="landing-footer-right">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span>All Nodes Operational &bull; 24ms Latency</span>
          </span>
          <span className="footer-link">Waypoint DMS · v4.9</span>
          <Link to="/login" className="footer-link">Login Console</Link>
        </div>
      </footer>
    </div>
  )
}
