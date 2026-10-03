import { initialsOf } from '../../../hooks/useCurrentUser'
import { vehicleTypeLabel } from '../../../utils/tripFormat'

export default function AssignedDriverCard({ plan, driverNotes }) {
  const name = plan.driver_name || 'Driver not assigned yet'

  return (
    <div className="td-driver-card">
      <div className="td-driver-header">
        <h4 className="td-driver-title">DRIVER &amp; VEHICLE</h4>
      </div>

      <div className="td-driver-profile-row">
        <div className="td-driver-avatar">{plan.driver_name ? initialsOf(plan.driver_name) : '—'}</div>
        <div className="td-driver-meta-col">
          <div className="td-driver-name-row">
            <span className="td-driver-name">{name}</span>
          </div>
          <span className="td-driver-id-sub">Trip {plan.trip_id}</span>
        </div>
      </div>

      <div className="td-driver-specs-list">
        <div className="td-driver-spec-row">
          <span className="td-spec-key">Vehicle:</span>
          <span className="td-spec-val">{plan.vehicle_id} ({vehicleTypeLabel(plan)})</span>
        </div>
        <div className="td-driver-spec-row">
          <span className="td-spec-key">Capacity:</span>
          <span className="td-spec-val">{Number(plan.weight_cap_kg).toLocaleString()} kg &bull; {Number(plan.volume_cap_m3)} m³</span>
        </div>
        <div className="td-driver-spec-row">
          <span className="td-spec-key">Phone:</span>
          <span className="td-spec-val radio-val">{plan.driver_phone || 'Not on file'}</span>
        </div>
      </div>

      {driverNotes && (
        <div className="td-driver-note-box">
          <span className="td-note-title">Driver&apos;s delivery note:</span>
          <p className="td-note-quote">&ldquo;{driverNotes}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
