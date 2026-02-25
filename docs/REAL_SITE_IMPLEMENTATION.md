# PureTask Real-Site Implementation (Scaffold)

This doc summarizes what was implemented from the **PureTask Real-Site Implementation Plan** and the **Interactive Website Prototype**: design tokens, API stubs, storage helper, Mapbox route placeholder, and high-impact UX (before/after slider, guardrails, one-tap CTAs).

## Stack (locked)

- **Next.js** (App Router), **Tailwind**, **shadcn/ui** (Button, Card, Badge, Progress, Input, Textarea), **Framer Motion**
- **Maps:** Mapbox (CleanerMap with optional route polyline)
- **Uploads:** S3/R2 signed URLs via `lib/storage.ts`; flow: **POST /uploads/sign** → PUT to putUrl → **POST /jobs/:jobId/photos/commit**

## Design tokens

- **`src/lib/brand.ts`** — `BRAND` (blue, aqua, graphite, cloud, mint) and `gradientPrimary`
- **GradientText** / **GradientButton** use these tokens

## App routes (pages)

| Route | Purpose |
|-------|--------|
| `/` | Landing |
| `/client/address` | Address capture (Places/Autocomplete later) |
| `/client/job/[jobId]` | Job review: timeline, before/after slider, approve/dispute |
| `/client/job/[jobId]/dispute` | Dispute intake (reason + details) |
| `/cleaner/map` | Next appointment map + presence; “Start job workflow” |
| `/cleaner/job/[jobId]/workflow` | Stepper: en route → check-in → before → clean → after → submit |
| `/cleaner/job/[jobId]/upload` | Before/after photo upload |
| `/cleaner/wallet` | Credits, weekly vs instant payout, request payout |

Pages live under route groups: `(client)/client/...` and `(cleaner)/cleaner/...`.

## Data contract — Job Timeline

One timeline stream powers both cleaner workflow and client transparency. Event types: `job_assigned`, `en_route_sent`, `gps_check_in`, `before_photos_uploaded`, `timer_started`, `timer_paused`/`timer_resumed`, `gps_check_out`, `after_photos_uploaded`, `job_submitted`, `client_approved`, `dispute_opened`, `dispute_resolved`. See **`src/services/jobs.ts`** and **`src/components/job/JobTimeline.tsx`**.

## API route stubs (Next.js)

All under **`src/app/api/`**. Wire to your backend or implement persistence.

| Method | Path | Purpose |
|--------|------|--------|
| POST | `/uploads/sign` | Body: `jobId`, `kind`, `fileName`, `contentType`, `bytes`. Returns `putUrl`, `key`, `publicUrl?`. |
| POST | `/api/jobs/[jobId]/events/en-route` | Stub: create `en_route_sent` event |
| POST | `/api/jobs/[jobId]/events/check-in` | Body: `lat`, `lng`. Stub: validate GPS, create `gps_check_in` |
| POST | `/api/jobs/[jobId]/events/submit` | Stub: require before+after photos, create `job_submitted` |
| POST | `/jobs/:jobId/photos/commit` | Body: `kind`, `key`, `contentType`, `bytes`. Record photo + timeline event |
| POST | `/tracking/:jobId/approve` | Body: `rating?`, `note?`. Auth + job ownership; `client_approved`, release funds |
| POST | `/tracking/:jobId/dispute` | Body: `reason`, `details`. Auth + job ownership; `dispute_opened` |

Frontend services in **`src/services/jobs.ts`**, **`uploads.ts`**, **`cleaner.ts`** currently call **`/api/v1/...`** against `NEXT_PUBLIC_API_URL`. To use these Next.js stubs instead, point the API base URL to the same origin and align paths (e.g. `/api` instead of `/api/v1`), or add a BFF that proxies to these routes.

## Storage (S3 / R2)

- **`src/lib/storage.ts`**
  - `getSignedPutUrl({ key, contentType, bytes, expiresInSeconds })` → `{ putUrl, key, publicUrl? }`
  - `jobPhotoKey(jobId, kind, fileName)` for consistent keys
- **Real presigned URLs:** When `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are set, uses **@aws-sdk/client-s3** and **@aws-sdk/s3-request-presigner** (AWS SDK v3) to generate presigned PUT URLs. When not set (e.g. local dev), returns a stub URL so the flow still runs.
- **ENV:** `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`; for R2 add `S3_ENDPOINT`, `S3_REGION=auto`. Optional: `S3_FORCE_PATH_STYLE=true`, `NEXT_PUBLIC_UPLOADS_BASE_URL` for public read URL.

## Mapbox

- **`src/components/maps/CleanerMap.tsx`**
  - Props: `dest`, `cleaner?`, **`routeCoordinates?`** (optional `[lng, lat][]` for polyline)
  - Job marker (blue), optional cleaner position (flyTo). When `routeCoordinates` is provided, draws a route line (wire Mapbox Directions API here).
- **ENV:** `NEXT_PUBLIC_MAPBOX_TOKEN` (see `.env.example`).

## High-impact UX (from prototype)

1. **One shared Job Timeline** — `JobTimeline` component + timeline events in services; used on client job review and (via stepper state) cleaner workflow.
2. **Auto-guardrails** — On cleaner workflow, **Submit** is disabled until both before and after photos are present; message: “Upload before and after photos first.”
3. **Client approval = confidence builder** — **BeforeAfterGallery** has `variant="slider"`: side-by-side before/after with draggable divider on client job page.
4. **One-tap actions** — Big “Primary action” in JobStepper; “Approve & release funds” and “Open dispute” on client job page; “Send En Route” then “Navigate → Check-in” flow.
5. **Wallet** — Cleaner wallet page has weekly vs instant payout and “Request payout”; “credits earned” animation can be added on approval (e.g. in client flow or webhook).

## ENV summary

- **Mapbox:** `NEXT_PUBLIC_MAPBOX_TOKEN`
- **S3/R2:** `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`; optional `S3_ENDPOINT` (R2), `NEXT_PUBLIC_UPLOADS_BASE_URL`

## Backend contract (timeline in sync)

See **`docs/BACKEND_JOB_TIMELINE_CONTRACT.md`** for the exact contract so the Job Timeline stays in sync:

- **GET /jobs/:jobId/timeline** (ASC) — single event stream for cleaner stepper + client receipt.
- **POST /jobs/:jobId/photos/commit** — must create timeline event `before_photos_uploaded` or `after_photos_uploaded` when storing the photo (otherwise stepper and client UI drift).
- **POST /tracking/:jobId/approve** and **POST /tracking/:jobId/dispute** (auth + job ownership). En-route, check-in, submit, approve, dispute endpoints must create the corresponding timeline events.

## Next steps

- Protect `/client/*` and `/cleaner/*` with auth + role guards (middleware).
- Backend: implement or verify timeline + photos/commit (see BACKEND_JOB_TIMELINE_CONTRACT.md).
- Replace remaining API stubs with real persistence and timeline event writes.
- Optionally add Mapbox Directions API for route polyline + ETA on CleanerMap.
- Add “+credits” animation on client approve (e.g. wallet or confirmation screen).
