export default function RouteCorridorCard({ tripId = 'TR-024' }) {
  const corridorNodes = [
    {
      id: 'DC',
      name: 'Peliyagoda DC',
      time: 'Departed 09:10',
      type: 'depot',
      status: 'completed',
    },
    {
      id: 'C01',
      name: 'C01 Store',
      time: '09:25 AM',
      type: 'stop',
      status: 'completed',
    },
    {
      id: 'C02',
      name: 'C02 Store',
      time: '09:48 AM',
      type: 'stop',
      status: 'completed',
    },
    {
      id: 'C03',
      name: 'C03 Store',
      time: '10:12 AM',
      type: 'stop',
      status: 'completed',
    },
    {
      id: 'C05',
      name: 'C05 (Your Store)',
      time: 'ETA 10:45 AM',
      type: 'target',
      status: 'active',
    },
    {
      id: 'C06',
      name: 'C06 Store',
      time: '11:15 AM',
      type: 'stop',
      status: 'upcoming',
    },
    {
      id: 'C07',
      name: 'C07 Store',
      time: '11:45 AM',
      type: 'stop',
      status: 'upcoming',
    },
    {
      id: 'C08',
      name: 'C08 Store',
      time: '12:15 PM',
      type: 'stop',
      status: 'upcoming',
    },
  ]

  return (
    <div className="td-corridor-card">
      <div className="td-corridor-header">
        <div>
          <h3 className="td-corridor-title">
            Schematic Route Corridor &mdash; Trip {tripId}
          </h3>
          <p className="td-corridor-subtitle">
            Topological hub-to-store vector track (depot dispatch sequence)
          </p>
        </div>
        <span className="td-corridor-zone-badge">Zone: Metro South Corridor</span>
      </div>

      <div className="td-corridor-track-container">
        <div className="td-corridor-track-line" />

        <div className="td-corridor-nodes-row">
          {corridorNodes.map((node) => {
            const isCompleted = node.status === 'completed'
            const isActive = node.status === 'active'

            return (
              <div
                key={node.id}
                className={`td-corridor-node-col ${node.type} ${node.status}`}
              >
                {/* Node icon / shape */}
                {node.type === 'depot' ? (
                  <div className="td-node-shape depot">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                  </div>
                ) : isActive ? (
                  <div className="td-node-shape target-active">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4">
                      <rect x="1" y="3" width="15" height="13" />
                      <polygon points="16 8 20 8 23 11 23 16 16 16 8" />
                      <circle cx="5.5" cy="18.5" r="2.5" fill="#ffffff" />
                      <circle cx="18.5" cy="18.5" r="2.5" fill="#ffffff" />
                    </svg>
                  </div>
                ) : isCompleted ? (
                  <div className="td-node-shape completed">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="td-node-shape upcoming">
                    <span className="upcoming-num">{node.id.replace('C0', '')}</span>
                  </div>
                )}

                {/* Node Label & Time */}
                <div className="td-node-text-col">
                  <span className={`td-node-name ${isActive ? 'active-target-text' : ''}`}>
                    {node.name}
                  </span>
                  <span className={`td-node-time ${isActive ? 'active-target-time' : ''}`}>
                    {node.time}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
