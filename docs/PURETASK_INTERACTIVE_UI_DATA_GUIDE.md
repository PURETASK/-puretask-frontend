# PureTask Interactive UI Data Guide

A single reference mapping **UI components → required data → DB tables → API endpoints → fallback rules**.

See also: [JOB_DETAILS_API.md](./JOB_DETAILS_API.md) (frontend endpoint + types), [BACKEND_JOB_DETAILS_IMPLEMENTATION.md](./BACKEND_JOB_DETAILS_IMPLEMENTATION.md) (backend route), [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md) (full API list). **Motion + polish (Phases 1–3):** [MOTION_INTERACTIVITY_RUNBOOK.md](./MOTION_INTERACTIVITY_RUNBOOK.md).

---

## Architecture decision (best practice)

| Layer | Endpoint | When |
|--------|----------|------|
| **Static / page data** | **GET /jobs/:jobId/details** | One call on load |
| **Live presence** | **GET /tracking/:jobId** | Poll every 5–10s |

**Why:** Keeps UI fast and caching-friendly, while presence stays real-time.

---

## 0) Canonical sources (truth)

### DB tables (truth)

- `jobs`
- `users`
- `cleaner_profiles`
- `credit_ledger`
- `job_photos`
- `job_checkins` (if written)
- `payment_intents`
- `payouts`
- `job_events` (timeline + live location events, via tracking service)

### APIs (what frontend consumes)

| API | Status |
|-----|--------|
| **GET /jobs/:jobId/details** | ✅ Primary (static job-details payload) |
| **GET /tracking/:jobId** | ✅ Live presence (already exists) |
| GET /jobs/:jobId | Optional legacy / fallback |
| GET /cleaners/:id | Optional (e.g. ring when job has no nested cleaner) |
| GET /stripe/payment-intent/:jobId | Optional legacy |

---

## 1) Job Timeline Rail (Booked → On Route → Working → Completed)

**UI goal:** A calm “progress rail” with animated step transitions.

**Minimum data (from `jobs`):** id, status, scheduled_start_at, scheduled_end_at, actual_start_at, actual_end_at.

**Source:** DB: `jobs`. API: **GET /jobs/:jobId/details** → `data.job`.

### Status mapping (UI)

| jobs.status | UI phase |
|-------------|----------|
| requested, accepted | booked |
| on_my_way | on_route |
| in_progress, awaiting_approval | working |
| completed | completed |
| cancelled | cancelled |
| disputed | disputed |

**Fallback / edge logic:**

- If `actual_start_at` exists but status isn’t `in_progress`, show “Working” anyway (status drift safety).
- If `actual_end_at` exists, force “Completed.”

---

## 2) Reliability Ring (Trust Visualization Layer)

**UI goal:** A circular animated meter around cleaner profile (0–100), “feels fintech”.

**Minimum data (from `cleaner_profiles`):** reliability_score (0–100).  
**Optional:** tier, avg_rating, jobs_completed.

**Source:** DB: `cleaner_profiles`. API: **GET /jobs/:jobId/details** → `data.cleaner.reliability_score`.

**Fallback rules:**

- If job has no assigned cleaner (`job.cleaner_id` null): hide ring, show “Matching in progress” placeholder.
- If `reliability_score` isn’t available: fallback to derived proxy (e.g. `avg_rating / 5 * 100` + optional jobs_completed weight).

---

## 3) Credit Ledger Flow (Escrow → Release → Settled)

**UI goal:** Animated “credit particles” moving from client → escrow → cleaner.

**Minimum data:** From `credit_ledger`: delta_credits, reason, created_at, user_id. From `jobs`: cleaner_id, client_id. Optional “settled”: from `payouts.status`.

**Source:** DB: `credit_ledger`, `payouts`. API: **GET /jobs/:jobId/details** → `data.ledgerEntries`, `data.payout`.

### Ledger mapping (UI)

| credit_ledger.reason | UI meaning |
|----------------------|------------|
| job_escrow | credits held (pending) |
| job_release | credits released (moving) |
| refund | reverse flow back to client |
| adjustment | neutral / admin correction |

**Fallback rules:**

- If there’s no payout, treat job_release as “settled enough” (don’t block the animation).
- If ledger is empty, show “No credit movements yet”.

---

## 4) Map + Presence System (Approach dot + arrival pulse)

**UI goal:** A calm custom map layer: cleaner dot approaching job location, pulsing when arrived, “checked-in” perimeter glow.

**Minimum data (static):** From `jobs`: latitude, longitude, address.

**Minimum data (live):** From tracking state (job_events): latest cleaner location (lat, lng, timestamp), job status timeline events (en-route/arrived).

