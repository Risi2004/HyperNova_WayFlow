# WayFlow — Delivery planning and execution for Waypoint Group

WayFlow plans and runs Waypoint Group's daily outlet deliveries across four roles:

- **Store Manager:** orders stock before the 4 PM cutoff, tracks the delivery and signs off what arrived.
- **Dispatcher:** closes intake, builds a plan that respects every operating constraint, publishes
  it, defers what cannot fit (with a reason) and follows deliveries live.
- **Loader:** verifies each order onto the vehicle on a phone and records shortfalls.
- **Driver:** runs the trip on a phone, records arrivals and proof of delivery, and keeps working
  without signal; records sync when the connection returns.

Built for Tech-Triathlon 2026 (Hackathon phase).

- Architecture: [docs/architecture.md](docs/architecture.md)
- Data model: [docs/data-model.md](docs/data-model.md)
- AI tool disclosure: [docs/ai-disclosure.md](docs/ai-disclosure.md)

## Live demo

| | URL |
| --- | --- |
| Web app | [https://way-flow.vercel.app](https://way-flow.vercel.app/) |
| API base | [https://wayflow.onrender.com](https://wayflow.onrender.com) |
| API health | [https://wayflow.onrender.com/api/health](https://wayflow.onrender.com/api/health) |

## Seeded accounts

| Role | Email | Password | Linked to |
| --- | --- | --- | --- |
| Dispatcher | `kasun.fernando@wayflow.internal` | `dispatcher123` | Peliyagoda planning hub |
| Loader | `jordan.davis@wayflow.internal` | `loader123` | Peliyagoda DC |
| Driver | `marcus.vance@wayflow.internal` | `driver123` | Vehicle VEH035 (refrigerated van, Peliyagoda) |
| Store Manager | `sarah.perera@wayflow.internal` | `store123` | Outlet OUT001 (Waypoint Fresh, Colombo) |
| Admin | `alex.vance@wayflow.internal` | `admin123` | User and product management |

More seeded accounts: `rohan.j@…` (Dispatcher, Kandy, `dispatcher123`), `praveen.w@…` (Loader,
Kandy, `loader123`), `dinesh.silva@…` (Driver, VEH009, `driver123`), `nimali.r@…` (Store Manager,
OUT081 Kandy, `store123`). All use the `@wayflow.internal` domain.

## Quick start with Docker (judges)

Requirements: Docker Desktop (or Docker Engine with Compose v2).

1. Copy the competition CSV files into `datasets/` at the repository root. The folder must contain
   `outlets.csv`, `vehicles.csv`, `calendar.csv`, `district_travel.csv`, `service_allowance.csv`,
   `traffic_speed.csv` and `road_conditions.csv`. The datasets are confidential, so they are not in
   the repository.
2. Optionally `cp .env.example .env` and change ports or secrets. Every value has a working default.
3. Start everything:

   ```bash
   docker compose up --build
   ```

4. Open http://localhost:8080 and sign in with an account above. The API is at
   http://localhost:5000/api/health.

The first start creates the schema and seeds the datasets, the accounts, a completed sample
delivery day and the peak-day scenario for the next operating day. Later starts keep the data.
To start again from scratch, run `docker compose down -v`.

## Local development (without Docker)

Requirements: Node.js 18+ (22 recommended) and a PostgreSQL 14+ database (local or Neon).

```bash
# API
cd backend
cp .env.example .env          # set DATABASE_URL and JWT_SECRET
npm install
npm run migrate               # create / update the schema (safe to re-run)
npm run seed                  # datasets from ../datasets, accounts, sample day, peak-day scenario
npm run dev                   # http://localhost:5000

# Web app (second terminal)
cd frontend
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:5173
```

### Backend scripts

| Command | What it does |
| --- | --- |
| `npm run migrate` | Creates missing tables and applies migrations. Never drops data. |
| `npm run seed` | Imports the datasets and seeds accounts and demo days. Skips rows that already exist. |
| `npm run demo [-- YYYY-MM-DD] [--draft]` | Loads the peak-day scenario for a date (default: next operating day), runs the planner and publishes the plan. With `--draft`, it stops before publishing. |

### Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | backend | PostgreSQL connection string (Neon: include `sslmode=require`) |
| `JWT_SECRET` | backend | Secret for signing session tokens |
| `PORT` | backend | API port (default 5000) |
| `FRONTEND_URL` | backend | Web app address used in account e-mails |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | backend | Optional SMTP for new-account e-mails |
| `DATASETS_DIR` | backend | Folder with the competition CSVs (default `../datasets`) |
| `WAYFLOW_NOW` | backend | Optional fixed clock for demos, e.g. `2026-10-04T10:00:00+05:30` |
| `VITE_API_URL` | frontend | API base URL baked into the web app build |

## Judge walkthrough

The steps follow one order from the store's request to its signed receipt. Loader and Driver
screens are designed for a phone. In the browser's device toolbar, use a phone size such as 375 × 812.

**Store Manager — place an order**

1. Sign in as **Sarah Perera** (Store Manager). The dashboard shows the next delivery date and the
   time left before its 4 PM cutoff.
2. Open **Create Order**, keep the earliest delivery date, add a chilled product (e.g. milk) and an
   ambient product, then **Submit Order**. WayFlow splits the order in two so chilled goods travel
   on a refrigerated vehicle. Both appear in **My Orders** as pending. Note the delivery date.

**Dispatcher — plan a day when demand exceeds capacity**

3. Sign in as **Kasun Fernando** (Dispatcher). On **Orders**, use **Close intake** for that delivery
   date. This confirms the orders now instead of waiting for the cutoff.
4. Open **Delivery Planner** and select the same date. Click **Load peak-day scenario**: festival-week
   demand for every outlet arrives and 10 vehicles go into the workshop.
5. Click **Suggest Plan**. Each vehicle shows its trips, load, time and fuel against its limits.
   Orders that cannot be served are listed as unscheduled with the binding reason (no refrigerated
   vehicle, van-only access, window, trip budget, fuel quota or capacity).
6. Optional: drag an unscheduled order onto a vehicle's trip. The planner checks the move against every
   constraint and explains any it breaks before saving.
7. Click **Publish Plan**. Planned orders go to loaders and drivers; unscheduled orders are deferred
   to the next run with their reason (see **Deferred Orders**).
8. Open **Orders**, search for Sarah's chilled order and note its trip and vehicle.

**Admin — put the demo driver on that vehicle**

9. Sign in as **Alex Vance** (Admin) → **Users** → edit **Marcus Vance** and set his vehicle to the
   one carrying Sarah's chilled order. This step is only needed because the demo has a single
   driver account; in real use every vehicle has its own driver.

**Loader — load the vehicle (phone size)**

10. Sign in as **Jordan Davis** (Loader). Open **Today's Loads**, choose the delivery date and open
    the trip.
11. Mark each order **✓ Loaded**. For one other order, press **Short** and record a missing quantity.
    Then **Complete Loading**. The shortfall appears for the dispatcher and the store.

**Driver — deliver, including without signal (phone size)**

12. Sign in as **Marcus Vance** (Driver). The dashboard shows the loaded trip. Press **Start Trip**.
13. Press **Offline Mode** under Quick Actions, or use the **No signal mode** switch in the banner.
    This simulates losing signal, and the banner says records are kept on this device.
14. Open the current stop and press **I've Arrived**. Tick the checklist, press **Record Delivery**,
    choose the outcome and press **Continue to Proof of Delivery**. Add a photo and the receiver's
    name. Repeat for the stops before Sarah's. Reload the page: the trip and the unsynced records
    are still there.
15. Press **Online Mode**. The records sync automatically and are marked as recorded offline.
    Optionally report a problem at a stop, for example a closed store.

**Store Manager — track and receive**

16. Sign in as Sarah. **Track Delivery** shows the trip's progress, her stop position, the planned
    and actual arrival, and the delivery lifecycle. Other outlets on the trip are shown by position only.
17. Open **Confirm Receipt** for the delivered order. Count each line. Mark one as short or damaged,
    enter the temperature, tick the confirmation and **Confirm Receipt**. Any discrepancy marks the
    order *Disputed* and raises an issue for dispatch.
18. Optionally use **Report Issue** to report another problem with a photo.

**Dispatcher — follow up**

19. As Kasun, open **Live Deliveries** for the delivery date. You can see:
    - trips on the road and completed;
    - late stops;
    - records synced from offline;
    - open issues.

    Open a trip to see each stop's outcome.
20. In **Reported Issues**, resolve the receipt discrepancy and tick **Close the receipt dispute**.
    The order becomes *Received*. Its full history is on the order's detail page under **Orders**.

## Constraints the planner enforces

Capacity (weight and volume), refrigeration for chilled goods, van-only outlet access, depot match,
one brand and district per trip, at most two trips per vehicle, trip-time budgets (Fresh: 270
minutes from 03:30; Style and Tech: 480 minutes), delivery windows and weekly fuel quotas. See
[docs/architecture.md](docs/architecture.md#planning-and-allocation).

## Departures from the Designathon submission

- **Live GPS map tracking → driver-recorded progress.** The datasets have no GPS feed, so
  Track Delivery and Live Deliveries show progress from the driver's stop records (planned vs actual
  arrival, stops completed) instead of a moving map.
- **Dock sensors and temperature telemetry → manual check.** The store manager enters the product
  temperature when confirming receipt.
- **Static screens.** Routes, Route Details, Delivery History, Fleet Availability and Dispatcher
  Settings still show design mock-ups and are not connected to live data. The walkthrough does not
  depend on them.

## Repository layout

```
backend/            Express API, schema, seed, planning engine (services/planner)
frontend/           React web app (pages/<role>, components, services, offline layer)
docs/               Architecture, data model, AI tool disclosure
docker-compose.yml  Full stack: postgres + API + web app
.env.example        Compose configuration
datasets/           Competition CSVs (not committed — add your copy)
```
