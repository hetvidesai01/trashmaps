# TrashMaps — Backend Handoff

This document briefs a backend developer picking up TrashMaps after the
frontend was built through mock data. Read this first, then
[`API_CONTRACT.md`](./API_CONTRACT.md) for the endpoint-by-endpoint detail.

## What TrashMaps does

TrashMaps dynamically optimizes the **existing** waste-collection routes a
municipality already runs — it does not invent new routes from scratch. The
core loop, on every page in the app, is:

```
Existing route
→ identify collection points that actually require pickup today
→ skip the ones that don't
→ fold in verified citizen-reported points
→ send that active set to the route optimizer
→ return an optimized stop order
→ mark stops collected as the vehicle works through them
→ recalculate the remaining route as needed
```

Citizen waste reporting is a **secondary, supporting** feature — it feeds new
candidate points into the pipeline above; it does not replace or run
parallel to it. A citizen report is never, on its own, a route stop.

## Frontend entities

Four core types, all defined in `frontend/src/types/`:

- **`CollectionPoint`** (`types/collection.ts`) — the primary entity. A
  location on (or added to) today's collection run, with its own status,
  whether it currently needs a visit, and where it came from.
- **`CitizenReport`** (`types/report.ts`) — a citizen's submission. Entirely
  separate from `CollectionPoint`; see "Citizen Report Flow" below for how
  the two connect.
- **`CollectionRoute`** (`types/route.ts`) — one vehicle's route for the day:
  depot, its predefined stops, its currently-active stops, and (once
  generated) its optimized stops and stats.
- **`DashboardStats`** (`types/dashboard.ts`) — the 5 summary numbers on the
  Operations Dashboard.

Read the actual `.ts` files for exact fields — this doc won't restate them,
`API_CONTRACT.md` already does with full JSON examples.

## Required APIs

Full detail, request/response shapes, and example JSON are in
[`API_CONTRACT.md`](./API_CONTRACT.md). Summary of the 11 endpoints it
covers:

| Endpoint | Purpose |
|---|---|
| `GET /api/collection-points` | every point for today |
| `GET /api/collection-points/:id` | one point's detail |
| `PATCH /api/collection-points/:id/status` | mark a point pending/skipped/collected |
| `GET /api/routes` | every route |
| `GET /api/routes/existing/:routeId` | one route's current state |
| `GET /api/routes/current` | the route furthest along today |
| `POST /api/routes/optimize` | **the flagship call** — see below |
| `POST /api/citizen-reports` | citizen submits a report |
| `GET /api/citizen-reports/mine` | a citizen's own reports |
| `PATCH /api/citizen-reports/:id/verify` | authority approves/rejects a report |
| `GET /api/dashboard/summary` | the 5 dashboard stat counts |
| `GET /api/dashboard/activity` | recent-activity feed |

## Most important backend logic

This is the one rule the whole app is built around — get this right and
everything else follows:

```
ACTIVE COLLECTION SET =
  existing route points where requiresCollection = true AND status !== 'collected'
  +
  verified citizen-added CollectionPoints requiring collection
```

**Only this set is ever sent to route optimization.** Skipped points
(`requiresCollection: false`) and already-collected points never appear in
it. A `CitizenReport` that hasn't been approved yet contributes nothing to
this set — it doesn't exist as a `CollectionPoint` at all until an authority
verifies it.

In the current mock, this set isn't a stored field — it's recomputed on
every read from live `CollectionPoint` state (see the note under
`GET /api/routes/existing/:routeId` in the contract). Whatever your backend
architecture, replicate that behavior: a point that changes status or a
newly-approved citizen point must be reflected the next time a route is
fetched, with no separate "attach to route" step required.

## Citizen Report Flow

```
CitizenReport created         → status: pending_verification
      ↓ authority approves
CitizenReport updated         → status: verified_active
      ↓ (same action, separate record)
new CollectionPoint created   → source: 'citizen', linkedReportId: <report.id>
      ↓
eligible for the active collection set → route optimization
```

