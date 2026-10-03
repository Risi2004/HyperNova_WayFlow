# WayFlow — Data Model

PostgreSQL schema defined in `backend/schema.js` (tables plus idempotent migrations).
Reference tables are loaded from the competition datasets; operational tables are written by the
four roles as orders move through the day.

## Entity relationships

```mermaid
erDiagram
  OUTLETS ||--o{ ORDERS : places
  OUTLETS ||--o{ USERS : "store manager of"
  VEHICLES ||--o{ USERS : "driver assigned to"
  VEHICLES ||--o{ TRIPS : runs
  VEHICLES ||--o{ VEHICLE_AVAILABILITY : "workshop days"
  USERS ||--o{ ORDERS : creates
  USERS ||--o{ TRIPS : drives
  ORDERS ||--|{ ORDER_ITEMS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : "ordered as"
  ORDERS ||--o{ ORDER_STATUS_EVENTS : "audit trail"
  ORDERS ||--o{ ORDER_DEFERRALS : "deferred with reason"
  DELIVERY_PLANS ||--o{ TRIPS : "day plan"
  TRIPS ||--|{ TRIP_STOPS : "stops in sequence"
  ORDERS ||--o| TRIP_STOPS : "served by"
  TRIP_STOPS ||--o| LOADING_VERIFICATIONS : "loaded / short"
  TRIP_STOPS ||--o| DELIVERY_RECORDS : "proof of delivery"
  ORDERS ||--o| RECEIPT_CONFIRMATIONS : "store sign-off"
  ORDERS ||--o{ OPERATIONAL_ISSUES : "problems raised"
  TRIPS ||--o{ OPERATIONAL_ISSUES : "problems raised"

  OUTLETS {
    varchar outlet_id PK
    varchar brand
    varchar district
    varchar depot
    varchar dock_type
    varchar parking_constraint
    time window_open_time
    time window_close_time
  }
  VEHICLES {
    varchar vehicle_id PK
    varchar type "truck | van"
    varchar temp "reefer | ambient"
    numeric weight_cap_kg
    numeric volume_cap_m3
    varchar depot
    numeric weekly_fuel_quota_l
  }
  USERS {
    varchar user_id PK
    varchar role
    varchar email
    varchar outlet_id FK
    varchar assigned_vehicle_id FK
  }
  ORDERS {
    varchar order_id PK
    varchar outlet_id FK
    date target_delivery_date
    varchar status
    varchar temp_requirement
    time requested_window_open
    time requested_window_close
    numeric total_weight_kg
    numeric total_volume_m3
    varchar priority
  }
  ORDER_ITEMS {
    bigint item_id PK
    varchar order_id FK
    varchar product_name
    int quantity_cases
    numeric total_item_weight_kg
  }
  TRIPS {
    varchar trip_id PK "TR-YYYYMMDD-VEHxxx-n"
    date delivery_date
    varchar vehicle_id FK
    int trip_number
    varchar status
    varchar driver_user_id FK
    numeric planned_fuel_l
    int budget_minutes
  }
  TRIP_STOPS {
    bigint stop_id PK
    varchar trip_id FK
    varchar order_id FK
    int stop_sequence
    time planned_arrival_time
    time actual_arrival_time
    varchar status
  }
  DELIVERY_RECORDS {
    bigint delivery_record_id PK
    varchar order_id FK
    varchar outcome
    bool is_late
    bool recorded_offline
    varchar client_event_id "idempotency key"
    text proof_photo_data
  }
  RECEIPT_CONFIRMATIONS {
    bigint confirmation_id PK
    varchar order_id FK
    varchar receipt_status
    int received_cases
    int damaged_cases
    int missing_cases
    jsonb line_details
  }
  OPERATIONAL_ISSUES {
    bigint issue_id PK
    varchar related_order_id FK
    varchar related_trip_id FK
    varchar issue_category
    varchar severity
    varchar resolution_status
    text photo_data
  }
```

## Tables

### Reference data (from the competition datasets)

| Table | Source | Purpose |
| --- | --- | --- |
| `outlets` | `outlets.csv` | 120 outlets: brand, district, depot, dock type, van-only / mall access, delivery window |
| `vehicles` | `vehicles.csv` | 60 vehicles: type, refrigeration, capacity, depot, fuel quota |
| `operating_calendar` | `calendar.csv` | Operating days and season (drives cutoff dates and next runs) |
| `district_travel` | `district_travel.csv` | Depot-to-district and inter-stop distance and free-flow time |
| `service_allowance` | `service_allowance.csv` | Unloading minutes per brand and dock type |
| `traffic_speed_index` | `traffic_speed.csv` | Speed index by district, hour and monsoon |
| `road_disruptions` | `road_conditions.csv` | Daily disruption index by district |
| `products` | `backend/seedProducts.js` | Orderable catalogue per brand with unit weight, volume and temperature |

### Operational data

| Table | Written by | Purpose |
| --- | --- | --- |
| `users` | Admin, seed | Accounts and roles; store managers link to an outlet, drivers to a vehicle |
| `orders`, `order_items` | Store Manager | Orders split by temperature, with window, totals and lifecycle status |
| `order_status_events` | Every role | Audit trail of each status change, with actor and note |
| `order_intake_closures` | Dispatcher | Early close of order intake for a delivery date |
| `delivery_plans` | Dispatcher | One plan per delivery date (draft or published) with unscheduled orders and reasons |
| `vehicle_availability` | Dispatcher, scenario | Vehicles in the workshop on a date |
| `trips`, `trip_stops` | Planner | Trips per vehicle and the ordered stops with planned times |
| `order_deferrals` | Planner, Dispatcher | Why an order was deferred and its next scheduled date |
| `loading_verifications` | Loader | Per-order loading check and shortfalls |
| `delivery_records` | Driver | Arrival, outcome, proof-of-delivery photo, lateness, offline flag |
| `receipt_confirmations` | Store Manager | Counted receipt per line, temperature check, discrepancies |
| `operational_issues` | Driver, Store Manager, Loader | Problems with category, severity, photo and resolution by dispatch |

## Integrity rules

- Order status changes go through `transitionOrder`, which rejects transitions the lifecycle does
  not allow and writes an `order_status_events` row in the same transaction.
- `trip_stops.order_id` is unique: an order is on at most one trip.
- `delivery_records.client_event_id` and `operational_issues.client_event_id` have unique indexes,
  so offline replays cannot create duplicates.
- `receipt_confirmations.order_id` is unique: a delivery is signed off once; later problems are
  raised as issues.
- Store managers can only read and act on their own outlet's orders; other outlets on the same trip
  are shown by position only.
