# TrashMaps API Contract

This documents the API surface the TrashMaps frontend expects. It's derived
directly from the frontend that actually exists (`frontend/src/services/api/`
and `frontend/src/types/`) — every field below is either read or written by
the current UI. Nothing here is aspirational beyond what's noted.

Today, every one of these is backed by an in-memory mock (see
`frontend/src/services/mock/`), persisted to `localStorage` so a page refresh
doesn't lose demo data. This document describes what a real backend should
implement to become a drop-in replacement — only the function bodies inside
`frontend/src/services/api/*.ts` would need to change; no page or component
should need to change.

## Conventions

- All timestamps are ISO 8601 strings (e.g. `"2026-09-27T09:40:00+05:30"`).
- All coordinates are plain `latitude`/`longitude` numbers (WGS84).
- Distances are kilometers, times are minutes — both plain numbers, no units
  in the field name or value.
- Responses below are the JSON **body** shape. Wrapping envelopes
  (`{ data, error }`, pagination metadata, etc.) are not assumed by the
  frontend and would need a corresponding change to the `services/api/*`
  functions if introduced.
- IDs are opaque strings. The mock layer generates human-readable ones
  (`CP-101`, `CR-501`, `RT-01`) for demo legibility; the backend is free to
  use any string ID.

## Core types

```ts
type CollectionStatus = 'pending' | 'skipped' | 'collected'
type PointSource = 'route' | 'citizen'

interface CollectionPoint {
  id: string
  address: string
  latitude: number
  longitude: number
  existingRouteId: string | null   // null for citizen-sourced points
  requiresCollection: boolean
  status: CollectionStatus
  lastCollected: string | null     // ISO timestamp, or null if never collected
  source: PointSource
  linkedReportId: string | null    // CitizenReport.id, set only when source === 'citizen'
}

type ReportStatus =
  | 'pending_verification'
  | 'verified_active'
  | 'included_in_route'
  | 'resolved'
  | 'rejected'

type ReportSeverity = 'low' | 'medium' | 'high'

interface CitizenReport {
  id: string
  address: string
  latitude: number
  longitude: number
  category: string          // free-text, e.g. "Overflowing bin", "Illegal dumping"
  description: string
  imageUrl: string | null   // see note under POST /api/citizen-reports
  severity: ReportSeverity
  status: ReportStatus
  reportedAt: string
  reportedBy: string
}

interface Depot {
  name: string
  latitude: number
  longitude: number
}

interface CollectionRoute {
  routeId: string
  name: string
  vehicle: string
  depot: Depot
  originalStops: CollectionPoint[]        // the predefined route, unaffected by today's status
  activeStops: CollectionPoint[]          // originalStops needing collection + verified citizen points assigned to this route
  optimizedStops: CollectionPoint[] | null // null until an optimization has been generated
  originalDistance: number                // static distance of the predefined route
  originalEstimatedTime: number           // static time of the predefined route
  totalDistance: number | null            // optimized distance, null until generated
  estimatedTime: number | null            // optimized time, null until generated
  distanceSaved: number | null
  timeSaved: number | null
  collectionProgress: number              // 0–1
  generatedAt: string | null              // when optimizedStops was last generated
}

interface DashboardStats {
  pointsOnRouteToday: number
  requiringCollection: number
  skipped: number
  citizenAdded: number
  collectedToday: number
}
```

A note on naming: a few frontend function names differ from the illustrative
names in the original brief (e.g. `getCitizenReports()` instead of
`getMyReports()`, `approveReport()`/`rejectReport()` instead of a single
`verifyCitizenReport()`). Each endpoint section below states the frontend
function it maps to. These are deliberate — the existing types and functions
already work end-to-end, and renaming them purely for contract-naming
symmetry would be unnecessary churn.

---

## `GET /api/collection-points`

**Purpose**: the full set of collection points for today — predefined route
stops plus any verified citizen-sourced points. This is the single source of
truth the Dashboard, Waste Map, and Routes pages all read from.

**Frontend function**: `getCollectionPoints()` in `services/api/collectionPoints.ts`

**Request**: no body. Optional query params the frontend doesn't currently
send but a backend may want to support for scale: `source`, `status`,
`existingRouteId`.

