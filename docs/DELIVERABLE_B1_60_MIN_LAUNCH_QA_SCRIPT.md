# Deliverable B.1 — 60-Minute Full Launch QA Script

Click-by-click execution checklist to validate that PureTask is launch-ready. No theory — operational validation only.

**You will test 3 full money loops:**

1. **Booking loop** — Credits → Booking → Escrow hold  
2. **Execution loop** — Cleaner accept → Check-in → Photos → Complete  
3. **Approval / Dispute / Payout loop** — Approve or dispute → Earnings → Payout  

If all pass → you can launch.

---

## Pre-test setup (5 minutes)

- **Accounts:** 1 Client, 1 Cleaner, 1 Admin  
- **Stripe:** Test mode enabled. Test card: `4242 4242 4242 4242`  
- **Cleaner:** Stripe Connect onboarding complete (`payouts_enabled`)  
- **Client:** Start with 0 credits  

---

## Test 1 — Credit purchase (money entry)

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1.1 | Login as Client → `/auth/login` | JWT stored, redirect to `/client/dashboard` |
| 1.2 | Go to `/client/credits` → Buy Credits → complete Stripe payment | Credits balance increases; ledger shows purchase; no duplicate charges |
| 1.3 | Refresh page (same session) | No double charge (idempotency works) |
| **DB check** | — | `credit_ledger` has 1 row; `credit_accounts.current_balance` updated |

---

## Test 2 — Booking → escrow hold (revenue lock)

| Step | Action | Pass criteria |
|------|--------|----------------|
| 2.1 | From Client: `/search` → pick cleaner → complete `/booking` flow → confirm | Escrow hold happens (balance decreases); booking status = requested |
| 2.2 | Check client balance / ledger | Available balance reduced; held balance correct |
| 2.3 | Check cleaner job feed | Booking appears in cleaner feed |
| **DB check** | — | `credit_ledger` row `reason = job_escrow`; booking created; no double hold |

---

## Test 3 — Cleaner acceptance

| Step | Action | Pass criteria |
|------|--------|----------------|
| 3.1 | Login as Cleaner → `/cleaner/jobs/requests` (or job feed) | See the new job |
| 3.2 | Accept job | Job status → accepted; event logged |
| 3.3 | As Client: refresh booking detail | Client sees “Confirmed” / status update |

---

## Test 4 — GPS check-in + photo enforcement

| Step | Action | Pass criteria |
|------|--------|----------------|
| 4.1 | Open `/cleaner/jobs/[id]` (or workflow page) | Job detail loads |
| 4.2 | Attempt check-in **outside** radius (if possible) | Blocked or warning |
| 4.3 | Check-in **inside** radius | Allowed; `job_checkins` (or equivalent) created |
| 4.4 | Upload 1 **before** photo | Accepted |
| 4.5 | Try to complete job **without** after photo | Should fail (min after required) |
| 4.6 | Upload **after** photo, then complete | Allowed; job moves to awaiting_approval |

---

## Test 5 — Complete → awaiting approval

| Step | Action | Pass criteria |
|------|--------|----------------|
| 5.1 | Cleaner marks job complete (after before + after photos) | Status → `awaiting_approval` |
| 5.2 | Client receives notification (if implemented) | — |
| 5.3 | Cleaner earnings | Status = pending/held; **not** available yet |

---

## Test 6 — Client approval (happy path)

| Step | Action | Pass criteria |
|------|--------|----------------|
| 6.1 | Login as Client → `/client/bookings/[id]` | Booking detail loads |
| 6.2 | See “Awaiting your approval” (or equivalent) | Approve + Dispute actions visible |
| 6.3 | Click **Approve** | Status → completed; escrow released; no double release on double-click |
| **DB check** | — | `credit_ledger` row `reason = escrow_release`; `cleaner_earnings.status = available` |
| 6.4 | Cleaner: go to earnings | Available payout increased |

---

## Test 7 — Cleaner payout

| Step | Action | Pass criteria |
|------|--------|----------------|
| 7.1 | Cleaner → `/cleaner/earnings` → Request Payout | Stripe transfer created; payout row created |
| 7.2 | Idempotency | Duplicate request does not create second transfer |
| **DB check** | — | `cleaner_earnings.status = paid`; payout row exists |

---

## Test 8 — Dispute flow (critical)

| Step | Action | Pass criteria |
|------|--------|----------------|
| 8.1 | Create a **new** booking; complete as cleaner; do **not** approve as client | Job in `awaiting_approval` |
| 8.2 | As Client: open booking detail → **Open dispute** (or go to dispute form) | Dispute form loads |
| 8.3 | Submit dispute (reason + details) | Status → disputed; dispute row created; cleaner earnings held |
| 8.4 | Login as Admin → `/admin/disputes` | Dispute appears |
| 8.5 | Resolve with **partial refund** (or full refund) | Refund ledger entry; credits returned to client; cleaner earnings adjusted; audit log |
| **DB check** | — | Ledger balanced; no double refund |

---

## Test 9 — Failure / edge cases

| Test | Action | Expected |
|------|--------|----------|
| Double Approve | Double-click Approve | No double release of escrow |
| Double Payout | Request payout twice in quick succession | No double transfer (idempotency) |
| Dispute window | Submit dispute after SLA window (if enforced) | Blocked with message |
| Invalid transition | e.g. try to approve already-completed job | 400 or equivalent |

If any of these fail → do not launch.

---

## Final system validation

**Launch ready only if:**

- Ledger always balances  
- No double charges  
- No double payouts  
- Status machine never breaks  
- Escrow always reconciles  
- Dispute resolution is deterministic  
- Cleaner cannot get paid before client approval  

**If all tests pass:** Revenue safety, escrow integrity, payout safety, dispute protection, admin control, idempotency coverage = marketplace-launch safe.

---

*Use with Deliverable C (Money Flow Contract) and Deliverable D (Integration Audit Plan) for full alignment.*
