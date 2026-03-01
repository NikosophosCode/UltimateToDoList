# UltimateToDoList — Frontend

React 19 + Vite + TailwindCSS v4 frontend for the UltimateToDoList task management application.

## Tech Stack

- **React 19** — UI framework
- **Vite 7** — build tool & dev server
- **TailwindCSS v4** — styling
- **React Router v6** — client-side routing
- **Axios** — HTTP client with JWT interceptors
- **Sonner** — toast notifications
- **@react-oauth/google** — Google OAuth

## Prerequisites

- Node.js ≥ 18
- Backend API running (see [UltimateToDoList-Backend](../UltimateToDoList-Backend))

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values (see below)

# 3. Start dev server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |
| `VITE_FACEBOOK_APP_ID` | Facebook App ID | `1234567890` |
| `VITE_ENABLE_GOOGLE_AUTH` | Enable Google login button | `true` |
| `VITE_ENABLE_FACEBOOK_AUTH` | Enable Facebook login button | `false` |
| `VITE_DEV_MODE` | Enable verbose console logs | `true` |

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview production build locally
```

---

## Deploy — Frontend (Netlify)

### Option A: Netlify CLI / Dashboard (recommended)

1. Push the repo to GitHub.
2. Create a new Netlify site → **Import from Git**.
3. Build settings are auto-detected from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Add environment variables in **Netlify → Site settings → Environment variables**:
   ```
   VITE_API_BASE_URL       = https://your-backend.railway.app/api
   VITE_GOOGLE_CLIENT_ID   = your-google-client-id.apps.googleusercontent.com
   VITE_ENABLE_GOOGLE_AUTH = true
   VITE_ENABLE_FACEBOOK_AUTH = false
   VITE_DEV_MODE           = false
   ```
5. Deploy. SPA routing is handled by `netlify.toml` and `public/_redirects`.

### Option B: Manual deploy via Windsurf

```bash
npm run build
# then use the deploy tool in Windsurf
```

---

## Deploy — Backend (Railway)

The backend is deployed separately. See the backend's `README.md` and `.env.production.example` for full instructions.

**Quick summary:**
1. Create a Railway project, connect the backend repo.
2. Add a **Neon PostgreSQL** (or Railway PostgreSQL) database.
3. Set all env vars from `.env.production.example` in Railway dashboard.
4. Railway auto-deploys on push using `railway.toml` (`npm run start:migrate`).

**Required backend env vars (minimum):**
```
DATABASE_URL          = postgresql://...
JWT_ACCESS_SECRET     = <64-char random hex>
JWT_REFRESH_SECRET    = <64-char random hex>
JWT_RESET_SECRET      = <64-char random hex>
ENCRYPTION_KEY        = <32-byte hex>
GOOGLE_CLIENT_ID      = your-google-client-id
GOOGLE_CLIENT_SECRET  = your-google-client-secret
FRONTEND_URL          = https://your-frontend.netlify.app
NODE_ENV              = production
```

### After both are deployed

1. Update `VITE_API_BASE_URL` in Netlify to your Railway backend URL.
2. Add your Netlify frontend URL to Google Cloud Console → OAuth → Authorized JavaScript origins.
3. Add your Railway backend URL to Google Cloud Console → OAuth → Authorized redirect URIs:
   `https://your-backend.railway.app/api/auth/google/callback`

---

## Project Structure

```
src/
├── api/          # Axios client + API service modules
├── components/   # Reusable UI components
│   ├── auth/     # Login, register, OAuth buttons
│   ├── common/   # LoadingSpinner, etc.
│   └── profile/  # Avatar, profile info components
├── config/       # constants.js, facebookSDK.js
├── context/      # AuthContext (JWT + OAuth state)
├── hooks/        # useTasks, useAuth
├── pages/        # HomePage, CalendarPage, ProfilePage, etc.
└── utils/        # errorHandler, tokenStorage, dateUtils
```