**Response** `200 OK`

```json
[
  {
    "id": "CP-101",
    "address": "Linking Road, Bandra West",
    "latitude": 19.0596,
    "longitude": 72.8302,
    "existingRouteId": "RT-01",
    "requiresCollection": true,
    "status": "pending",
    "lastCollected": "2026-09-24T07:10:00+05:30",
    "source": "route",
    "linkedReportId": null
  }
]
```

**Type**: `CollectionPoint[]`

**Errors**: `500` on server failure. No auth-related errors — this is a
read-only public endpoint in the current frontend (no login exists yet).

---

## `GET /api/collection-points/:id`

**Purpose**: a single point's detail, e.g. for a direct link or a detail
panel that doesn't already have the full list loaded.

**Frontend function**: `getCollectionPoint(id)` in `services/api/collectionPoints.ts`

**Request**: `id` as a path parameter.

**Response** `200 OK`: a single `CollectionPoint` (see shape above).

**Response** `404 Not Found`: when `id` doesn't exist. The frontend function
currently returns `null` in this case rather than throwing — a real client
would treat a 404 the same way.

---

## `PATCH /api/collection-points/:id/status`

**Purpose**: mark a point collected/skipped/pending — used when an operator
marks a stop collected on the Routes page.

**Frontend function**: `updateCollectionPointStatus(id, status)` in `services/api/collectionPoints.ts`

**Request body**

```json
{ "status": "collected" }
```

**Response** `200 OK`: the updated `CollectionPoint`. The frontend also
expects `requiresCollection` and `lastCollected` to be derived server-side
from the new status (`requiresCollection: status === 'pending'`,
`lastCollected` set to "now" when `status === 'collected'`) — the mock does
exactly this so the backend should match it.

**Errors**: `404` if `id` doesn't exist, `400` if `status` isn't one of
`pending | skipped | collected`.

---

## `GET /api/routes`

**Purpose**: every route, today. Used by the Routes page (to populate the
route selector) and the Waste Map (to draw every depot and original-route
line at once, not just one featured route).

**Frontend function**: `getCollectionRoutes()` in `services/api/routes.ts`

**Response** `200 OK`: `CollectionRoute[]` — same shape as the single-route
endpoints below, one entry per route.

---

## `GET /api/routes/existing/:routeId`

**Purpose**: a single route's current state (used by the Routes page when a
specific route is selected).

**Frontend function**: `getExistingRoute(routeId)` in `services/api/routes.ts`

**Response** `200 OK`: a single `CollectionRoute`. `404` if `routeId` doesn't
exist (the frontend function returns `null` in that case).

**Note on `activeStops`**: this is the part most likely to differ from a
naive backend implementation. `activeStops` is **not** a stored field — the
frontend rebuilds it on every read from current `CollectionPoint` state:
`originalStops` where `requiresCollection === true`, plus any verified
citizen point whose nearest depot is this route's. The backend should
compute it the same way (or an equivalent server-side rule) rather than
persisting a stale array, so a newly-approved citizen point is picked up
immediately without a separate "attach point to route" step.

---

## `GET /api/routes/current`

**Purpose**: whichever route the Dashboard should feature as "today's active
run" — currently defined as the route with the highest `collectionProgress`.

**Frontend function**: `getCurrentRoute()` in `services/api/routes.ts`

**Response** `200 OK`: a single `CollectionRoute`, same shape as above.

---

## `POST /api/routes/optimize`

**Purpose**: the core flagship call. Given a route's active collection
points, return an optimized visiting order plus distance/time stats. See
the dedicated section below for the full contract — it's covered separately
because it needed the most adaptation from the original illustrative shape.

---

## `POST /api/citizen-reports`

**Purpose**: a citizen submits a new waste report.

**Frontend function**: `submitReport(input)` in `services/api/citizenReports.ts`
(illustrative name in the original brief: `submitCitizenReport`)

**Request body** — `SubmitReportInput`:

```json
{
  "address": "Behind Bandra Bus Depot",
  "latitude": 19.057,
  "longitude": 72.831,
  "category": "Overflowing bin",
  "severity": "high",
  "description": "Overflowing bin near the depot gate, uncollected for 3 days.",
  "imageUrl": null
}
```

