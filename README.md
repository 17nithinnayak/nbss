# NBSS Community Website

A member directory for the NBSS community with two roles:
- **Super admin** (National Chairman / President): add, edit, delete members
- **Member**: log in and view the directory + their own profile

## Structure

```
nbss/
├── backend/    FastAPI + PostgreSQL + JWT auth
└── frontend/   React + Vite + Tailwind
```

---

## 1. Backend — local setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env      # then edit .env with real values
```

For local dev, the simplest is to leave `DATABASE_URL` pointing at SQLite
(`sqlite:///./dev.db`) — just note that's ONLY for local dev, not for
Render's free tier (see deployment section below on why).

Create the first super admin (the National Chairman/President account —
everyone else gets added through the admin panel after this):

```bash
python seed.py
```

This reads `NBSS_ADMIN_EMAIL` / `NBSS_ADMIN_PASSWORD` / `NBSS_ADMIN_NAME`
from your `.env` (or falls back to `admin@nbss.org` / `changeme123`).
**Change this password immediately after first login**, via the "My
account" page.

Run the API:

```bash
uvicorn app.main:app --reload
```

Visit `http://localhost:8000/docs` for interactive API docs.

---

## 2. Frontend — local setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL should point at your backend
npm run dev
```

Visit `http://localhost:5173`.

---

## 3. Deployment

### Database — Neon (free Postgres)
1. Create a project at neon.tech (or Supabase, same idea).
2. Copy the connection string it gives you — that's your `DATABASE_URL`.

Why not SQLite on Render? Render's free web service filesystem is
**ephemeral** — it resets on every redeploy or restart, silently wiping
a SQLite file. Postgres lives independently, so your member data survives
deploys.

### Backend — Render
1. Push this repo to GitHub.
2. In Render: New → Web Service → connect the repo, root directory `backend`.
   (Render will detect `render.yaml` automatically if you use the Blueprint
   flow — otherwise set these manually:)
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables in the Render dashboard:
   - `DATABASE_URL` — your Neon connection string
   - `SECRET_KEY` — generate with `python -c "import secrets; print(secrets.token_hex(32))"`
   - `CORS_ORIGINS` — your Vercel URL, added after step below (comma-separated if more than one)
4. Once deployed, run the seed script once (Render Shell tab, or run
   locally pointed at the same `DATABASE_URL`) to create the first super admin.

### Frontend — Vercel
1. New Project → import the same repo → set root directory to `frontend`.
2. Environment variable: `VITE_API_URL` = your Render backend URL (e.g. `https://nbss-backend.onrender.com`).
3. Deploy. Then go back to Render and set `CORS_ORIGINS` to this Vercel URL,
   and redeploy the backend so it accepts requests from it.

---

## Notes on customization

- **Colors/fonts**: everything routes through CSS variables in
  `frontend/src/index.css` (`--color-brand`, `--font-display`, etc.) —
  swap those once you have the real NBSS brand palette and it re-themes
  the whole site.
- **Photos**: `photo_url` on each member is just an image URL. Easiest
  path for now is hosting images somewhere (e.g. a public Google Drive
  link, Cloudinary, or an S3 bucket) and pasting the URL in the admin
  form. If you'd rather upload photos directly through the admin panel,
  that's a small additional feature (file upload + storage) — say the
  word and I'll add it.
