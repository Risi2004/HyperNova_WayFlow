import { useState } from 'react'
import { Link } from 'react-router-dom'
import moreIcon from '../../../assets/icons/more.svg'

export default function StopSequenceSection() {
  const [expandedStop, setExpandedStop] = useState('01')

  const stops = [
    {
      stop: '01',
      outlet: 'OUT042',
      brand: 'Waypoint Fresh',
      window: '05:45-06:15',
      eta: '05:55',
      orderId: 'ORD-1042',
      load: '620 kg',
      status: 'Upcoming',
      statusType: 'upcoming',
      details: {
        address: 'Colombo North',
        access: 'Rear loading dock',
        temperature: 'Chilled',
        note: 'Deliver before store opening.',
      },
    },
    {
      stop: '02',
      outlet: 'OUT017',
      brand: 'Waypoint Fresh',
      window: '06:00-06:30',
      eta: '06:20',
      orderId: 'ORD-1048',
      load: '460 kg',
      status: 'Upcoming',
      statusType: 'upcoming',
      details: {
        address: 'Colombo North Extension',
        access: 'Front bay dock',
        temperature: 'Frozen',
        note: 'Requires signature on delivery.',
      },
    },
    {
      stop: '03',
      outlet: 'OUT001',
      brand: 'Waypoint Style',
      window: '06:30-07:15',
      eta: '06:42',
      orderId: 'ORD-1001',
      load: '380 kg',
      status: 'Upcoming',
      statusType: 'upcoming',
      details: {
        address: 'Kelaniya Center',
        access: 'Side ramp',
        temperature: 'Ambient',
        note: 'Call floor manager upon arrival.',
      },
    },
    {
      stop: '04',
      outlet: 'OUT033',
      brand: 'Waypoint Fresh',
      window: '07:00-07:45',
      eta: '07:24',
      orderId: 'ORD-1057',
      load: '540 kg',
      status: 'On Time',
      statusType: 'ontime',
      details: {
        address: 'Angoda Junction',
        access: 'Main delivery gate',
        temperature: 'Chilled',
        note: 'Cold storage verified.',
      },
    },
    {
      stop: '05',
      outlet: 'OUT078',
      brand: 'Waypoint Tech',
      window: '07:30-08:15',
      eta: '08:22',
      orderId: 'ORD-1002',
      load: '410 kg',
      status: 'Delayed',
      statusType: 'delayed',
      details: {
        address: 'Grandpass Road',
        access: 'Basement bay B',
        temperature: 'Ambient',
        note: 'Traffic near junction reported.',
      },
    },
    {
      stop: '06',
      outlet: 'OUT019',
      brand: 'Waypoint Fresh',
      window: '08:15-09:00',
      eta: '08:38',
      orderId: 'ORD-1006',
      load: '520 kg',
      status: 'Completed',
      statusType: 'completed',
      details: {
        address: 'Pettah Main Street',
        access: 'Pedestrian bay',
        temperature: 'Chilled',
        note: 'Successfully handed over.',
      },
    },
    {
      stop: '07',
      outlet: 'OUT052',
      brand: 'Waypoint Style',
      window: '09:00-09:45',
      eta: '09:18',
      orderId: 'ORD-1071',
      load: '430 kg',
      status: 'On Time',
      statusType: 'ontime',
      details: {
        address: 'Colombo Fort Promenade',
        access: 'Rear alley',
        temperature: 'Ambient',
        note: 'Clear parking permit required.',
      },
    },
    {
      stop: '08',
      outlet: 'OUT011',
      brand: 'Waypoint Fresh',
      window: '09:45-10:30',
      eta: '10:06',
      orderId: 'ORD-1076',
      load: '460 kg',
      status: 'Problem',
      statusType: 'problem',
      details: {
        address: 'Kollupitiya Super Center',
        access: 'Dock 4',
        temperature: 'Frozen',
        note: 'Check refrigeration temperature logs.',
      },
    },
  ]

  const toggleExpand = (stopNum) => {
    setExpandedStop(expandedStop === stopNum ? null : stopNum)
  }

  return (
    <div className="route-card stop-sequence-card">
      <div className="route-card-header flex-between">
        <div>
          <h2 className="route-card-title">Stop Sequence</h2>
          <p className="route-card-subtitle">8 ordered delivery stops Â· drag order is locked after confirmation</p>
        </div>
        <span className="stops-count-pill">8 stops</span>
      </div>

      <div className="table-responsive-container">
        <table className="stop-sequence-table">
          <thead>
            <tr>
              <th>STOP</th>
              <th>OUTLET</th>
              <th>BRAND</th>
              <th>DELIVERY WINDOW</th>
              <th>ETA</th>
              <th>ORDER ID</th>
              <th>LOAD</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {stops.map((item) => (
              <tr key={item.stop} className={expandedStop === item.stop ? 'row-expanded-highlight' : ''}>
                <td className="cell-stop-num bold">{item.stop}</td>
                <td className="cell-outlet bold">{item.outlet}</td>
                <td className="cell-brand">{item.brand}</td>
                <td className="cell-window">{item.window}</td>
                <td className="cell-eta bold">{item.eta}</td>
                <td className="cell-order-link">
                  <Link to={`/dispatcher/orders/${item.orderId}`} className="blue-table-link">
                    {item.orderId}
                  </Link>
                </td>
                <td className="cell-load">{item.load}</td>
                <td className="cell-status">
                  <span className={`status-pill-badge pill-${item.statusType}`}>
                    <span className="dot"></span>
                    {item.status}
                  </span>
                </td>
                <td className="cell-actions">
                  <button
                    type="button"
                    className="btn-table-more"
                    onClick={() => toggleExpand(item.stop)}
                    title={expandedStop === item.stop ? 'Collapse' : 'Expand stop details'}
                  >
                    <img src={moreIcon} alt="" className="table-more-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Stop Detail Box (Displays active stop details) */}
      {expandedStop && (
        <div className="stop-expanded-card">
          <div className="expanded-card-top-row">
            <div className="expanded-title-group">
              <h3 className="expanded-outlet-title">
                {stops.find((s) => s.stop === expandedStop)?.outlet} â€” {stops.find((s) => s.stop === expandedStop)?.brand}
              </h3>
              <p className="expanded-subtitle">
                Stop {expandedStop} Â· expanded delivery detail
              </p>
            </div>
            <span className={`status-pill-badge pill-${stops.find((s) => s.stop === expandedStop)?.statusType}`}>
              <span className="dot"></span>
              {stops.find((s) => s.stop === expandedStop)?.status.toUpperCase()}
            </span>
          </div>

          <div className="expanded-details-grid">
            <div className="expanded-detail-col">
              <span className="exp-label">Delivery Window</span>
              <span className="exp-val bold">
                {stops.find((s) => s.stop === expandedStop)?.window.replace('-', ' AM - ')} AM
              </span>
            </div>
            <div className="expanded-detail-col">
              <span className="exp-label">Address</span>
              <span className="exp-val">
                {stops.find((s) => s.stop === expandedStop)?.details.address}
              </span>
            </div>
            <div className="expanded-detail-col">
              <span className="exp-label">Access</span>
              <span className="exp-val">
                {stops.find((s) => s.stop === expandedStop)?.details.access}
              </span>
            </div>
            <div className="expanded-detail-col">
              <span className="exp-label">Order</span>
              <Link
                to={`/dispatcher/orders/${stops.find((s) => s.stop === expandedStop)?.orderId}`}
                className="exp-val blue-link bold"
              >
                {stops.find((s) => s.stop === expandedStop)?.orderId}
              </Link>
            </div>
            <div className="expanded-detail-col">
              <span className="exp-label">Load</span>
              <span className="exp-val bold">
                {stops.find((s) => s.stop === expandedStop)?.load}
              </span>
            </div>
            <div className="expanded-detail-col">
              <span className="exp-label">Temperature</span>
              <span className="exp-val">
                {stops.find((s) => s.stop === expandedStop)?.details.temperature}
              </span>
            </div>
          </div>

          {/* Delivery Special Instruction Banner */}
          <div className="expanded-instruction-box">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
              <circle cx="5.5" cy="18.5" r="2.5" />
              <circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
            <span>{stops.find((s) => s.stop === expandedStop)?.details.note}</span>
          </div>
        </div>
      )}
    </div>
  )
}
