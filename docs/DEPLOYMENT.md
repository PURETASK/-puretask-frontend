# Deployment (Phase 7)

## Build & run locally (production mode)

```bash
npm run build
npm run start
```

- App runs at **http://localhost:3000** (default Next.js port).
- Use this to verify the production build before deploying.

## Hosting (Vercel / Netlify / etc.)

### Build settings

| Setting        | Value        |
|----------------|-------------|
| **Build command** | `npm run build` |
| **Output directory** | `.next` (Next.js default; platform usually auto-detects) |
| **Install command** | `npm ci` or `npm install` |
| **Node version**    | 18.x or 20.x (set in UI or `.nvmrc` / `engines`) |

### Environment variables

Configure in the hosting dashboard. See **docs/ENV_SETUP.md** and **.env.example** for the full list. Minimum for production:

- `NEXT_PUBLIC_API_URL` (or `NEXT_PUBLIC_API_BASE_URL`)
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` (when taking payments)

### Node version

**.nvmrc** is set to `20` so CI and hosts use a consistent Node version. Configure the same in your hosting platform (e.g. Vercel: Project Settings → General → Node.js Version).

---

## Railway (you’re using this)

For this Next.js frontend service on Railway:

| Setting | Value |
|--------|--------|
| **Build command** | `npm run build` (or leave empty; Railway often auto-detects Next.js) |
| **Start command** | `npm run start` (or `npx next start`) |
| **Root directory** | Leave default (repo root) unless the app lives in a subfolder |
| **Node version** | Picked up from **.nvmrc** (20); or set in Railway → Service → Variables: `NODE_VERSION=20` |

**Environment variables:** In Railway → your service → **Variables**, add the same vars as in **.env.example** / **docs/ENV_SETUP.md**. At minimum:

- `NEXT_PUBLIC_API_URL` (or `NEXT_PUBLIC_API_BASE_URL`) — your backend API URL
- `NEXT_PUBLIC_BASE_URL` — the public URL of this frontend (e.g. your Railway app URL)
- `NEXT_PUBLIC_WS_URL` — WebSocket URL if the app uses real-time features

**Port:** Railway injects `PORT`; Next.js `start` uses it by default in production. No need to set it unless you’re customizing.

If the backend also runs on Railway, use that service’s public URL for `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_WS_URL`.

---

## Production: photo uploads and DB

### Storage (S3/R2) for photo uploads

Photo upload flow is **POST /uploads/sign → PUT to putUrl → POST /jobs/:jobId/photos/commit**. The **backend** that serves `/uploads/sign` must have storage credentials set in production so signed PUT URLs work.

- Set **STORAGE_*** (or your backend's equivalent, e.g. **S3_***) in production for the service that generates presigned URLs (e.g. bucket, region, access key, secret key; for R2 also endpoint).
- If the frontend uses a Next.js API route that calls `lib/storage.ts`, set **S3_BUCKET**, **S3_REGION**, **S3_ACCESS_KEY_ID**, **S3_SECRET_ACCESS_KEY** (and **S3_ENDPOINT** for R2) in the host environment.

### Migration 062 and client_dispute photos

- Run **migration 062** on any database that needs **client_dispute** job photos (e.g. staging, production). That migration should add or adjust schema so `kind = 'client_dispute'` is supported. Run it on each DB that serves photo uploads and dispute evidence.
