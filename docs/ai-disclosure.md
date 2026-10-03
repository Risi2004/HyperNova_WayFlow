# AI Tool Disclosure

This document explains which parts of WayFlow were AI-assisted, which were not, and how the tools
were used.

## Tools used

| Tool | Used for |
| --- | --- |
| Claude Code (Anthropic) | Code generation and refactoring, debugging, test runs, documentation drafts |

## Work done by the team without AI generation

- The Designathon submission (personas, screen flows, degradation screens) and the visual design of
  every screen; the React screens and components of the web app were built from that design.
- Product decisions: which roles see which data, the order and planning workflow, how deferrals
  and receipt discrepancies are handled, and what to prioritise for the demo.
- Authentication and account management: login, JWT sessions, Admin user and product management,
  account e-mails.
- Project setup: repository, Express server bootstrap, Neon database, Vercel and Render deployment,
  and importing the competition datasets.
- First versions of the Store Manager receipt / issue / tracking screens and the Dispatcher live and
  deferred-orders screens.
- Review and acceptance of every AI-generated change, and manual testing of each role's flow.

## AI-assisted work

Claude Code was used as a pair programmer inside the repository. The team described each step and
its constraints; the assistant proposed and wrote code, ran it, and reported results, and the team
reviewed and approved the changes before committing.

- **Backend business logic:** order lifecycle state machine and audit trail, 4 PM cutoff rules,
  order intake, temperature split of orders, deferral reasons.
- **Planning and allocation engine:** the constraint checks and greedy allocation in
  `services/planner`, manual moves with validation, publishing and deferral, and the peak-day
  scenario generator.
- **Loader and driver APIs and screens wiring:** loading verification and shortfalls, trip start,
  arrival, proof of delivery, problem reports.
- **Offline operation:** IndexedDB cache and outbox, idempotent replay with `client_event_id`,
  the service worker, and the "No signal mode" switch.
- **Connecting UI screens to real data:** replacing mock data in existing screens with API data,
  and fixing bugs found in review (for example receipt confirmation overwriting delivery outcomes,
  issue reports failing to save, and mock fallbacks shown as success).
- **Delivery tooling and documentation:** Docker Compose setup, `demo.js`, this `docs` folder and
  the README, which the team reviewed.

## How the output was checked

- An independent feasibility checker re-validated every published plan against the constraints
  (capacity, temperature, access, windows, trip budgets, fuel).
- Scripted API runs exercised the full flow across all four roles on a fresh database, including
  offline replay and duplicate submissions.
- Each role's screens were tested in a browser, including phone-sized layouts for the Loader and
  Driver, and the offline/reconnect path for the Driver.
- Lint and production builds were run before each commit.
