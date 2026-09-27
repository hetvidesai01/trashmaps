# TrashMaps

TrashMaps dynamically optimizes existing municipal waste-collection routes:
it identifies which predefined stops actually need a pickup today, skips the
ones that don't, folds in verified citizen-reported points, and sends that
active set to a route optimizer. Citizen waste reporting is a supporting
feature that feeds into this pipeline — it isn't a separate app.

This is the frontend only. It runs entirely on an in-memory mock data layer
(persisted to `localStorage`) — there is no backend yet.

## Stack

React + TypeScript + Vite, Tailwind CSS, React Router, React Leaflet +
OpenStreetMap, Lucide icons.

## Install & run

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run lint     # oxlint
```

Copy `.env.example` to `.env` if you want `VITE_API_BASE_URL` set locally —
it's currently unused, since every request is served by the mock layer.

## Project structure

```
src/
  components/   # common/, layout/, map/, routes/, forms/, reports/ — shared UI
  pages/        # one folder per route (Home, Dashboard, WasteMap, Routes, ReportWaste, MyReports)
  services/
    api/        # the facade every page calls — this is what a real backend replaces
    mock/       # today's implementation of that facade (in-memory + localStorage)
  types/        # CollectionPoint, CitizenReport, CollectionRoute, DashboardStats, ...
  constants/, hooks/, utils/
```

## Backend integration

This app was built for a backend to be dropped in later without frontend
changes. Two documents at the repo root cover that:

- **[`API_CONTRACT.md`](../API_CONTRACT.md)** — the endpoint-by-endpoint
  contract (method, request/response shape, TypeScript types, errors) that
  `services/api/*` currently fulfills with mock data.
- **[`BACKEND_HANDOFF.md`](../BACKEND_HANDOFF.md)** — a briefing for whoever
  implements the backend: what TrashMaps does, the core active-set logic,
  the citizen-report verification flow, and an integration checklist.
