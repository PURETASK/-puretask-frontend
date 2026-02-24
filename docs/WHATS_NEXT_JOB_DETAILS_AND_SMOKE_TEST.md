# What's Next: Job Details, Base URL, Auth & Smoke Test

This doc covers the **Frontend Job Details** implementation status, **base URL and auth**, **smoke test** steps, and **optional later** work.

**Verified:** The implementation table and base URL/auth descriptions below have been checked against the current codebase. Job Details (types, service, hooks, route, five components) are implemented and wired as described.

---

## 1. Frontend Job Details page ✅

The [Frontend Integration Guide](./FRONTEND_INTEGRATION_GUIDE_JOB_DETAILS.md) is implemented (there is no `DATA_MODEL_REFERENCE.md` in this repo; the guide to follow is the integration guide and [JOB_DETAILS_API.md](./JOB_DETAILS_API.md)).

| Item | Status | Where |
|------|--------|--------|
| **Types** | ✅ | `src/types/jobDetails.ts` — `JobDetailsDTO`, `JobDetailsResponse`, `TrackingState`, job/cleaner/ledger/photo types |
| **getJobDetails / getJobTracking** | ✅ | `src/services/jobDetails.service.ts` — GET `/jobs/:jobId/details` (with fallback to GET `/jobs/:jobId`), GET `/tracking/:jobId`; unwraps `{ data }` |
| **Hooks** | ✅ | `useJobDetails(jobId)` in `src/hooks/useJobDetails.ts`; `useJobTrackingPoll(jobId, intervalMs, enabled)` in `src/hooks/useJobTrackingPoll.ts` |
| **Job Details route** | ✅ | **`/client/bookings/[id]`** — `src/app/client/bookings/[id]/page.tsx` (booking id = job id) |
| **TimelineRail** | ✅ | **JobStatusRail** in `src/components/trust/JobStatusRail.tsx`; status from `job.status` or `tracking?.status` via `mapBackendJobStatusToRail` |
| **ReliabilityRing** | ✅ | **ReliabilityRing** in `src/components/trust/ReliabilityRing.tsx`; bound to `cleaner.reliability_score` |
| **LedgerFlow** | ✅ | **LedgerPhase** inside `JobDetailsTracking` — Pending / Moving / Settled from ledger entries and payout |
| **ProofGallery** | ✅ | **PhotosBlock** in `JobDetailsTracking` — before/after grid; **BeforeAfterCompare** slider when both before and after exist |
| **PresenceMiniMap** | ✅ | **PresenceMapCard** in `src/components/tracking/PresenceMapCard.tsx` — status pill, “Open in Maps”, map placeholder (Phase 3 real map optional) |

**Next step:** Open a real job (as a client) at `/client/bookings/<jobId>` and confirm the UI matches the API: timeline, cleaner ring, ledger phase, photos, and presence card all reflect GET `/jobs/:jobId/details` and GET `/tracking/:jobId` responses.

---

## 2. Base URL and auth

### Base URL

- **Config:** `src/lib/config.ts` — `API_CONFIG.baseURL` = `getApiBaseUrl()` which uses:
  - `NEXT_PUBLIC_API_BASE_URL` or
  - `NEXT_PUBLIC_API_URL` or
  - `'http://localhost:4000'` (default).
- **Usage:** `src/lib/api.ts` creates an axios instance with `baseURL: API_CONFIG.baseURL`. All services (including `jobDetails.service.ts`) use `apiClient` from `api.ts`, so **job details and tracking use the same base**.
- **Paths:** Requests are **relative to baseURL**, e.g. `GET /jobs/:jobId/details` → `{baseURL}/jobs/:jobId/details`.

**If the backend is at the root (e.g. `http://localhost:4000`):**

- Set in `.env.local`:  
  `NEXT_PUBLIC_API_URL=http://localhost:4000`  
  (or `NEXT_PUBLIC_API_BASE_URL`). No trailing slash.

**If you proxy under Next.js `/api`:**

- Option A: Set `NEXT_PUBLIC_API_URL` to the same origin (e.g. `''` or `window.location.origin`) and ensure **Next.js rewrites** send `/api/*` to the backend. Then services must call **`/api/jobs/:jobId/details`** and **`/api/tracking/:jobId`**.  
  Currently the code uses **`/jobs/...`** and **`/tracking/...`** (no `/api` prefix). So either:
  - Use rewrites so that `https://yourapp.com/api` is the backend root, and set `NEXT_PUBLIC_API_URL=https://yourapp.com` (or empty) and **change paths in `jobDetails.service.ts`** to `/api/jobs/...` and `/api/tracking/...`, or
  - Configure rewrites so that `/api/jobs` and `/api/tracking` are proxied and set `baseURL` to include `/api` (e.g. `NEXT_PUBLIC_API_URL=http://localhost:3000/api` if Next host is 3000 and proxy is under `/api`).
