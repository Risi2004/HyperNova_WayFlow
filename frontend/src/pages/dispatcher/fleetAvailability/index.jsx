import { useState } from 'react'
import Sidebar from '../../../components/dispatcher/layout/Sidebar'
import Header from '../../../components/dispatcher/layout/Header'
import FleetHeader from '../../../components/dispatcher/fleetAvailability/FleetHeader'
import FleetMetricCards from '../../../components/dispatcher/fleetAvailability/FleetMetricCards'
import FleetFilterBar from '../../../components/dispatcher/fleetAvailability/FleetFilterBar'
import FleetTable from '../../../components/dispatcher/fleetAvailability/FleetTable'
import FleetCapacityOverview from '../../../components/dispatcher/fleetAvailability/FleetCapacityOverview'
import FleetAttentionSection from '../../../components/dispatcher/fleetAvailability/FleetAttentionSection'
import SuitabilityChecksBanner from '../../../components/dispatcher/fleetAvailability/SuitabilityChecksBanner'

import './FleetAvailability.css'

export default function FleetAvailability() {
  const [searchQuery, setSearchQuery] = useState('')
  const [vehicleType, setVehicleType] = useState('all')
  const [temperature, setTemperature] = useState('all')
  const [depot, setDepot] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [tripFilter, setTripFilter] = useState('any')
  const [fuelFilter, setFuelFilter] = useState('any')

  const initialVehicles = [
    {
      id: 'WP-CA-2847',
      type: 'Refrigerated Truck',
      depot: 'Peliyagoda',
      temp: 'Refrigerated',
      tempType: 'refrigerated',
      tempDetail: 'Chilled + Frozen + Ambient',
      weightText: '1,850 / 2,500 kg',
      weightPercent: 74,
      volumeText: '18.2 / 22 m³',
      volumePercent: 83,
      fuelRemaining: '82% remaining',
      fuelKm: '530 km remaining',
      isFuelLow: false,
      tripStatus: 'Trip 1 / 2',
      tripAvailText: '1 available',
      assignmentTitle: 'Route 04',
      assignmentSub: 'Departure 06:30 AM • Stops 5',
      availability: 'ASSIGNED',
    },
    {
      id: 'WP-CA-3912',
      type: 'Dry-box Truck',
      depot: 'Peliyagoda',
      temp: 'Ambient',
      tempType: 'ambient',
      tempDetail: 'Ambient goods only',
      weightText: '0 / 4,000 kg',
      weightPercent: 0,
      volumeText: '0 / 30 m³',
      volumePercent: 0,
      fuelRemaining: '64% remaining',
      fuelKm: '344 km remaining',
      isFuelLow: false,
      tripStatus: 'No Trip',
      tripAvailText: '2 available',
      assignmentTitle: 'No current assignment',
      assignmentSub: 'Both trips available today',
      availability: 'AVAILABLE',
    },
    {
      id: 'WP-KA-1184',
      type: 'Refrigerated Van',
      depot: 'Kandy',
      temp: 'Refrigerated',
      tempType: 'refrigerated',
      tempDetail: 'Chilled + Frozen + Ambient',
      weightText: '610 / 900 kg',
      weightPercent: 68,
      volumeText: '5.6 / 8 m³',
      volumePercent: 70,
      fuelRemaining: '51% remaining',
      fuelKm: '196 km remaining',
      isFuelLow: false,
      tripStatus: 'Trip 2 / 2',
      tripAvailText: 'Fully allocated',
      assignmentTitle: 'Route 11',
      assignmentSub: 'Departure 01:15 PM • Stops 4',
      availability: 'ASSIGNED',
    },
    {
      id: 'WP-KA-2041',
      type: 'Van',
      depot: 'Kandy',
      temp: 'Ambient',
      tempType: 'ambient',
      tempDetail: 'Ambient goods only',
      weightText: '0 / 700 kg',
      weightPercent: 0,
      volumeText: '0 / 7 m³',
      volumePercent: 0,
      fuelRemaining: '28% remaining',
      fuelKm: '88 km remaining',
      isFuelLow: false,
      tripStatus: 'No Trip',
      tripAvailText: '2 available',
      assignmentTitle: 'No current assignment',
      assignmentSub: 'Both trips available today',
      availability: 'AVAILABLE',
    },
    {
      id: 'WP-CA-2931',
      type: 'Dry-box Truck',
      depot: 'Peliyagoda',
      temp: 'Ambient',
      tempType: 'ambient',
      tempDetail: 'Ambient goods only',
      weightText: '2,920 / 4,000 kg',
      weightPercent: 73,
      volumeText: '21.8 / 30 m³',
      volumePercent: 73,
      fuelRemaining: '14% remaining • Low',
      fuelKm: '42 km remaining',
      isFuelLow: true,
      tripStatus: 'Trip 1 / 2',
      tripAvailText: '1 available',
      assignmentTitle: 'Route 08',
      assignmentSub: 'Dock 3 • Loading 78% complete',
      availability: 'LOADING',
    },
    {
      id: 'WP-KA-1204',
      type: 'Refrigerated Truck',
      depot: 'Kandy',
      temp: 'Refrigerated',
      tempType: 'refrigerated',
      tempDetail: 'Chilled + Frozen + Ambient',
      weightText: '2,320 / 2,500 kg',
      weightPercent: 93,
      volumeText: '21.2 / 22 m³',
      volumePercent: 96,
      fuelRemaining: '47% remaining',
      fuelKm: '198 km remaining',
      isFuelLow: false,
      tripStatus: 'Trip 1 / 2',
      tripAvailText: '1 available',
      assignmentTitle: 'Route 14',
      assignmentSub: 'Departed 08:35 AM • Stops 6',
      availability: 'IN TRANSIT',
    },
    {
      id: 'WP-CA-1842',
      type: 'Refrigerated Van',
      depot: 'Peliyagoda',
      temp: 'Refrigerated',
      tempType: 'refrigerated',
      tempDetail: 'Chilled + Frozen + Ambient',
      weightText: '0 / 900 kg',
      weightPercent: 0,
      volumeText: '0 / 8 m³',
      volumePercent: 0,
      fuelRemaining: '72% remaining',
      fuelKm: '174 km remaining',
      isFuelLow: false,
      tripStatus: 'Unavailable',
      tripAvailText: 'Fully allocated',
      assignmentTitle: 'Scheduled maintenance',
      assignmentSub: 'Inspection - Return 28 Sep',
      availability: 'MAINTENANCE',
    },
    {
      id: 'WP-CA-4470',
      type: 'Dry-box Truck',
      depot: 'Peliyagoda',
      temp: 'Ambient',
      tempType: 'ambient',
      tempDetail: 'Ambient goods only',
      weightText: '3,520 / 4,000 kg',
      weightPercent: 88,
      volumeText: '25.5 / 30 m³',
      volumePercent: 85,
      fuelRemaining: '34% remaining',
      fuelKm: '87 km remaining',
      isFuelLow: false,
      tripStatus: 'Trip 2 / 2',
      tripAvailText: 'Fully allocated',
      assignmentTitle: 'Route 10',
      assignmentSub: 'Departure 09:45 PM • Stops 3',
      availability: 'ASSIGNED',
    },
  ]

  // Filter logic
  const filteredVehicles = initialVehicles.filter((v) => {
    const matchesSearch =
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.depot.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType =
      vehicleType === 'all' ||
      (vehicleType === 'truck' && v.type.includes('Truck')) ||
      (vehicleType === 'dry-box' && v.type.includes('Dry-box')) ||
      (vehicleType === 'van' && v.type.includes('Van'))

    const matchesTemp =
      temperature === 'all' || v.tempType === temperature

    const matchesDepot =
      depot === 'all' || v.depot.toLowerCase() === depot.toLowerCase()

    const matchesAvail =
      availability === 'all' ||
      v.availability.toLowerCase() === availability.toLowerCase().replace('_', ' ')

    return matchesSearch && matchesType && matchesTemp && matchesDepot && matchesAvail
  })

  const handleClearFilters = () => {
    setSearchQuery('')
    setVehicleType('all')
    setTemperature('all')
    setDepot('all')
    setAvailability('all')
    setTripFilter('any')
    setFuelFilter('any')
  }

  return (
    <div className="fleet-page-container">
      {/* Left Navigation Sidebar */}
      <Sidebar activeItem="Fleet Availability" />

      {/* Main Content Area */}
      <div className="fleet-main-wrapper">
        <Header />

        <main className="fleet-content">
          {/* Header & Depot Tabs */}
          <FleetHeader onRefresh={() => {}} />

          {/* 7 Summary Metric Cards */}
          <FleetMetricCards />

          {/* Filter Bar */}
          <FleetFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
            temperature={temperature}
            setTemperature={setTemperature}
            depot={depot}
            setDepot={setDepot}
            availability={availability}
            setAvailability={setAvailability}
            tripFilter={tripFilter}
            setTripFilter={setTripFilter}
            fuelFilter={fuelFilter}
            setFuelFilter={setFuelFilter}
            onClearFilters={handleClearFilters}
          />

          {/* Data Table */}
          <FleetTable vehicles={filteredVehicles} />

          {/* Fleet Capacity Overview */}
          <FleetCapacityOverview />

          {/* Fleet Attention Section */}
          <FleetAttentionSection />

          {/* Suitability Checks Advisory Banner */}
          <SuitabilityChecksBanner />

          {/* Footer */}
          <footer className="dispatcher-footer">
            <span>Operational data synced at 10:42 • West Hub timezone</span>
            <a href="#help" className="footer-link">
              Help & operational support
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
