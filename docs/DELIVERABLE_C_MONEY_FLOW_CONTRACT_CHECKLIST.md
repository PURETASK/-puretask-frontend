# Deliverable C — PureTask Money Flow Contract Checklist

This is the **exact backend ↔ frontend contract** for every money-critical flow. Not UI, not theory. If these contracts are respected, PureTask cannot accidentally double charge, double pay, or lose escrow.

**Backend reference:** See [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md) for implemented paths. Where this doc says “or backend equivalent,” align to the path your backend exposes.

---

## Six critical money flows

1. **Credit purchase**
2. **Booking escrow hold**
3. **Job completion → approval**
4. **Dispute → refund**
5. **Cleaner earnings calculation**
6. **Payout transfer**

For each flow: **Trigger**, **Endpoint**, **Request/Response**, **DB state**, **Idempotency**, **UI behavior**, **Failure conditions**.

---

## 💳 Flow 1 — Credit purchase

| Item | Contract |
|------|----------|
| **Trigger** | Client buys credits. |
| **Endpoint** | `POST /payments/credits` or backend equivalent (e.g. `POST /credits/checkout` with packageId, successUrl, cancelUrl per [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md)). |
| **Required headers** | `Authorization: Bearer <JWT>`, `Idempotency-Key: <UUID>`. |
| **Request body (example)** | `{ package_id: string, amount_cents: number }` or `{ packageId, successUrl, cancelUrl }` per backend. |
| **Backend actions** | Create Stripe PaymentIntent. On `payment_intent.succeeded`: insert ledger entry `reason = purchase`, update `credit_accounts.current_balance`. |
| **Response (example)** | `{ payment_intent_id, client_secret, new_balance }` or redirect URLs for checkout. |
| **DB must show** | One row in `credit_ledger`; updated `credit_accounts.current_balance`; Stripe event in `stripe_events_processed`. |
| **UI must** | Show updated balance after success; prevent duplicate click (loading state); send Idempotency-Key on every money call. |
| **Failure** | No idempotency key → reject. Duplicate key → return stored response. Stripe failure → no ledger insert. |

---

## 🧾 Flow 2 — Booking → escrow hold

| Item | Contract |
|------|----------|
| **Trigger** | Client confirms booking. |
| **Endpoint** | `POST /bookings` (see [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md)). |
| **Required headers** | `Authorization`, `Idempotency-Key`. |
| **Request body (example)** | `{ cleaner_id, property_id, scheduled_start, credit_amount, buffer_percent }` or fields your backend expects. |
| **Backend actions** | Validate sufficient credits; insert booking; insert ledger row `reason = job_escrow`; update `credit_accounts`: `current_balance` ↓, `held_balance` ↑. |
| **Response (example)** | `{ booking_id, status, escrow_held, remaining_balance }`. |
| **DB must show** | Booking status = requested (or equivalent); ledger row with job_id; held_balance increased. |
| **UI must** | Display held credits clearly; show breakdown (base + buffer). |
| **Failure** | Insufficient credits → 400. Duplicate booking click → no double hold (idempotency). |

---

## 🧹 Flow 3 — Job completion → approval

| Item | Contract |
|------|----------|
| **Trigger** | Client clicks Approve. |
| **Endpoint** | `POST /tracking/:jobId/approve` (auth + job ownership). |
| **Preconditions** | Job status = `awaiting_approval`; dispute window valid (if enforced). |
| **Backend actions** | Insert ledger `reason = escrow_release`; reduce `held_balance`; create `cleaner_earnings` row `status = available`; update job status = `completed`. |
| **Response (example)** | `{ status: "completed", cleaner_earnings_available: true }`. |
| **DB must show** | Held balance ↓; cleaner_earnings status = available; job status updated. |
| **UI must** | Remove approval buttons after success; show receipt / “Payment released”. |
| **Failure** | Double approval → blocked (idempotency or status check). Job not in correct status → 400. |

---

## ⚖ Flow 4 — Dispute → refund