**Response** `201 Created`: the new `CitizenReport`, with `status` forced to
`"pending_verification"`, `id` generated server-side, `reportedAt` set to
now, and `reportedBy` set from the authenticated user (no auth exists yet —
the mock hardcodes `"You"`).

**Errors**: `400` for missing required fields (`address`, `category`,
`description` — mirrors the frontend's own client-side validation).

**Image handling note**: the current frontend never uploads the photo file
anywhere — `imageUrl` is a browser-local `blob:` object URL, valid only for
that tab's session. A real backend needs an actual upload step (e.g. a
pre-signed URL flow) that the frontend doesn't yet implement; `imageUrl` in
the request/response should become a persisted, durable URL once that exists.

---

## `GET /api/citizen-reports/mine`

**Purpose**: a citizen's own submitted reports and their current status.

**Frontend function**: `getCitizenReports()` in `services/api/citizenReports.ts`
(illustrative name in the original brief: `getMyReports`)

**Response** `200 OK`: `CitizenReport[]`.

**Note**: there is no authentication in the current frontend, so today this
returns *all* reports, not a filtered-by-user set. Once auth exists, this
endpoint should filter by the authenticated user and the frontend function
name/behavior won't need to change — only the backend's filtering logic.

---

## `PATCH /api/citizen-reports/:id/verify`

**Purpose**: an authority approves or rejects a pending report.

**Frontend functions**: `approveReport(id)` and `rejectReport(id)` in
`services/api/citizenReports.ts` (illustrative name in the original brief: a
single `verifyCitizenReport(id)`). The frontend's two-button Approve/Reject
UI maps naturally onto one endpoint with a decision field:

**Request body**

```json
{ "decision": "approved" }
```
or
```json
{ "decision": "rejected" }
```

**Response on approval** `200 OK`:

```json
{
  "report": { "...": "updated CitizenReport, status: verified_active" },
  "point": { "...": "new CollectionPoint, source: citizen, linkedReportId: <report.id>" }
}
```

**Type**: `{ report: CitizenReport; point: CollectionPoint }`
(`ApproveReportResult` in `services/api/citizenReports.ts`)

**Response on rejection** `200 OK`: the updated `CitizenReport` alone
(`status: "rejected"`), no `CollectionPoint` is created.

**Important**: a report and its linked `CollectionPoint` are always two
separate records — approval never converts the report object into a point.
The point only ever references the report via `linkedReportId`, never the
reverse. A rejected report is never deleted; it's kept for history.

**Errors**: `404` if `id` doesn't exist, `409` if the report isn't currently
`pending_verification` (already reviewed).

---

## `GET /api/dashboard/summary`

**Purpose**: the 5 headline numbers on the Operations Dashboard.

**Frontend function**: `getDashboardStats()` in `services/api/dashboard.ts`
(illustrative name in the original brief: `getDashboardSummary`)

**Response** `200 OK`: a `DashboardStats` object (shape above). All 5 fields
are simple counts over the current `CollectionPoint` set — no separate
aggregation table is implied; a backend can compute these with a `GROUP BY`
over the same points table `GET /api/collection-points` reads from.

---

## `GET /api/dashboard/activity`

**Purpose**: the "Recent activity" feed on the Operations Dashboard —
plain-language log lines like "SV Road, Khar West marked as collected".

**Frontend function**: `getRecentActivity()` in `services/api/activity.ts`

**Response** `200 OK`, sorted newest first:

```json
[
  {
    "id": "AC-1",
    "type": "report-verified",
    "message": "Citizen report CR-502 verified and added to the active set at Vakola Bridge Footpath",
    "timestamp": "2026-09-27T08:30:00+05:30",
    "pointId": "CP-110"
  }
]
```

**Type**

```ts
type ActivityEventType = 'collected' | 'skipped' | 'requires-collection' | 'report-verified'

interface ActivityEvent {
  id: string
  type: ActivityEventType
  message: string
  timestamp: string
  pointId: string | null
}
```

