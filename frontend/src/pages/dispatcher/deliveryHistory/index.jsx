import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'

// Delivery History Overview List Components
import DeliveryHistoryHeader from '../../../components/dispatcher/deliveryHistory/DeliveryHistoryHeader'
import DeliveryHistoryStatCards from '../../../components/dispatcher/deliveryHistory/DeliveryHistoryStatCards'
import DeliveryHistoryFilterBar from '../../../components/dispatcher/deliveryHistory/DeliveryHistoryFilterBar'
import DeliveryHistoryTable from '../../../components/dispatcher/deliveryHistory/DeliveryHistoryTable'

// Single Delivery Detail & POD Components
import SingleDeliveryHeader from '../../../components/dispatcher/deliveryHistory/SingleDeliveryHeader'
import SingleDeliverySummaryCard from '../../../components/dispatcher/deliveryHistory/SingleDeliverySummaryCard'
import SingleDeliveryTimeline from '../../../components/dispatcher/deliveryHistory/SingleDeliveryTimeline'
import SingleDeliveryPodCard from '../../../components/dispatcher/deliveryHistory/SingleDeliveryPodCard'
import SingleDeliveryMapCard from '../../../components/dispatcher/deliveryHistory/SingleDeliveryMapCard'
import SingleDeliveryItemsTable from '../../../components/dispatcher/deliveryHistory/SingleDeliveryItemsTable'

import './DeliveryHistory.css'