| Item | Contract |
|------|----------|
| **Trigger** | Client submits dispute. |
| **Endpoint** | `POST /tracking/:jobId/dispute` (auth + job ownership). |
| **Request (example)** | `{ reason_code, description, refund_requested_credits? }`. |
| **Backend actions** | Insert dispute row; update job status = `disputed`; hold payout (prevent earnings release). |
| **Admin resolution** | Resolve dispute. |
| **Resolution endpoint** | `POST /admin/jobs/:jobId/resolve-dispute` (see [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md)). Body: `{ resolution: "resolved_refund" | "resolved_no_refund", admin_notes?: string }`. Alternatively `POST /admin/disputes/:id/resolve` if backend uses dispute-id. |
| **If refund** | Insert ledger `reason = refund`; increase client `current_balance`; reduce/adjust cleaner earnings; update job status (e.g. cancelled). |
| **If no refund** | Release escrow to cleaner; update earnings to available; job status = completed. |
| **DB must show** | Dispute record; refund ledger entry when applicable; audit log entry. |
| **UI must** | Dispute form with reason + details; admin resolve UI with partial refund amount where supported. |
| **Failure** | Dispute outside window → blocked. Double resolution → blocked. |

---

## 💰 Flow 5 — Cleaner earnings calculation

| Item | Contract |
|------|----------|
| **Trigger** | Job approved (escrow released). |
| **Table** | `cleaner_earnings` (or equivalent). |
| **Rules** | Insert row when escrow released; `status = available`; `net_amount_cents` after platform fee. |
| **UI must display** | **Pending** (before approval), **Available** (after approval, can request payout), **Paid** (after payout), **Held** (if disputed). |
| **Critical rule** | Cleaner earnings must **never** be computed from client ledger. They must come from `cleaner_earnings` (or backend earnings API). |

---

## 🏦 Flow 6 — Payout transfer

| Item | Contract |
|------|----------|
| **Trigger** | Cleaner clicks “Request payout” or weekly worker runs. |
| **Endpoint** | `POST /payouts/request` (see [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md)). |
| **Backend actions** | Sum available earnings ≥ minimum; create Stripe transfer with idempotency (e.g. `payout_<cleanerId>_<timestamp>`); update `cleaner_earnings.status = paid`; insert payout row. |
| **DB must show** | Payout row; earnings status updated; on failure: entry in `payout_retry_queue`, earnings **not** marked paid. |
| **UI must** | Show payout success; disable duplicate payout click; send Idempotency-Key. |
| **Failure** | If transfer fails: do not mark earnings as paid; retry queue. |

---

## 🛑 Absolute non-negotiable rules

If **any** of these are violated, do not launch:

1. **Ledger must always balance** — every credit movement has a ledger entry; sum of deltas matches account balance.
2. **Every money endpoint requires `Idempotency-Key`** — credit purchase, booking create, approve, payout request.
3. **No cleaner earnings before client approval** — earnings become available only after escrow_release (approve path).
4. **No payout before earnings status = available** — payout worker and UI must respect this.
5. **Dispute must block earnings release** — disputed job → earnings held until admin resolution.
6. **Stripe webhook must be idempotent** — duplicate events must not double-apply.

---

## 🧠 System integrity check

At any time:

- **Credits:** `SUM(credit_ledger deltas) = credit_accounts.current_balance` (for each client).
- **Escrow:** Total escrow held = sum of (job_escrow − escrow_release − escrow_reversal) for active jobs.

If these drift → financial bug. Use for reconciliation and launch verification.

---

## 🎯 What this deliverable gives you

- A **strict backend contract** for all money flows.
- A **frontend integration checklist** (headers, idempotency, UI states).
- A **financial integrity framework** (ledger balance, no double pay).
- A **launch safety standard** (non-negotiables + integrity check).

Use together with **Deliverable A (Build Matrix)** and **Deliverable B (Top 20 Screens)** for execution-grade alignment. For step-by-step QA, see **Deliverable B.1 (60-Minute Launch QA Script)**.
