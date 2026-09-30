import { useParams } from 'react-router-dom'
import LoaderSidebar from '../../../components/loader/LoaderSidebar'
import ReportIssueHeader from '../../../components/loader/reportIssue/ReportIssueHeader'
import ReportIssueMetaBar from '../../../components/loader/reportIssue/ReportIssueMetaBar'
import ReportIssueForm from '../../../components/loader/reportIssue/ReportIssueForm'
import './ReportIssue.css'

export default function ReportIssue() {
  const { orderId, loadId } = useParams()
  const activeId = orderId || loadId || 'LD-025'

  return (
    <div className="report-issue-layout-container">
      {/* Sidebar with Today's Loads active */}
      <LoaderSidebar activeItem="Today's Loads" />

      {/* Main Content Area */}
      <div className="report-issue-main-wrapper">
        <main className="report-issue-content">
          {/* Header */}
          <ReportIssueHeader
            loadId={activeId}
            vehicleId="WP-REF-007"
          />

          {/* Top Meta Strip */}
          <ReportIssueMetaBar
            loadId={activeId}
            vehicle="WP-REF-007 (Refrigerated Truck)"
            route="Peliyagoda → Colombo South (5 Stops)"
            departure="06:00 AM Today"
            progress="15 / 25 Items Loaded (60%)"
            status="LOADING"
          />

          {/* Main Record Loading Issue Form */}
          <ReportIssueForm loadId={activeId} />
        </main>
      </div>
    </div>
  )
}
