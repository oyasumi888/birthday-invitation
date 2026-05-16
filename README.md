# Birthday Invitation & RSVP

Full-stack invite page with public RSVP and a JWT-protected admin dashboard (guest list, stats, status updates). Stack: **React + Vite + TypeScript**, **Express + TypeScript**, **PostgreSQL**, **Tailwind CSS**, **Framer Motion**.

## Prerequisites

- Node.js 20+ recommended  
- PostgreSQL 13+ (uses `pgcrypto` / `gen_random_uuid`; trigger syntax uses `EXECUTE PROCEDURE` — supported on common Postgres builds)

## Database setup

1. Create a database, e.g. `birthday_db`.
2. Copy environment files:
   - `backend/.env.example` → `backend/.env`
   - `frontend/.env.example` → `frontend/.env`
3. Set `DATABASE_URL` in `backend/.env`.
4. Run the migration:

```bash
psql "%DATABASE_URL%" -f backend/src/db/migrations/001_create_guests.sql
```

On macOS/Linux with a connection URL:

```bash
psql "$DATABASE_URL" -f backend/src/db/migrations/001_create_guests.sql
```

Or open the SQL file in your SQL client and execute it against `birthday_db`.

## Admin password (bcrypt hash)

`ADMIN_PASSWORD` must be a **bcrypt hash**, not plain text. From the `backend` folder after `npm install`:

```bash
node -e "import('bcryptjs').then(b=>b.hash('your-password',10).then(console.log))"
```

Paste the printed hash into `backend/.env` as `ADMIN_PASSWORD`. Set `ADMIN_USERNAME` as desired.

Generate a strong random `JWT_SECRET` (any long random string).

## Run locally

Terminal 1 — API (default port **3000**):

```bash
cd backend
npm install
npm run dev
```

Terminal 2 — frontend (Vite dev server):

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL=http://localhost:3000` in `frontend/.env`.

Optional: set `FRONTEND_URL` in `backend/.env` during development so CORS allows only your SPA origin(s). Use a comma-separated list if you need more than one origin (for example `http://localhost:5173`). If unset, the API allows any origin for simpler local setups.

### Smoke test checklist

- Submit RSVP on `/` (going / not going, validation errors).
- Open `/admin/login`, sign in, confirm redirect to `/admin`.
- Stats cards and guest list load; filter and search behave as expected.
- Change guest status and delete a row; counts update (also wait ~30s for auto-refresh).
- Call admin endpoints without `Authorization` → JSON `{ error, message }` with 401.

## API overview

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/rsvp` | Public |
| GET | `/api/rsvp` | Bearer JWT |
| PATCH | `/api/rsvp/:id` | Bearer JWT |
| DELETE | `/api/rsvp/:id` | Bearer JWT |
| GET | `/api/rsvp/stats` | Bearer JWT |
| POST | `/api/auth/login` | Public |

Errors use: `{ "error": string, "message": string }`.

## Production deploy (outline)

1. **PostgreSQL**: managed instance (Neon, RDS, etc.). Run the same migration SQL.
2. **Backend**: set `PORT`, `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `FRONTEND_URL` (your SPA origin). Build with `npm run build`, run `npm start` behind HTTPS (Railway, Render, Fly.io, VPS + reverse proxy).
3. **Frontend**: build with production `VITE_API_URL` pointing at your public API URL (`npm run build`). Host `frontend/dist` on Netlify, Vercel, Cloudflare Pages, or serve as static files from the same reverse proxy.
4. Ensure CORS: `FRONTEND_URL` matches the deployed SPA origin exactly.

## Project layout

- [`backend/src`](backend/src) — Express app, routes, controllers, JWT middleware, DB pool.
- [`frontend/src`](frontend/src) — Pages (`InvitationPage`, `LoginPage`, `AdminPage`), RSVP UI, admin dashboard with 30s polling.