**Note**: today this is static demo data (`services/mock/activity.ts`) — it
is **not** regenerated when a point's status actually changes elsewhere in
the app (e.g. marking a stop collected on Routes does not append a new
activity entry). A real backend should treat this as an actual event log,
appending an entry whenever a `CollectionPoint` status changes or a report
is verified, so the feed reflects real activity rather than a fixed demo
script.

---

# `POST /api/routes/optimize` — detailed contract

This is the flagship call, so it gets its own section.

**Frontend function**: `optimizeRoute(route, activeStops)` in `services/api/routes.ts`

## Request

The original brief's illustrative shape was:

```json
{ "routeId": "RT-01", "depot": { "...": "..." }, "activeCollectionPointIds": ["CP-101", "CP-109"] }
```

This is what the frontend conceptually sends — a route reference, its depot,
and the set of point IDs to optimize. The current frontend function actually
passes the richer objects it already has in memory (`route: CollectionRoute`,
`activeStops: CollectionPoint[]`) rather than re-fetching by ID, since it's
talking to an in-memory mock, not a network endpoint. Over HTTP, the request
should be the ID-based shape above — the backend re-derives depot and stop
details from `routeId` server-side rather than trusting a client-supplied
depot object:

```json
{
  "routeId": "RT-01",
  "activeCollectionPointIds": ["CP-101", "CP-103", "CP-109"]
}
```

`activeCollectionPointIds` is exactly `route.activeStops` filtered to
`status !== 'collected'` — i.e., the *remaining* active set. This is what
"Recalculate remaining route" sends after some stops are already collected;
the frontend never asks the backend to re-include already-collected stops.

## Response

The original brief's illustrative response shape was:

```json
{
  "routeId": "...",
  "originalStops": [...],
  "activeStops": [...],
  "optimizedStops": [...],
  "originalDistance": 0,
  "optimizedDistance": 0,
  "originalEstimatedTime": 0,
  "optimizedEstimatedTime": 0,
  "distanceSaved": 0,
  "timeSaved": 0,
  "skippedStops": [...]
}
```

The actual frontend type (`RouteOptimizationResult`) is narrower, because
`originalStops`, `activeStops`, `originalDistance`, `originalEstimatedTime`,
and `skippedStops` are all already known to the frontend before optimization
runs — they live on the `CollectionRoute` object fetched via
`GET /api/routes/existing/:routeId` and don't change as a result of
optimizing. Re-sending them on every optimize call would be redundant.
`skippedStops` specifically is just `originalStops.filter(p =>
!p.requiresCollection)` — a client-side derivation, not something the
optimizer needs to compute or return.

```json
{
  "optimizedStops": [
    { "...": "CollectionPoint, in visiting order" }
  ],
  "totalDistance": 12.1,
  "estimatedTime": 43,
  "distanceSaved": 6.3,
  "timeSaved": 19,
  "generatedAt": "2026-09-27T10:05:00+05:30"
}
```

**Type**: `RouteOptimizationResult`

```ts
interface RouteOptimizationResult {
  optimizedStops: CollectionPoint[]
  totalDistance: number
  estimatedTime: number
  distanceSaved: number
  timeSaved: number
  generatedAt: string
}
```

`distanceSaved`/`timeSaved` are `route.originalDistance - totalDistance` and
`route.originalEstimatedTime - estimatedTime` respectively — the frontend
computes these once, in the service layer, and never recomputes them
independently in any component. A real backend should return them
pre-computed the same way so the frontend doesn't need to.

**Errors**

- `400` if `activeCollectionPointIds` is empty or contains unknown IDs.
- `404` if `routeId` doesn't exist.
- `500`/`503` if the optimizer itself fails — the frontend already handles
  this: `Routes.tsx` wraps the call in a try/catch and shows "Optimization
  failed. Please try again." without losing any existing state.

**What the mock does NOT do, and the real backend must**: the current mock
optimizer (`services/mock/routeOptimizer.ts`) does not compute a real route.
It reverses the input array and fabricates `totalDistance`/`estimatedTime`
from stop count alone (no geography involved at all). This is intentional —
the frontend was built to not contain any optimization logic, precisely so
a real solver can be dropped in behind this one endpoint with zero frontend
changes.
