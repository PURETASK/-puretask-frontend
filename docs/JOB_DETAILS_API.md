# Job Details API — Frontend reference

Which endpoint to call, how to type the response, and how to map status/ledger for the job-details UI (rail, ring, ledger, presence, photos).

**Backend:** GET /jobs/:jobId/details is implemented; the frontend can rely on the response shape described below.

**Full UI → data map:** [PURETASK_INTERACTIVE_UI_DATA_GUIDE.md](./PURETASK_INTERACTIVE_UI_DATA_GUIDE.md). **Frontend wiring (hooks, page, tracking poll):** [FRONTEND_INTEGRATION_GUIDE_JOB_DETAILS.md](./FRONTEND_INTEGRATION_GUIDE_JOB_DETAILS.md).

---

## 1) Which endpoint to call

| Use case | Endpoint(s) | Notes |
|----------|-------------|--------|
| **Full job-details screen** (rail + ring + ledger + presence + photos) | **GET /jobs/:jobId/details** | One call → `job`, `cleaner`, `checkins`, `photos`, `ledgerEntries`, `paymentIntent`, `payout`. |
| **Minimal** (job + rail; ring only if cleaner has reliability) | **GET /jobs/:jobId** | Returns `{ data: { job } }`. If you need the reliability ring and the job doesn’t include a nested cleaner with `reliability_score`, also call **GET /cleaners/:id** with `job.cleaner_id`. |

The app uses **GET /jobs/:jobId/details** via `getJobDetails(jobId)` in `src/services/jobDetails.service.ts`. On 404/501 it falls back to GET /jobs/:jobId and builds a minimal DTO.

---

## 2) Response type for GET /jobs/:jobId/details

The backend sends **`{ data: JobDetailsResponse }`**. The frontend unwraps `data` in the service and types the inner payload with **`JobDetailsResponse`** from `src/types/jobDetails.ts`:

```ts
// Response of GET /jobs/:jobId/details is { data: JobDetailsResponse }
import type { JobDetailsResponse } from '@/types/jobDetails';
```

**`JobDetailsResponse`** (and related types) are defined in `src/types/jobDetails.ts`:

- **job** — full job row (id, status, scheduled_start_at, address, cleaner_id, cleaning_type / service_type, etc.)
- **cleaner** — `JobDetailsCleaner | null` (id, name, avatar_url, bio, base_rate_cph, reliability_score, tier, avg_rating, jobs_completed)
- **checkins** — `JobCheckIn[]` (id, job_id, type, lat, lng, created_at, …)
- **photos** — `JobPhoto[]` (id, type, url, thumbnail_url, created_at, …)
- **ledgerEntries** — `CreditLedgerEntryForJob[]` (id, user_id, job_id, delta_credits, reason, created_at)
- **paymentIntent** — `PaymentIntentForJob | null`
- **payout** — `PayoutForJob | null`

Use these types (or the normalized **`JobDetailsDTO`**) for the UI; do not paste backend SQL or route files into the frontend.

---

## 3) Mapping rules (frontend-only logic)

Implemented in:

- **Timeline rail:** `src/components/trust/jobStatus.ts` → `mapBackendJobStatusToRail(backendStatus)`
- **Ledger flow:** `src/components/trust/JobDetailsTracking.tsx` → `LedgerPhase`

### Timeline rail

| Backend status | Rail label |
|----------------|------------|
| `requested` \| `accepted` \| `pending` \| `scheduled` | **Booked** |
| `on_my_way` | **On route** |
| `in_progress` \| `awaiting_approval` | **Working** |
| `completed` | **Completed** |

### Ledger flow

| Condition | Phase |
|-----------|--------|
| `ledgerEntries` has `reason === 'job_escrow'` | **Pending** |
| `ledgerEntries` has `reason === 'job_release'` | **Moving** |
| `payout?.status === 'paid'` | **Settled** |

---

## TL;DR

- **Do:** Use **GET /jobs/:jobId/details** for the full job-details UI; use **GET /jobs/:jobId** (and optionally **GET /cleaners/:id**) for minimal rail + ring.
- **Do:** Type the response with **`JobDetailsResponse`** from `src/types/jobDetails.ts`.
- **Do:** Use the status → timeline and ledger → state mappings above in the frontend (`jobStatus.ts`, `JobDetailsTracking.tsx`).
- **Don’t:** Paste the full backend doc (SQL, routes, services) into the frontend.
