import { useState } from 'react'

export default function IntegrationsCard() {
  const [apiKeyVisible, setApiKeyVisible] = useState(false)

  const connectors = [
    {
      name: 'Teltonika Telematics GPS Stream',
      category: 'Fleet IoT & Reefer Sensor Stream',
      status: 'Connected',
      statusType: 'green',
      latency: '24ms latency',
      endpoint: 'wss://telematics.wayflow.internal/v2/stream',
    },
    {
      name: 'Enterprise ERP Order Ingestion Webhook',
      category: 'SAP / Oracle Orders Connector',
      status: 'Connected',
      statusType: 'green',
      latency: '1,446 synced today',
      endpoint: 'https://api.waypoint.lk/dispatch/v1/orders/webhook',
    },
    {
      name: 'Sri Lanka Meteorological Radar API',
      category: 'Weather & Heavy Rain Monitoring',
      status: 'Active',
      statusType: 'green',
      latency: 'Refreshed 4m ago',
      endpoint: 'https://meteo.gov.lk/api/v1/radar/colombo',
    },
    {
      name: 'Google Maps Road Traffic Matrix Engine',
      category: 'Real-time Urban Traffic API',
      status: 'Quota OK',
      statusType: 'green',
      latency: '82% quota remaining',
      endpoint: 'https://routes.googleapis.com/directions/v2',
    },
  ]

  return (
    <div className="settings-section-card">
      <div className="section-card-header">
        <div className="section-header-title-box">
          <h2 className="section-card-title">Telematics, IoT & System Integrations</h2>
          <p className="section-card-subtitle">
            External telemetry connectors, GPS tracking endpoints, ERP webhooks, and secure API credentials
          </p>
        </div>
        <span className="section-badge-pill green">ALL SYSTEMS HEALTHY</span>
      </div>

      {/* Connected Services Table */}
      <div className="connectors-list-grid">
        {connectors.map((c, idx) => (
          <div key={idx} className="connector-item-card">
            <div className="connector-main-meta">
              <div className="connector-header-row">
                <span className="connector-name bold">{c.name}</span>
                <span className={`connector-status-badge status-${c.statusType}`}>
                  <span className="dot"></span>
                  {c.status}
                </span>
              </div>
              <span className="connector-cat">{c.category}</span>
              <div className="connector-endpoint-code">
                <code>{c.endpoint}</code>
              </div>
            </div>
            <div className="connector-footer-meta">
              <span className="connector-latency-text">{c.latency}</span>
              <button
                type="button"
                className="btn-connector-test"
                onClick={() => alert(`Ping test succeeded for ${c.name}: Latency 28ms. Endpoint healthy.`)}
              >
                Test Connection
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="settings-divider" />

      {/* Dispatcher API Key Block */}
      <div className="api-key-management-box">
        <div className="api-key-header">
          <span className="api-key-title bold">Production Dispatch API Token</span>
          <span className="api-key-env-tag">PROD-WEST-01</span>
        </div>
        <p className="api-key-desc">
          Used by handheld driver terminals and warehouse staging barcode scanners to authenticate with WayFlow.
        </p>
        <div className="api-key-input-row">
          <input
            type={apiKeyVisible ? 'text' : 'password'}
            readOnly
            value="wf_live_sec_9938a8e104bf7c21e64901bca03f88d4"
            className="settings-api-key-input"
          />
          <button
            type="button"
            className="btn-reveal-key"
            onClick={() => setApiKeyVisible(!apiKeyVisible)}
          >
            {apiKeyVisible ? 'Hide' : 'Reveal'}
          </button>
          <button
            type="button"
            className="btn-copy-key"
            onClick={() => {
              navigator.clipboard?.writeText('wf_live_sec_9938a8e104bf7c21e64901bca03f88d4')
              alert('API token copied to clipboard!')
            }}
          >
            Copy Token
          </button>
        </div>
      </div>
    </div>
  )
}
