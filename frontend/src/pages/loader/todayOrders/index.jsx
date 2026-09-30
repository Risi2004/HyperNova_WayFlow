import { useParams } from 'react-router-dom'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import LoadDetailHeader from '../../../components/loader/todayOrders/LoadDetailHeader'
import LoadHeroCard from '../../../components/loader/todayOrders/LoadHeroCard'
import PlannedStopSequenceCard from '../../../components/loader/todayOrders/PlannedStopSequenceCard'
import ManifestContentsTable from '../../../components/loader/todayOrders/ManifestContentsTable'
import VehicleInfoCard from '../../../components/loader/todayOrders/VehicleInfoCard'
import LoadProgressSummaryCard from '../../../components/loader/todayOrders/LoadProgressSummaryCard'
import LoadAttentionBanner from '../../../components/loader/todayOrders/LoadAttentionBanner'
import LoadBottomBar from '../../../components/loader/todayOrders/LoadBottomBar'
import './TodayOrders.css'

export default function TodayOrders() {
  const { orderId, loadId } = useParams()
  const activeId = orderId || loadId || 'LD-025'

  const loadData = {
    id: activeId,
    status: 'LOADING',
    vehicleId: 'WP-REF-007',
    vehicleType: 'Refrigerated Truck',
    routeProfile: 'Peliyagoda → Colombo South',
    routeStopsDistance: '5 Stops · 52.4 km',
    departureTime: '06:00 AM',
    departureSub: 'Scheduled Today',
    progressPercent: 60,
    progressSub: '3 of 5 orders loaded successfully',
  }

  const handleReportIssue = () => {
    navigate(`/loader/today-loads/${activeId}/report-issue`)
  }

  const handleContinueLoading = () => {
    alert(`Continuing loading sequence for ${activeId}`)
  }

  return (
    <div className="today-orders-layout-container">
      {/* Sidebar with Today's Loads active */}
      <LoaderSidebar activeItem="Today's Loads" />

      {/* Main Content Area */}
      <div className="today-orders-main-wrapper">
        <main className="today-orders-content">
          {/* Header with Breadcrumb */}
          <LoadDetailHeader loadId={activeId} />

          {/* Hero Card */}
          <LoadHeroCard
            load={loadData}
            onReportIssue={handleReportIssue}
            onContinueLoading={handleContinueLoading}
          />

          {/* Two Column Grid */}
          <div className="load-detail-two-col">
            {/* Left Column: Sequence + Manifest */}
            <div className="load-detail-left-col">
              <PlannedStopSequenceCard />
              <ManifestContentsTable />
            </div>

            {/* Right Column: Vehicle Info + Loading Progress + Attention Alert */}
            <div className="load-detail-right-col">
              <VehicleInfoCard />
              <LoadProgressSummaryCard
                loadedCount={3}
                pendingCount={2}
                issuesCount={0}
                totalOrders={5}
                percentage={60}
              />
              <LoadAttentionBanner
                orderCode="ORD-1057"
                productName="Frozen Chicken"
                description="Requires ultra-low temp verify. Confirm frozen storage handling is pre-activated on WP-REF-007 before loading this shipment."
              />
            </div>
          </div>
        </main>

        {/* Sticky Bottom Dock */}
        <LoadBottomBar
          loadId={activeId}
          status="LOADING"
          loadedCount={3}
          totalCount={5}
          onReportIssue={handleReportIssue}
          onContinueLoading={handleContinueLoading}
        />
      </div>
    </div>
  )
}
