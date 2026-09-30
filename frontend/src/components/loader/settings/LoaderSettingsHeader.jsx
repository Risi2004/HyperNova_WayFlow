import saveIcon from '../../../assets/icons/save.svg'

export default function LoaderSettingsHeader({
  onSave,
  onReset,
  isSaving,
}) {
  return (
    <div className="loader-settings-header-row">
      <div className="loader-settings-title-col">
        <h2 className="loader-settings-page-title">Terminal Settings</h2>
        <p className="loader-settings-page-subtitle">
          Configure warehouse dispatch bay preferences, barcode verification, cold-chain thresholds, and audio alerts.
        </p>
      </div>

      <div className="loader-settings-header-actions">
        <button
          type="button"
          className="btn-settings-reset"
          onClick={onReset}
          disabled={isSaving}
        >
          Reset Defaults
        </button>
        <button
          type="button"
          className={`btn-settings-save ${isSaving ? 'saving' : ''}`}
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="settings-spinner" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <img src={saveIcon} alt="" className="settings-save-icon" />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
