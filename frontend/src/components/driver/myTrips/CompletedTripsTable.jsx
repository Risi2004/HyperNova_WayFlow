export default function CompletedTripsTable({
  trips = [
    {
      id: 'TR-023',
      date: '26 Sep 2026',
      vehicle: 'WP-LOR-012',
      routePath: 'Colombo North Outlet Loop',
      departure: '05:45 AM',
      stops: '8/8',
      status: 'Completed',
    },
    {
      id: 'TR-022',
      date: '26 Sep 2026',
      vehicle: 'WP-REF-007',
      routePath: 'Colombo CBD Metro',
      departure: '06:00 AM',
      stops: '6/6',
      status: 'Completed',
    },
    {
      id: 'TR-021',
      date: '25 Sep 2026',
      vehicle: 'WP-VAN-004',
      routePath: 'Negombo Delivery Hub',
      departure: '06:30 AM',
      stops: '7/7',
      status: 'Completed',
    },
    {
      id: 'TR-020',
      date: '25 Sep 2026',
      vehicle: 'WP-DRY-019',
      routePath: 'Mall Outlets Distribution',
      departure: '07:00 AM',
      stops: '5/5',
      status: 'Completed',
    },
    {
      id: 'TR-019',
      date: '24 Sep 2026',
      vehicle: 'WP-REF-011',
      routePath: 'Galle Coastal Fast Track',
      departure: '06:15 AM',
      stops: '8/8',
      status: 'Completed',
    },
  ],
  currentPage = 1,
  totalPages = 2,
  totalTrips = 8,
  onPrev,
  onNext,
  onViewTrip,
}) {
  return (
    <div className="completed-trips-section">
      <h3 className="section-heading">Completed Trips Log</h3>

      <div className="completed-table-card">
        <div className="table-responsive-wrapper">
          <table className="completed-trips-table">
            <thead>
              <tr>
                <th>TRIP ID</th>
                <th>DATE</th>
                <th>VEHICLE</th>
                <th>ROUTE PATH</th>
                <th>DEPARTURE</th>
                <th>STOPS</th>
                <th>STATUS</th>
                <th className="th-action">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={8} className="table-empty-row">
                    No completed trips match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id} className="completed-table-row">
                    <td className="trip-id-cell">{trip.id}</td>
                    <td className="date-cell">{trip.date}</td>
                    <td className="vehicle-cell">{trip.vehicle}</td>
                    <td className="route-cell">{trip.routePath}</td>
                    <td className="departure-cell">{trip.departure}</td>
                    <td className="stops-cell">{trip.stops}</td>
                    <td className="status-cell">
                      <span className="completed-pill-badge">
                        <span className="pill-dot-green" />
                        <span>{trip.status}</span>
                      </span>
                    </td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="btn-table-view-action"
                        onClick={() => onViewTrip && onViewTrip(trip)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="completed-table-footer">
          <span className="showing-entries-text">
            Showing 1-{trips.length} of {totalTrips} completed trips
          </span>

          <div className="table-pagination-actions">
            <button
              type="button"
              className="btn-pagination-nav"
              onClick={onPrev}
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn-pagination-nav"
              onClick={onNext}
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
