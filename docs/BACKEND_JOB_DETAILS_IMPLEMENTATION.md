# Backend: GET /jobs/:jobId/details — Implementation guide

This doc is **for the backend repo**. The PureTask frontend expects **GET /jobs/:jobId/details** to return everything the Job Details UI needs in one call. Paste the route and helpers below into your Express backend so the frontend can consume it.

**UI → data map:** For a component-by-component list of required data, DB sources, and fallback rules, see [PURETASK_INTERACTIVE_UI_DATA_GUIDE.md](./PURETASK_INTERACTIVE_UI_DATA_GUIDE.md) (frontend repo docs).

---

## Implementation status (backend aligned)

The backend implements this contract. The frontend can rely on the response shape and behavior below.

**What matches:** Response shape (`sendSuccess(res, payload)` → `{ data: { job, cleaner, photos, checkins, ledgerEntries, paymentIntent, payout } }`); route `GET /:jobId/details` with `requireAuth` and `requireOwnership("job", "jobId")`; helpers (getCleanerComposite, getJobPhotos, getJobCheckins, getJobLedgerEntries, getJobPaymentIntent, getJobPayout, getCleanerLevel, getCleanerBadges); full job from getJob/getJobById; cleaner fields including reliability_score, tier, avg_rating, jobs_completed, optional level/badges; same SQL/columns for photos, checkins; ledger via getJobCreditEntries → credit_ledger by job_id; payment intent (job_id + purpose = 'job_charge', latest); payout (latest by job_id, total_usd as number).

**Small, non-breaking differences:** 404 is sent via `sendError(res, { code: "NOT_FOUND", ... }, 404)` instead of throwing; handler uses `asyncHandler()` instead of try/catch + next(err); level/badges use real `cleaner_level_progress` and `cleaner_badges` + badge_definitions (not stubs); ledger query may use `SELECT *` — `CreditLedgerEntry` has the same fields, so response shape is unchanged.

---

## 1) Response shape (what the frontend will get)

The frontend expects the response **body** to be either:

- `{ data: { job, cleaner, photos, checkins, ledgerEntries, paymentIntent, payout } }` (recommended), or  
- `{ job, cleaner, photos, checkins, ledgerEntries, paymentIntent, payout }` (no wrapper).

Frontend types (inner payload) live in **frontend** `src/types/jobDetails.ts` as `JobDetailsResponse`. Backend should return:

| Field | Type | Notes |
|-------|------|--------|
| **job** | Full job row | From `jobs` table (id, status, scheduled_start_at, scheduled_end_at, actual_start_at, actual_end_at, address, latitude, longitude, cleaner_id, client_id, credit_amount, cleaning_type, etc.). |
| **cleaner** | `null` or object | When `job.cleaner_id` is set: id, email, name, avatar_url, bio, base_rate_cph, **reliability_score**, tier, avg_rating, jobs_completed; optional level, badges[]. |
| **photos** | Array | From `job_photos`: id, job_id, uploaded_by, type ("before"\|"after"), url, thumbnail_url, created_at. |
| **checkins** | Array | From `job_checkins`: id, job_id, cleaner_id, type ("check_in"\|"check_out"), lat, lng, distance_from_job_meters, is_within_radius, created_at. Empty if not persisted. |
| **ledgerEntries** | Array | From `credit_ledger` WHERE job_id: id, user_id, job_id, delta_credits, reason, created_at. |
| **paymentIntent** | `null` or object | Latest from `payment_intents` WHERE job_id AND purpose = 'job_charge': id, job_id, client_id, stripe_payment_intent_id, status, amount_cents, currency, purpose, credits_amount, created_at, updated_at. |
| **payout** | `null` or object | Latest from `payouts` WHERE job_id: id, cleaner_id, job_id, stripe_transfer_id, amount_credits, amount_cents, total_usd, status ("pending"\|"paid"\|"failed"), created_at, updated_at. |

---

## 2) Route and query helpers (paste into backend repo)

Assumptions:

- You have `requireAuth`, `requireOwnership("job", "jobId")`, and `sendSuccess(res, payload)` (which typically sends `{ data: payload }`).
- You have `query()` from your DB client (e.g. `src/db/client`).
- You have `getJobById(jobId)` (or `getJob()` + 404) in `jobsService`.

If your naming differs (e.g. `sendSuccess` → `res.json({ data: ... })`), adjust accordingly. Keep the SQL and response structure the same so the frontend stays aligned.

