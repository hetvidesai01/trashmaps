# CLAUDE.md

Guidance for AI agents (and human contributors) working in this repo. See also
[`BACKEND_HANDOFF.md`](./BACKEND_HANDOFF.md) and [`API_CONTRACT.md`](./API_CONTRACT.md)
for the broader backend handoff.

## Frontend revision status

The frontend is being revised in phases on top of the original mock-data build
(see `BACKEND_HANDOFF.md` for that original scope). Completed so far:

**Phase 1 — Login + role-based experience.** TrashMaps now has two roles,
AUTHORITY (operational waste-collection staff) and CITIZEN (residents), with
separate navigation and route access:

- `/login` — role-choice screen splitting into a **Citizen Login** form
  (email/mobile + password) and an **Authority Login** form (Authority ID +
  password, with a "restricted to verified waste-management personnel"
  notice). Each form has a "Use Demo <Role> Account" button for prototype
  access; real credential submission is still mock/no-op.
- `frontend/src/auth/` — `AuthContext` (`user`, `role`, `isAuthenticated`,
  `login()`, `logout()`) backed by `authStorage.ts`, which persists the
  chosen role to `localStorage` so a refresh keeps the session. `roleHome.ts`
  maps each role to its default landing route.
- `frontend/src/components/auth/` — `RequireAuth` (redirects unauthenticated
  visitors to `/login`) and `RequireRole` (redirects a signed-in user of the
  wrong role to their own home page) route guards, composed in `App.tsx`.
- AUTHORITY can reach `/dashboard`, `/routes`, `/citizen-reports` (new page,
  reuses the existing `PendingReportCard`/`ReportReviewModal`/report
  services), and `/map` (kept functional but demoted to secondary nav).
  CITIZEN can reach `/report` and `/my-reports`. `/` (Home) stays public.
- Dashboard, Routes, WasteMap, Home, ReportWaste, MyReports, and all map/route
  optimization logic were left untouched — this phase only added the auth
  shell and role-based navigation around the existing app.

**Not yet done:** map UX redesign, multilingual UI, real backend
authentication (see below).

## Authentication

The current frontend (`frontend/src/auth/`, `frontend/src/pages/Login/`) implements
**prototype authentication only** — a role is chosen client-side and stored in
`localStorage`. There is no backend, no real credential check, and no session
token. This exists purely to demo the authority vs. citizen experiences.

### PRODUCTION AUTH MODEL

- Authority access will eventually use pre-approved authority accounts stored
  in the backend/database.
- Authority accounts will contain an authority identifier and verification
  status.
- Selecting a role in the frontend must never grant production permissions.
- The backend will authenticate the user and determine their role.
- Authority-only API endpoints must enforce authorization server-side.
- Citizen accounts receive citizen permissions only.
- The current demo authority/citizen access is strictly prototype
  functionality.

When real authentication is implemented, the frontend's role selection UI
becomes purely cosmetic (routing the user to the right login form) — it must
not be trusted as an authorization decision. Every authority-only endpoint
needs its own server-side check of the authenticated user's verified role.
