import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DriverNavbar from '../../../components/driver/DriverNavbar'
import TripDetailsHeader from '../../../components/driver/tripDetails/TripDetailsHeader'
import TripOverviewCard from '../../../components/driver/tripDetails/TripOverviewCard'
import RouteStopsListCard from '../../../components/driver/tripDetails/RouteStopsListCard'
import './TripDetails.css'

const DEFAULT_TRIP_DETAILS = {
  tripId: 'TR-024',
  status: 'In Progress',
  vehicle: 'WP-REF-007 (Refrigerated Truck)',
  routePathway: 'Peliyagoda HQ → Colombo South',
  departureTime: 'Today, 06:00 AM',
  stopsSummary: '8 Stops (4 Completed, 4 Remaining)',
  completedStops: 4,
  totalStops: 8,
}

const DEFAULT_STOPS_LIST = [
  {
    id: 1,
    stopNumber: '01',
    name: 'WayFlow Fresh',
    orderCode: 'OUT039',
    location: 'Colombo 01',
    deliveryWindow: '08:00 AM - 08:30 AM',
    status: 'completed',
  },
  {
    id: 2,
    stopNumber: '02',
    name: 'City Market',
    orderCode: 'OUT040',
    location: 'Colombo 02',
    deliveryWindow: '08:45 AM - 09:15 AM',
    status: 'completed',
  },
  {
    id: 3,
    stopNumber: '03',
    name: 'Green Basket',
    orderCode: 'OUT041',
    location: 'Colombo 03',
    deliveryWindow: '09:30 AM - 10:00 AM',
    status: 'completed',
  },
  {
    id: 4,
    stopNumber: '04',
    name: 'WayFlow Fresh',
    orderCode: 'OUT042',
    location: 'Colombo 04',
    deliveryWindow: '10:15 AM - 10:45 AM',
    status: 'completed',
  },
  {
    id: 5,
    stopNumber: '05',
    name: 'Metro Grocers',
    orderCode: 'OUT043',
    location: 'Colombo 05',
    deliveryWindow: '11:00 AM - 11:30 AM',
    status: 'current',
  },
  {
    id: 6,
    stopNumber: '06',
    name: 'Fresh Corner',
    orderCode: 'OUT044',
    location: 'Colombo 06',
    deliveryWindow: '11:45 AM - 12:15 PM',
    status: 'scheduled',
  },
  {
    id: 7,
    stopNumber: '07',
    name: 'Daily Mart',
    orderCode: 'OUT045',
    location: 'Colombo 07',
    deliveryWindow: '12:30 PM - 01:00 PM',
    status: 'scheduled',
  },
  {
    id: 8,
    stopNumber: '08',
    name: 'City Grocers',
    orderCode: 'OUT046',
    location: 'Colombo 08',
    deliveryWindow: '01:15 PM - 01:45 PM',
    status: 'scheduled',
  },
]

export default function TripDetails() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const activeTripId = tripId || 'TR-024'

  const [tripData] = useState({
    ...DEFAULT_TRIP_DETAILS,
    tripId: activeTripId,
  })

  const [stops] = useState(DEFAULT_STOPS_LIST)

  const handleViewStopDetails = (stop) => {
    navigate(`/driver/my-trips/${activeTripId}/delivery-stop`)
  }

  return (
    <div className="trip-details-page-container">
      {/* Top Navbar with My Trips active */}
      <DriverNavbar activeTab="My Trips" />

      {/* Main Page Body */}
      <main className="trip-details-main-content">
        {/* Breadcrumb Header Row */}
        <TripDetailsHeader
          tripId={activeTripId}
          status={tripData.status}
        />

        {/* Overview Specifications & Progress Bar */}
        <TripOverviewCard trip={tripData} />

        {/* 8-Stop Route Details List */}
        <RouteStopsListCard
          stops={stops}
          onViewStopDetails={handleViewStopDetails}
        />
      </main>
    </div>
  )
}