export default function DeliveryHistory() {
  const { delivery_id } = useParams()

  // State for Overview List Filtering
  const [activeTab, setActiveTab] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [depotFilter, setDepotFilter] = useState('All')
  const [brandFilter, setBrandFilter] = useState('All')
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const initialHistory = [
    {
      id: 'DEL-8401',
      orderId: 'ORD-2026-1048',
      outletCode: 'OUT042',
      outletName: 'Waypoint Fresh Colombo North',
      brand: 'Waypoint Fresh',
      completedAt: '26 Sep 2026, 09:14 AM',
      driver: 'K. Perera',
      vehicle: 'WP-CB-4521',
      vehicleType: 'Refrigerated Truck',
      depot: 'Peliyagoda',
      duration: '16 mins',
      podType: 'Sign + Photo + GPS',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      id: 'DEL-8398',
      orderId: 'ORD-2026-1042',
      outletCode: 'OUT031',
      outletName: 'Waypoint Style Kollupitiya',
      brand: 'Waypoint Style',
      completedAt: '26 Sep 2026, 08:52 AM',
      driver: 'S. Alwis',
      vehicle: 'WP-LG-3120',
      vehicleType: 'Dry-box Truck',
      depot: 'Peliyagoda',
      duration: '22 mins',
      podType: 'Sign + Photo',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      id: 'DEL-8395',
      orderId: 'ORD-2026-1039',
      outletCode: 'OUT019',
      outletName: 'Waypoint Tech Kandy Central',
      brand: 'Waypoint Tech',
      completedAt: '26 Sep 2026, 08:35 AM',
      driver: 'N. Fernando',
      vehicle: 'WP-VN-1845',
      vehicleType: 'Van',
      depot: 'Kandy',
      duration: '18 mins',
      podType: 'Sign + GPS',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      id: 'DEL-8389',
      orderId: 'ORD-2026-1031',
      outletCode: 'OUT055',
      outletName: 'Waypoint Fresh Rajagiriya',
      brand: 'Waypoint Fresh',
      completedAt: '26 Sep 2026, 08:10 AM',
      driver: 'R. Dias',
      vehicle: 'WP-CB-4528',
      vehicleType: 'Refrigerated Truck',
      depot: 'Peliyagoda',
      duration: '25 mins',
      podType: 'Sign + Photo + Temp',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      id: 'DEL-8382',
      orderId: 'ORD-2026-1025',
      outletCode: 'OUT078',
      outletName: 'Waypoint Style Peradeniya',
      brand: 'Waypoint Style',
      completedAt: '26 Sep 2026, 07:48 AM',
      driver: 'P. Jayasuriya',
      vehicle: 'WP-VN-2290',
      vehicleType: 'Van',
      depot: 'Kandy',
      duration: '35 mins',
      podType: 'Exception Logged',
      status: 'Returned',
      statusType: 'returned',
    },
    {
      id: 'DEL-8376',
      orderId: 'ORD-2026-1018',
      outletCode: 'OUT062',
      outletName: 'Waypoint Tech Dehiwala',
      brand: 'Waypoint Tech',
      completedAt: '26 Sep 2026, 07:20 AM',
      driver: 'M. Bandara',
      vehicle: 'WP-LG-3112',
      vehicleType: 'Dry-box Truck',
      depot: 'Peliyagoda',
      duration: '20 mins',
      podType: 'Sign + Photo',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      id: 'DEL-8369',
      orderId: 'ORD-2026-1011',
      outletCode: 'OUT014',
      outletName: 'Waypoint Fresh Moratuwa',
      brand: 'Waypoint Fresh',
      completedAt: '26 Sep 2026, 06:55 AM',
      driver: 'K. Perera',
      vehicle: 'WP-CB-4521',
      vehicleType: 'Refrigerated Truck',
      depot: 'Peliyagoda',
      duration: '19 mins',
      podType: 'Sign + Photo',
      status: 'Completed',
      statusType: 'completed',
    },
    {
      id: 'DEL-8361',
      orderId: 'ORD-2026-1004',
      outletCode: 'OUT089',
      outletName: 'Waypoint Fresh Katugastota',
      brand: 'Waypoint Fresh',
      completedAt: '25 Sep 2026, 18:30 PM',
      driver: 'T. Silva',
      vehicle: 'WP-CB-4505',
      vehicleType: 'Refrigerated Truck',
      depot: 'Kandy',
      duration: '—',
      podType: 'None',
      status: 'Cancelled',
      statusType: 'cancelled',
    },
  ]

  // Filtered List
  const filteredDeliveries = useMemo(() => {
    return initialHistory.filter((item) => {
      // Tab filter
      if (activeTab !== 'All' && item.status !== activeTab) {
        return false
      }

      // Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          item.id.toLowerCase().includes(q) ||
          item.orderId.toLowerCase().includes(q) ||
          item.outletCode.toLowerCase().includes(q) ||
          item.outletName.toLowerCase().includes(q) ||
          item.driver.toLowerCase().includes(q) ||
          item.vehicle.toLowerCase().includes(q)
        if (!matches) return false
      }

      // Dropdown filters
      if (depotFilter !== 'All' && item.depot !== depotFilter) return false
      if (brandFilter !== 'All' && item.brand !== brandFilter) return false
      if (vehicleTypeFilter !== 'All' && item.vehicleType !== vehicleTypeFilter) return false

      return true
    })
  }, [initialHistory, activeTab, searchQuery, depotFilter, brandFilter, vehicleTypeFilter])

  const handleClearFilters = () => {
    setActiveTab('All')
    setSearchQuery('')
    setDepotFilter('All')
    setBrandFilter('All')
    setVehicleTypeFilter('All')
  }

  // Determine if viewing single delivery details
  const isSingleDeliveryView = Boolean(delivery_id)
  const currentDeliveryId = delivery_id && delivery_id !== 'delivery_id' ? delivery_id : 'DEL-8401'

  return (
    <div className="history-page-container">
      {/* Sidebar with Delivery History active */}
      <Sidebar activeItem="Delivery History" />

      {/* Main Content Area */}
      <div className="history-main-wrapper">
        <Header />

        <main className="history-content">
          {isSingleDeliveryView ? (
            /* ========================================================
               SINGLE DELIVERY DETAIL VIEW (POD & AUDIT TRAIL)
               ======================================================== */
            <>
              {/* Header with Back, Title, Badges, Print & Download actions */}
              <SingleDeliveryHeader deliveryId={currentDeliveryId} />

              {/* 12-cell Summary Grid */}
              <SingleDeliverySummaryCard deliveryId={currentDeliveryId} />

              {/* Milestone Stepper */}
              <SingleDeliveryTimeline />

              {/* Middle Row: Cryptographic POD & React Leaflet Geofence Map */}
              <div className="single-middle-two-col">
                <SingleDeliveryPodCard />
                <SingleDeliveryMapCard />
              </div>

              {/* Manifest Items Table with Acceptance verification */}
              <SingleDeliveryItemsTable />
            </>
          ) : (
            /* ========================================================
               DELIVERY HISTORY OVERVIEW & LIST VIEW
               ======================================================== */
            <>
              {/* Header & Date / Search / Export */}
              <DeliveryHistoryHeader />

              {/* 4 Summary Metric Cards */}
              <DeliveryHistoryStatCards />

              {/* Status Tabs, Search Box, Dropdowns */}
              <DeliveryHistoryFilterBar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                depotFilter={depotFilter}
                setDepotFilter={setDepotFilter}
                brandFilter={brandFilter}
                setBrandFilter={setBrandFilter}
                vehicleTypeFilter={vehicleTypeFilter}
                setVehicleTypeFilter={setVehicleTypeFilter}
                onClearFilters={handleClearFilters}
              />

              {/* Historical Records Table */}
              <DeliveryHistoryTable
                deliveries={filteredDeliveries}
                currentPage={currentPage}
                totalPages={145}
                onPageChange={setCurrentPage}
              />
            </>
          )}

          {/* Operational Footer */}
          <footer className="dispatcher-footer">
            <span>Operational data synced at 09:26 • West Hub timezone</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
