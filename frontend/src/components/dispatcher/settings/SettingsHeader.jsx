import saveIcon from '../../../assets/icons/save.svg'

export default function SettingsHeader({ onSave, onReset, isSaving, hasChanges }) {
  return (
    <div className="settings-header-container">
      <div className="settings-title-group">
        <h1 className="settings-page-title">System & Dispatch Settings</h1>
        <p className="settings-page-subtitle">
          Configure global routing algorithms, depot operations, alert thresholds, and security preferences
        </p>
      </div>

      <div className="settings-header-actions">
        <button
          type="button"
          className="btn-settings-discard"
          onClick={onReset}
          disabled={isSaving}
        >
          Discard Changes
        </button>

        <button
          type="button"
          className={`btn-settings-save ${isSaving ? 'saving' : ''}`}
          onClick={onSave}
          disabled={isSaving}
        >
          <img src={saveIcon} alt="" className="settings-save-icon" />
          <span>{isSaving ? 'Saving Preferences...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  )
}