- Option B: Keep backend at its own origin and set `NEXT_PUBLIC_API_URL` to that origin (no proxy). No path changes needed.

### Auth

- **Mechanism:** **Bearer token** in the `Authorization` header.
- **Where:** `src/lib/api.ts` — request interceptor reads `localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)` and sets `Authorization: Bearer <token>`.
- **Token key:** `STORAGE_KEYS.AUTH_TOKEN` = `'puretask_token'` (in `config.ts`). Same key is used by `AuthContext` and `apiClient`.
- **Cookies:** The axios client in `api.ts` does **not** send `credentials: 'include'`. If the backend expects **cookies** instead of (or in addition to) Bearer, you’d need to add cookie support or align the backend with Bearer.

**Checklist:**

- [ ] Backend and frontend agree on base URL (same origin + rewrites, or backend origin in `NEXT_PUBLIC_API_URL`).
- [ ] If using a proxy, paths are correct: either `/api/jobs/...` and `/api/tracking/...` with baseURL including `/api`, or rewrites map one-to-one.
- [ ] Backend accepts **Authorization: Bearer &lt;token&gt;** (or adjust frontend/interceptor if backend uses cookies).

---

## 3. Smoke test

1. **Log in as a client** (token stored in `localStorage` under `puretask_token`).
2. **Pick a job ID** the client is allowed to see (e.g. from “My Bookings” or from the backend).
3. **Call the APIs** (browser DevTools, Postman, or curl):
   - **GET** `{baseURL}/jobs/:jobId/details`  
     - Expect **200**, body shape per [JOB_DETAILS_API.md](./JOB_DETAILS_API.md) (e.g. `{ data: { job, cleaner, checkins, photos, ledgerEntries, paymentIntent, payout } }` or unwrapped).
   - **GET** `{baseURL}/tracking/:jobId`  
     - Expect **200**, body with `status`, optional `currentLocation`, etc. (see `TrackingState` in `src/types/jobDetails.ts`).
4. **Auth:** Without a valid token (or cookie if backend uses it), expect **401** for both. With the client’s token, only that client’s jobs should return 200; others should be 403/404 as the backend defines.
5. **UI:** Open **`/client/bookings/:id`** with the same `id` (booking id = job id). Confirm:
   - Timeline rail matches `job.status` / `tracking?.status`.
   - Reliability ring shows `cleaner.reliability_score`.
   - Ledger shows Pending / Moving / Settled from ledger + payout.
   - Proof gallery shows photos (grid or before/after slider).
   - Presence card shows status and “Open in Maps” (and “Live location active” if tracking returns `currentLocation`).

---

## 4. Optional later

- **Replace stubs when needed:**
  - `/client/payment-methods` (used on client settings; can remain stubbed until payment methods are implemented).
  - Notification **read** / **read-all** (after adding `read_at` on the backend). Not required for Job Details.
- **Phase 3 map:** Replace the placeholder in `PresenceMapCard` with a real map (e.g. Google Maps JS SDK) when ready; use `useRealMap` and pass through job/cleaner coordinates.

---

## Quick reference

| Concern | Location |
|--------|----------|
| Job details API + types | [JOB_DETAILS_API.md](./JOB_DETAILS_API.md), [FRONTEND_INTEGRATION_GUIDE_JOB_DETAILS.md](./FRONTEND_INTEGRATION_GUIDE_JOB_DETAILS.md) |
| Backend implementation | [BACKEND_JOB_DETAILS_IMPLEMENTATION.md](./BACKEND_JOB_DETAILS_IMPLEMENTATION.md) |
| Base URL / env | `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE_URL`; `src/lib/config.ts`, `src/lib/api.ts` |
| Auth | Bearer token; `src/lib/api.ts` interceptor; `STORAGE_KEYS.AUTH_TOKEN` |
| Job Details page | `src/app/client/bookings/[id]/page.tsx` |
| Five components | JobStatusRail, ReliabilityRing, LedgerPhase (in JobDetailsTracking), PhotosBlock/BeforeAfterCompare, PresenceMapCard |