**`CitizenReport` and `CollectionPoint` must remain separate entities.**
Approving a report does not convert the report object into a point — it
creates a brand-new `CollectionPoint` record that merely references the
report via `linkedReportId`. Nothing reads the relationship in the other
direction; a `CollectionPoint` never needs to know it came from a report
except to look up that one field.

A rejected report (`status: rejected`) is kept for history, never deleted,
and never produces a `CollectionPoint`.

`included_in_route` and `resolved` are further lifecycle stages the frontend
already renders (see `constants/status.ts` and `ReportLifecycle.tsx`) but no
current UI action transitions a report into them — that logic (a report's
point being included in a generated optimized route, or the underlying issue
being resolved) is a reasonable next piece of backend business logic to add,
not something the frontend already implements.

## Route Optimization

The frontend currently uses a **mock** optimizer
(`frontend/src/services/mock/routeOptimizer.ts`). It does not compute a real
route — it reverses the input point array and fabricates distance/time
numbers from stop count alone, with zero geography involved. This was
deliberate: no optimization logic exists anywhere in the frontend, so a real
solver can be dropped in entirely behind `POST /api/routes/optimize` with no
frontend changes.

The backend should accept the active collection point IDs for a route and
return an ordered optimized stop sequence plus distance/time stats, per the
shape documented in `API_CONTRACT.md`. This doc deliberately does not
prescribe an algorithm (nearest-neighbor, real TSP/VRP solver, a third-party
routing API, etc.) — that choice belongs to whoever implements it.

## Frontend Integration

Every page talks to a service **facade**, never to mock data or a backend
URL directly:

```
Page/component
  → services/api/*.ts   (the facade — what this doc/contract describes)
      → services/mock/*.ts   (today's implementation: in-memory + localStorage)
```

To integrate a real backend, replace the body of each function in
`frontend/src/services/api/*.ts` with a real `fetch()`/HTTP client call
against `import.meta.env.VITE_API_BASE_URL` (already wired in
`services/api/config.ts`, currently unused). Function signatures — what each
one takes and returns — should not need to change; every page already
depends only on those signatures, never on `services/mock/` internals.

One deliberate exception: `resetDemoData()`
(`services/mock/storage.ts`, wired into a small button in the Navbar) has no
real-backend equivalent — it exists purely so a faculty/demo audience can
replay the workflow from a clean slate. It's fine to delete this along with
the rest of the mock layer once a real backend exists; nothing else depends
on it.

## Demo Data

Full datasets live in `frontend/src/services/mock/` — don't duplicate them
here, but for orientation, the seed data currently includes:

- **10 `CollectionPoint`s** across 3 predefined routes in Mumbai (Bandra,
  Khar/Santacruz, Vile Parle/Juhu wards) — 8 route-sourced, 2 already
  citizen-sourced (demonstrating a report that's already been approved).
- **6 `CitizenReport`s** deliberately covering every lifecycle stage:
  2 `verified_active`, 1 `pending_verification`, 1 `included_in_route`,
  1 `resolved`, 1 `rejected`.
- **3 `CollectionRoute`s**, one per ward, each with a depot, an assigned
  vehicle, and a static "original" distance/time representing the
  predefined route before optimization.

All of it persists to `localStorage` across a page refresh (submitted
reports, approvals, newly-created points) so a demo session survives a
reload; "Reset demo data" in the Navbar clears it back to this seed state.

## Integration Checklist

1. Backend running and reachable.
2. Set `VITE_API_BASE_URL` in `frontend/.env` (copy from `.env.example`).
3. Swap each `services/api/*.ts` function body from mock to a real HTTP call, one file at a time.
4. Test collection points — list, single fetch, status update.
5. Test citizen reports — submit, list.
6. Test verification — approve creates a linked `CollectionPoint`; reject does not.
7. Test optimization — active set in, ordered stops + stats out.
8. Test collection status — marking a stop collected updates it everywhere (Dashboard, Waste Map, Routes all read the same point).
9. Test dashboard — summary counts and activity feed match live data.
10. Test the full workflow end to end: submit a report → approve it → see it on the Waste Map → see it in a route's active set → optimize → mark collected → recalculate.
