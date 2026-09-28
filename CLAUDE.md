# CLAUDE.md

Guidance for AI agents (and human contributors) working in this repo. See also
[`BACKEND_HANDOFF.md`](./BACKEND_HANDOFF.md) and [`API_CONTRACT.md`](./API_CONTRACT.md)
for the broader backend handoff.

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
