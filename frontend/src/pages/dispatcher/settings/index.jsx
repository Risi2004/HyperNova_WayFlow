import { useState } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'

import SettingsHeader from '../../../components/dispatcher/settings/SettingsHeader'
import SettingsNavTabs from '../../../components/dispatcher/settings/SettingsNavTabs'
import GeneralSettingsCard from '../../../components/dispatcher/settings/GeneralSettingsCard'
import RoutingRulesCard from '../../../components/dispatcher/settings/RoutingRulesCard'
import NotificationsCard from '../../../components/dispatcher/settings/NotificationsCard'
import IntegrationsCard from '../../../components/dispatcher/settings/IntegrationsCard'
import SecurityProfileCard from '../../../components/dispatcher/settings/SecurityProfileCard'

import './Settings.css'

export default function DispatcherSettings() {
  const defaultSettings = {
    // General
    defaultDepot: 'Peliyagoda Central DC',
    timezone: 'Asia/Colombo',
    cutoffTime: '06:00',
    mapFocus: 'Colombo Metropolitan',
    unitSystem: 'Metric-LKR',
    refreshInterval: '15s',

    // Routing & Optimization
    optimizationStrategy: 'balanced',
    coldChainEnforced: true,
    autoDeferOverflow: true,
    trafficBuffer: 15,
    maxShiftHours: 8.5,
    geofenceRadius: 80,

    // Notifications
    slaAlarm: true,
    driverSms: true,
    customerPreAlert: true,
    detourAlert: true,
    temperatureAlarm: true,
    nightlyEmailDigest: false,

    // Security
    twoFactorAuth: true,
    autoLockSession: true,
  }

  const [settings, setSettings] = useState(defaultSettings)
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)

  const handleFieldChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    setShowSavedToast(false)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSavedToast(true)
      setTimeout(() => setShowSavedToast(false), 4500)
    }, 600)
  }

  return (
    <div className="settings-page-container">
      {/* Sidebar with Settings active */}
      <Sidebar activeItem="Settings" />

      {/* Main Content Area */}
      <div className="settings-main-wrapper">
        <Header />

        <main className="settings-content">
          {/* Header Row: Title, Subtitle, Save / Discard Actions */}
          <SettingsHeader
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />

          {/* Success Toast Banner */}
          {showSavedToast && (
            <div className="settings-toast-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Preferences saved.</span>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <SettingsNavTabs
            activeTab={activeTab}
            onTabSelect={setActiveTab}
          />

          {/* Active Tab Panel */}
          {activeTab === 'general' && (
            <GeneralSettingsCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {activeTab === 'routing' && (
            <RoutingRulesCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {activeTab === 'telematics' && (
            <IntegrationsCard />
          )}

          {activeTab === 'security' && (
            <SecurityProfileCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {/* Dispatcher Footer */}
          <footer className="dispatcher-footer">
            <span>System configuration v4.8 • Asia/Colombo (UTC+05:30)</span>
            <a href="#help" className="footer-link">
              Help & operational documentation
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
