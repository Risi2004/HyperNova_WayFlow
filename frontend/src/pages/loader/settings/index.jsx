import { useState, useEffect } from 'react'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import LoaderSettingsHeader from '../../../components/loader/settings/LoaderSettingsHeader'
import LoaderSettingsTabs from '../../../components/loader/settings/LoaderSettingsTabs'
import BayTerminalCard from '../../../components/loader/settings/BayTerminalCard'
import VerificationScanningCard from '../../../components/loader/settings/VerificationScanningCard'
import ColdChainSafetyCard from '../../../components/loader/settings/ColdChainSafetyCard'
import NotificationsAudioCard from '../../../components/loader/settings/NotificationsAudioCard'
import './LoaderSettings.css'

const STORAGE_KEY = 'wayflow_loader_terminal_settings'

const DEFAULT_SETTINGS = {
  // Bay & Terminal
  depot: 'Peliyagoda Central DC',
  bayId: 'BAY-04 (Chilled & Dry Multi-Bay)',
  unitSystem: 'Metric (kg, units, °C)',
  refreshInterval: '10s',
  highContrast: false,
  offlineMode: true,

  // Verification & Barcode Scanning
  scannerBeep: true,
  autoAdvance: true,
  strictLifo: true,
  secondaryCheck: true,
  discrepancyThreshold: '1',

  // Cold-Chain & Safety Standards
  chilledLimit: 4.0,
  frozenLimit: -18.0,
  crossLoadGuard: true,
  reeferPreCoolCheck: true,

  // Notifications & Audio Alerts
  departureAlarm: true,
  dispatchBroadcasts: true,
  autoEscalateIssue: true,
  audioVolume: 'high',
}

export default function LoaderSettings() {
  const [activeTab, setActiveTab] = useState('terminal')
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)

  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      }
    } catch {
      // fallback to defaults on error
    }
    return DEFAULT_SETTINGS
  })

  // Handle single field change
  const handleFieldChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // Handle Save
  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch (err) {
        console.error('Failed to save loader settings to localStorage', err)
      }
      setIsSaving(false)
      setShowSavedToast(true)
    }, 450)
  }

  // Handle Reset to defaults
  const handleReset = () => {
    if (window.confirm('Reset all terminal settings and bay configurations to default values?')) {
      setSettings(DEFAULT_SETTINGS)
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (err) {
        console.error('Failed to remove settings from localStorage', err)
      }
      setShowSavedToast(false)
    }
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (showSavedToast) {
      const timer = setTimeout(() => {
        setShowSavedToast(false)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [showSavedToast])

  return (
    <div className="loader-settings-layout-container">
      {/* Sidebar with Settings active */}
      <LoaderSidebar activeItem="Settings" />

      {/* Main Content Area */}
      <div className="loader-settings-main-wrapper">
        <main className="loader-settings-content">
          {/* Settings Header with Title, Subtitle, Save & Reset */}
          <LoaderSettingsHeader
            onSave={handleSave}
            onReset={handleReset}
            isSaving={isSaving}
          />

          {/* Toast Notification on Save */}
          {showSavedToast && (
            <div className="settings-toast-banner" role="status">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Terminal configuration and bay preferences successfully saved.</span>
            </div>
          )}

          {/* Sub Navigation Tabs */}
          <LoaderSettingsTabs
            activeTab={activeTab}
            onTabSelect={setActiveTab}
          />

          {/* Active Settings Card */}
          {activeTab === 'terminal' && (
            <BayTerminalCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {activeTab === 'verification' && (
            <VerificationScanningCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {activeTab === 'coldchain' && (
            <ColdChainSafetyCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {activeTab === 'alerts' && (
            <NotificationsAudioCard
              settings={settings}
              onChange={handleFieldChange}
            />
          )}

          {/* Hardware & Terminal Diagnostics Bar */}
          <div className="loader-settings-device-footer">
            <div className="device-footer-left">
              <span className="device-status-indicator">
                <span className="device-status-dot" />
                Datalogic Memor 10 Handheld Connected
              </span>
              <span>• IP: 192.168.10.84 (VLAN Bay 4)</span>
            </div>
            <div className="device-footer-right">
              <span>RFID Staging Antenna: Online</span>
              <span>Sync Protocol: WebSockets Secure</span>
              <span>Firmware: v4.9.2-bld48</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
