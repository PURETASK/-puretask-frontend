# Frontend Integration Guide: /jobs/:jobId/details + /tracking/:jobId

**Goal:** On the Job Details page, fetch static details once (GET /jobs/:jobId/details), poll live presence (GET /tracking/:jobId every 5–10s), and bind data to Timeline Rail, Reliability Ring, Ledger Flow, Proof Gallery, and Presence.

---

## How this repo is wired (current implementation)

| Guide concept | PureTask frontend |
|---------------|-------------------|
| **Types** | `src/types/jobDetails.ts` — `JobDetailsDTO`, `JobDetailsResponse`, `JobDetailsJob`, `JobDetailsCleaner`, `JobCheckIn`, `JobPhoto`, `CreditLedgerEntryForJob`, `PaymentIntentForJob`, `PayoutForJob`, **`TrackingState`** (for live presence). |
| **API client** | `src/lib/api.ts` — axios `apiClient` with Bearer token; no separate fetch wrapper. |
| **Services** | `src/services/jobDetails.service.ts` — **`getJobDetails(jobId)`** (GET /jobs/:jobId/details, unwraps `data`, fallback to GET /jobs/:jobId), **`getJobTracking(jobId)`** (GET /tracking/:jobId, unwraps `data`). |
| **Hook: details** | `src/hooks/useJobDetails.ts` — React Query `useJobDetails(jobId)`; query key `['job-details', jobId]`; returns `{ details, isLoading, error, invalidate }`. |
| **Hook: tracking poll** | `src/hooks/useJobTrackingPoll.ts` — **`useJobTrackingPoll(jobId, intervalMs, enabled)`**; polls GET /tracking/:jobId; returns `{ tracking, error }`. |
| **Page** | **`src/app/client/bookings/[id]/page.tsx`** — Client booking detail; uses `useJobDetails(bookingId)` and **`useJobTrackingPoll(bookingId, 8000, enabledWhenActive)`**; renders **`JobDetailsTracking`** with `details` and **`tracking`**. |
| **Components** | **`src/components/trust/JobDetailsTracking.tsx`** — Renders JobStatusRail (timeline), ReliabilityRing (cleaner), LedgerPhase (ledger), PresenceBlock (check-ins), PhotosBlock (before/after). Accepts **`tracking?: TrackingState`** for live status + “Live location active” badge. |
| **Status mapping** | `src/components/trust/jobStatus.ts` — `mapBackendJobStatusToRail(backendStatus)` → booked | on_route | working | completed. |
| **Ledger mapping** | Inside JobDetailsTracking: job_escrow → Pending, job_release → Moving, payout paid → Settled. |

**Route:** Job details UI lives at **`/client/bookings/[id]`** (booking id = job id). There is no separate `/jobs/[jobId]` page; the guide’s “Job Details Page” is implemented as the client booking detail page.

---

## 1) Types (single source of truth)

**File:** `src/types/jobDetails.ts`

- **Job details:** `JobDetailsJob`, `JobDetailsCleaner`, `JobCheckIn`, `JobPhoto`, `CreditLedgerEntryForJob`, `PaymentIntentForJob`, `PayoutForJob`, `JobDetailsResponse` (inner payload), `JobDetailsDTO` (normalized for UI with `presence`).
- **Tracking:** `TrackingState` — `jobId?`, `status?`, `currentLocation?: { lat, lng, at? }`, `events?[]`. Used for live presence and optional timeline from GET /tracking/:jobId.

Backend status values (e.g. requested, accepted, on_my_way, in_progress, awaiting_approval, completed, cancelled, disputed) are strings; mapping to rail phases is in `jobStatus.ts`.

---

## 2) API client

**File:** `src/lib/api.ts`

Axios instance with base URL, Bearer token from localStorage, and error handling. All requests use `apiClient.get/post/...`; response body is `res.data`. No separate `apiGet` fetch wrapper; services call `apiClient.get(...)`.

---

## 3) Service functions

**File:** `src/services/jobDetails.service.ts`

