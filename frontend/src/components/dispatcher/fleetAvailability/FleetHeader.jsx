import { useState } from 'react'

export default function FleetHeader({ onRefresh }) {
  const [activeDepot, setActiveDepot] = useState('all')

  return (
    <div className="fleet-header-container">
      {/* Top Title & Date/Refresh Row */}
      <div className="fleet-header-top-row">
        <div className="fleet-title-group">
          <h1 className="fleet-main-title">Fleet Availability</h1>
          <p className="fleet-main-subtitle">
            Monitor vehicle capacity, capability, fuel, and current assignments.
          </p>
        </div>

        <div className="fleet-header-right-meta">
          <span className="fleet-date-label">28 September 2026</span>
          <button
            type="button"
            className="fleet-refresh-btn"
            onClick={onRefresh}
            title="Refresh fleet data"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Depot Tabs Switcher Bar */}
      <div className="fleet-depots-tabs-bar">
        <button
          type="button"
          className={`depot-tab-item ${activeDepot === 'all' ? 'active' : ''}`}
          onClick={() => setActiveDepot('all')}
        >
          <span className="depot-tab-name">All Depots</span>
          <span className="depot-tab-badge badge-blue">60 VEHICLES</span>
        </button>

        <button
          type="button"
          className={`depot-tab-item ${activeDepot === 'peliyagoda' ? 'active' : ''}`}
          onClick={() => setActiveDepot('peliyagoda')}
        >
          <span className="depot-tab-name">Peliyagoda</span>
          <span className="depot-tab-count">42 VEHICLES</span>
        </button>

        <button
          type="button"
          className={`depot-tab-item ${activeDepot === 'kandy' ? 'active' : ''}`}
          onClick={() => setActiveDepot('kandy')}
        >
          <span className="depot-tab-name">Kandy</span>
          <span className="depot-tab-count">18 VEHICLES</span>
        </button>
      </div>
    </div>
  )
}
