import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import LoaderHeader from '../../../components/loader/LoaderHeader'
import LoaderStatCards from '../../../components/loader/LoaderStatCards'
import TodaysLoadsTable from '../../../components/loader/TodaysLoadsTable'
import LoadingProgressCard from '../../../components/loader/LoadingProgressCard'
import AttentionRequiredCard from '../../../components/loader/AttentionRequiredCard'
import UpcomingDeparturesCard from '../../../components/loader/UpcomingDeparturesCard'
import './LoaderDashboard.css'

export default function LoaderDashboard() {
  return (
    <div className="loader-layout-container">
      {/* Left Sidebar */}
      <LoaderSidebar activeItem="Dashboard" />

      {/* Main Content Area */}
      <div className="loader-main-wrapper">
        <main className="loader-content">
          {/* Header */}
          <LoaderHeader />

          {/* 4 Stat Metric Cards */}
          <LoaderStatCards />

          {/* Today's Loads Table Card */}
          <TodaysLoadsTable />

          {/* Bottom Grid: Left (Progress + Attention Card) & Right (Upcoming Departures) */}
          <div className="loader-bottom-two-col">
            <div className="loader-bottom-left-col">
              <LoadingProgressCard />
              <AttentionRequiredCard />
            </div>
            <div className="loader-bottom-right-col">
              <UpcomingDeparturesCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
