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

**Visual redesign (reference-driven).** The whole UI follows
`references/trashmaps-ui-reference.png.png` — the primary visual source of truth.
Logic, routes, guards, services, and localStorage persistence were not changed;
only presentation. Key conventions:

- **Tokens** live in `frontend/src/index.css` (`@theme`): forest greens
  (`primary` #176B4D, `primary-dark` #194D3C), cream `bg`/`surface`, `sage`
  tints, pastel `tint-*` stat colours, `status-*` marker colours (citizen
  orange, skipped grey), `rounded-card`, `shadow-card/lift/button`. Use these
  utilities instead of raw hex values. Fonts: Fraunces (`font-display`, big
  numbers and wordmark only) and Nunito (body/headings).
- **Layout:** authority = deep-green `Sidebar` (desktop) + `BottomNav` (mobile);
  citizen/public = `TopBar` (+ `BottomNav` on mobile). `AppLayout` picks one.
- **Illustrations** are local SVG React components in
  `components/illustrations/` (LeafMark, GarbageTruck, RecycleBin,
  SceneBackdrop, CitizenReporter, Tree/Cypress/Shrub/Leaf/Sparkle). No emoji or
  external imagery.
- **Map:** still React Leaflet + OSM tiles (softened with a CSS filter in
  `index.css`). Markers: numbered green = stop to collect, orange = citizen
  report, muted grey = skipped, truck tile = depot. The route map frames itself
  with `FitBounds`. Legend sits *under* the map, never over it.
- **Motion:** CSS only (`tm-rise`, `tm-pop`, `tm-press`, progress-bar width
  transition, next-stop marker pulse); all disabled by `prefers-reduced-motion`.
  Keep the animations on `backwards` fill — `both` leaves a stacking context
  that traps fixed modals beneath the mobile nav.
- Shared form styling: `components/forms/fieldStyles.ts`.

**Not yet done:** multilingual UI (the reference's English/हिन्दी/मराठी switch
is deliberately not rendered until it works), real backend authentication
(see below).

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