- **`getJobDetails(jobId)`** — GET `/jobs/${jobId}/details`; unwraps `{ data }`; returns `JobDetailsDTO`. On 404/501, falls back to GET /jobs/:jobId and builds minimal DTO.
- **`getJobTracking(jobId)`** — GET `/tracking/${jobId}`; unwraps `{ data }` if present; returns `TrackingState`.

Base path is configured via `API_CONFIG.baseURL` (e.g. `NEXT_PUBLIC_API_URL`). If the backend is under `/api`, set baseURL to include `/api` or use full paths in services.

---

## 4) Hooks

- **`useJobDetails(jobId)`** — Fetches once (React Query); stable data for rail, ring, ledger, photos, check-ins.
- **`useJobTrackingPoll(jobId, intervalMs, enabled)`** — Polls GET /tracking/:jobId; use `enabled` when booking is in active statuses so we don’t poll for cancelled/completed jobs.

---

## 5) Job Details page wiring

**File:** `src/app/client/bookings/[id]/page.tsx`

- Load booking: `useBooking(bookingId)`.
- Load job details: `useJobDetails(bookingId)`.
- **Poll tracking:** `useJobTrackingPoll(bookingId, 8000, enabled)` where `enabled` is true for pending, accepted, scheduled, in_progress, on_my_way, awaiting_approval.
- When `jobDetails` is present, render `<JobDetailsTracking details={jobDetails} tracking={jobTracking ?? null} />`.
- Quick actions: Add to Calendar, Share, Message Cleaner; Cancel with invalidation of job-details and booking queries.

---

## 6) Component → data binding

| Component | Data |
|-----------|------|
| **Timeline rail** | `job.status` or `tracking?.status` → `mapBackendJobStatusToRail` → JobStatusRail. |
| **Reliability ring** | `cleaner.reliability_score` (and tier, avg_rating, jobs_completed). |
| **Ledger flow** | `ledgerEntries`, `payout?.status`, `paymentIntent` → Pending / Moving / Settled. |
| **Proof gallery** | `photos` (before/after). |
| **Presence** | `presence.checkins` + `tracking?.currentLocation` → “Live location active” when tracking has currentLocation; check-in list from details. |

Framer Motion is used in existing trust components (e.g. JobStatusRail, ReliabilityRing) where already integrated; JobDetailsTracking uses Cards and conditional sections.

---

## 7) Optional: standalone /jobs/[jobId] route

If you want a **direct** job URL (e.g. for links that use job id only), add:

- **`src/app/jobs/[jobId]/page.tsx`** — Server component that renders a client component with `jobId={params.jobId}`.
- **`src/app/jobs/[jobId]/JobDetailsClient.tsx`** — Client component that uses `useJobDetails(jobId)`, `useJobTrackingPoll(jobId, 8000, true)`, and `<JobDetailsTracking details={...} tracking={...} />`.

Current UX uses **/client/bookings/[id]** as the single entry for clients; booking id and job id are the same.

---

## 8) Gotchas

- **API base path:** If the backend is behind `/api`, set `API_CONFIG.baseURL` (or env) so that requests go to `/api/jobs/...` and `/api/tracking/...`.
- **Auth:** Auth uses Bearer token in `Authorization` header (axios interceptor in `src/lib/api.ts`). No `credentials: "include"`; ensure token is set for GET /jobs/:jobId/details and GET /tracking/:jobId.
- **Polling when to run:** Tracking poll is enabled only for active statuses to avoid unnecessary calls for completed/cancelled jobs.

---

## 9) Reference docs

- [JOB_DETAILS_API.md](./JOB_DETAILS_API.md) — Endpoints, response type, status/ledger mapping.
- [PURETASK_INTERACTIVE_UI_DATA_GUIDE.md](./PURETASK_INTERACTIVE_UI_DATA_GUIDE.md) — UI → data → DB → API and fallbacks.
- [BACKEND_JOB_DETAILS_IMPLEMENTATION.md](./BACKEND_JOB_DETAILS_IMPLEMENTATION.md) — Backend route and helpers for GET /jobs/:jobId/details.