**Sources:**

- Static: **GET /jobs/:jobId/details** → `data.job.latitude` / `longitude` / `address`.
- Live: **GET /tracking/:jobId** → current location + timeline events.

**Polling:** Poll `/tracking/:jobId` every 5–10s; use request dedupe + abort controller.

**Fallback rules:**

- If no live location: show “On route” from job.status; optionally show cleaner base from `cleaner_profiles.latitude` / `longitude` (label “home base”, not live).

---

## 5) Interactive Cleaner Profile Cards (Apple Wallet feel)

**UI goal:** Cards that expand on hover/tap with trust info + previews.

**Minimum data (cleaner composite):** id, name, avatar_url, bio; reliability_score, tier; avg_rating, jobs_completed. Optional: level, badges[].

**Source:** API: **GET /jobs/:jobId/details** → `data.cleaner`.

**Fallback rules:**

- Missing avatar_url → show initials chip.
- No badges → hide badges row (no empty placeholders).

---

## 6) Proof & Media (Before/After gallery + compliance cues)

**UI goal:** Before/after thumbnails that expand smoothly, with “proof complete” state.

**Minimum data (from `job_photos`):** type (before/after), url, created_at.

**Source:** API: **GET /jobs/:jobId/details** → `data.photos`.

**Fallback rules:**

- No photos yet → “Awaiting before photos” / “Awaiting after photos” depending on status.

---

## 7) Check-in / Check-out (presence verification)

**UI goal:** “Checked in” state that triggers perimeter glow + trust bump.

**Minimum data (from `job_checkins`):** rows with type = 'check_in' and 'check_out', created_at. Optional: is_within_radius, distance_from_job_meters.

**Source:** API: **GET /jobs/:jobId/details** → `data.checkins`.

**Fallback rules:**

- If checkins table isn’t written yet: derive from **GET /tracking/:jobId** — event types check_in, check_out in job_events timeline.

---

## 8) Payments (Status & reassurance)

**UI goal:** Subtle “paid / processing” trust cues, not a full payment screen.

**Minimum data (from `payment_intents`):** status, amount_cents, currency, created_at.

**Source:** API: **GET /jobs/:jobId/details** → `data.paymentIntent`.

**Fallback rules:**

- If paymentIntent is null: use ledger entries for payment status (escrow/release); don’t break UI.

---

## Recommended implementation plan

**Step 1 — Make /jobs/:jobId/details real (backend)**  
Endpoint returns: job, cleaner composite (incl. reliability_score), photos, checkins, ledgerEntries, paymentIntent (job_charge), payout. ✅ This is the “static details” contract.

**Step 2 — Use /tracking/:jobId for live presence**  
On Job Details page: fetch `/jobs/:jobId/details` once; start polling `/tracking/:jobId` after render.

**Step 3 — Frontend data-to-animation binding**

| Component | Data binding |
|-----------|--------------|
| TimelineRail | job.status, scheduled/actual times |
| ReliabilityRing | cleaner.reliability_score |
| LedgerFlow | ledgerEntries, payout?.status |
| ProofGallery | photos |
| PresenceMap | job.lat/lng, tracking.currentLocation |
| CheckinBadge | checkins OR tracking.events |

**Step 4 — Don’t block on optional data**  
Ship with graceful fallbacks: no checkins → derive from tracking events; no payout → treat ledger release as settled; no cleaner assigned → show matching placeholder states.

---

## Exact field checklist (for /details payload)

Single “pull this data” list for GET /jobs/:jobId/details:

**jobs**  
id, client_id, cleaner_id, status, scheduled_start_at, scheduled_end_at, actual_start_at, actual_end_at, address, latitude, longitude, credit_amount, held_credits, cleaning_type, duration_hours, cleaner_payout_amount_cents.

**cleaner composite (users + cleaner_profiles)**  
users.id, users.email; cleaner_profiles.first_name, last_name, bio, avatar_url (if exists), base_rate_cph, reliability_score, tier, avg_rating, jobs_completed.

**job_photos**  
id, job_id, uploaded_by, type, url, thumbnail_url, created_at.

**job_checkins**  
id, job_id, cleaner_id, type, lat, lng, distance_from_job_meters, is_within_radius, created_at.

**credit_ledger**  
id, user_id, job_id, delta_credits, reason, created_at.

**payment_intents (job_charge)**  
id, job_id, client_id, stripe_payment_intent_id, status, amount_cents, currency, purpose, credits_amount, created_at, updated_at.

**payouts**  
id, cleaner_id, job_id, stripe_transfer_id, amount_credits, amount_cents, total_usd, status, created_at, updated_at.