```ts
// In src/routes/jobs.ts (or equivalent)

/**
 * GET /jobs/:jobId/details
 * Single-call endpoint for Job Details UI (timeline, trust viz, ledger flow, photos, checkins, payment, payout).
 * Protect with requireOwnership("job", "jobId") to prevent leaks.
 */
router.get(
  "/:jobId/details",
  requireAuth,
  requireOwnership("job", "jobId"),
  async (req, res, next) => {
    try {
      const jobId = req.params.jobId;
      const job = await getJobById(jobId); // throw 404 if missing
      const cleanerUserId = job.cleaner_id;

      const [
        cleaner,
        photos,
        checkins,
        ledgerEntries,
        paymentIntent,
        payout,
      ] = await Promise.all([
        cleanerUserId ? getCleanerComposite(cleanerUserId) : Promise.resolve(null),
        getJobPhotos(jobId),
        getJobCheckins(jobId),
        getJobLedgerEntries(jobId),
        getJobPaymentIntent(jobId),
        getJobPayout(jobId),
      ]);

      return sendSuccess(res, {
        job,
        cleaner,
        photos,
        checkins,
        ledgerEntries,
        paymentIntent,
        payout,
      });
    } catch (err) {
      return next(err);
    }
  }
);

// --------------- Query helpers (local or in a service) ---------------

async function getCleanerComposite(cleanerUserId: string) {
  const cleanerRow = await query(
    `SELECT u.id, u.email, cp.first_name, cp.last_name, cp.avatar_url, cp.bio,
            cp.base_rate_cph, cp.reliability_score, cp.tier, cp.avg_rating, cp.jobs_completed
     FROM users u
     LEFT JOIN cleaner_profiles cp ON cp.user_id = u.id
     WHERE u.id = $1 AND u.role = 'cleaner'
     LIMIT 1`,
    [cleanerUserId]
  );
  if (cleanerRow.rows.length === 0) return null;
  const c = cleanerRow.rows[0];
  const name = [c.first_name, c.last_name].filter(Boolean).join(" ").trim();
  const [level, badges] = await Promise.all([
    getCleanerLevel(cleanerUserId).catch(() => null),
    getCleanerBadges(cleanerUserId).catch(() => []),
  ]);
  return {
    id: c.id,
    email: c.email,
    name: name || c.email,
    avatar_url: c.avatar_url,
    bio: c.bio,
    base_rate_cph: c.base_rate_cph,
    reliability_score: c.reliability_score,
    tier: c.tier,
    avg_rating: c.avg_rating,
    jobs_completed: c.jobs_completed,
    level,
    badges,
  };
}

async function getJobPhotos(jobId: string) {
  const r = await query(
    `SELECT id, job_id, uploaded_by, type, url, thumbnail_url, created_at
     FROM job_photos WHERE job_id = $1 ORDER BY type ASC, created_at ASC`,
    [jobId]
  );
  return r.rows;
}

async function getJobCheckins(jobId: string) {
  const r = await query(
    `SELECT id, job_id, cleaner_id, type, lat, lng,
            distance_from_job_meters, is_within_radius, created_at
     FROM job_checkins WHERE job_id = $1 ORDER BY created_at ASC`,
    [jobId]
  );
  return r.rows;
}

async function getJobLedgerEntries(jobId: string) {
  const r = await query(
    `SELECT id, user_id, job_id, delta_credits, reason, created_at
     FROM credit_ledger WHERE job_id = $1 ORDER BY created_at ASC`,
    [jobId]
  );
  return r.rows;
}

async function getJobPaymentIntent(jobId: string) {
  const r = await query(
    `SELECT id, job_id, client_id, stripe_payment_intent_id, status, amount_cents,
            currency, purpose, credits_amount, created_at, updated_at
     FROM payment_intents WHERE job_id = $1 AND purpose = 'job_charge'
     ORDER BY created_at DESC LIMIT 1`,
    [jobId]
  );
  return r.rows[0] ?? null;
}

async function getJobPayout(jobId: string) {
  const r = await query(
    `SELECT id, cleaner_id, job_id, stripe_transfer_id, amount_credits, amount_cents,
            total_usd, status, created_at, updated_at
     FROM payouts WHERE job_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [jobId]
  );
  return r.rows[0] ?? null;
}

async function getCleanerLevel(cleanerUserId: string): Promise<number | null> {
  // Wire to your cleaner_level_progress table if it exists; else return null.
  return null;
}

async function getCleanerBadges(cleanerUserId: string) {
  // Wire to cleaner_badges + badge_definitions if they exist; else return [].
  return [] as Array<{ id: string; name: string; icon?: string | null }>;
}
```

---

## 3) Frontend usage

Once this route exists and returns the shape above:

- The frontend calls **GET /jobs/:jobId/details** via `getJobDetails(jobId)` in `src/services/jobDetails.service.ts`.
- It unwraps `data` if present and normalizes to `JobDetailsDTO` for the UI.
- The client booking detail page (`/client/bookings/[id]`) renders **JobDetailsTracking** (timeline rail, reliability ring, ledger flow, check-ins, before/after photos).

---

## 4) Best practices

- **Keep live tracking separate:** Do not put live GPS/presence in this endpoint. Use **GET /tracking/:jobId** for polling or websockets (timeline events + current cleaner location).
- **Require ownership:** Keep `requireOwnership("job", "jobId")` (or equivalent) on **GET /jobs/:jobId/details** so only the client, assigned cleaner, or admin can access the payload.
