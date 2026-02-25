# 60-Minute Integration Run Sheet

**One pass, one checklist.** Run in order. Tick each box as you pass.  
Use with [DELIVERABLE_D_FULL_INTEGRATION_AUDIT_PLAN.md](./DELIVERABLE_D_FULL_INTEGRATION_AUDIT_PLAN.md) and [DELIVERABLE_C_MONEY_FLOW_CONTRACT_CHECKLIST.md](./DELIVERABLE_C_MONEY_FLOW_CONTRACT_CHECKLIST.md) for details.

**How to run:** (1) Start backend and frontend (`npm run dev` → app at http://localhost:3001). (2) Use 3 browser sessions or devices: Client, Cleaner, Admin. (3) Work through Phase 0 → 5; check each box as you pass.

**Pre-test:** 1 Client, 1 Cleaner, 1 Admin. Stripe test mode. Test card: `4242 4242 4242 4242`. Cleaner: Stripe Connect complete. Client: start at 0 credits.

---

## Phase 0 — Auth (≈10 min)

- [ ] **0.1** Backend health/status returns 200, no CORS issues
- [ ] **0.2** Client login → JWT stored, redirect to `/client/dashboard`
- [ ] **0.3** Cleaner login → redirect to `/cleaner/dashboard`
- [ ] **0.4** Admin login → redirect to `/admin`
- [ ] **0.5** As Cleaner, open `/client/dashboard` → redirect or 403 as designed
- [ ] **0.6** (Optional) Expire token, retry request → 401 and redirect to login

---

## Phase 1 — Client money entry + booking (≈15 min)

- [ ] **1.1** As Client: `/client/credits` → balance shows (0 or current); GET /credits/balance works
- [ ] **1.2** Buy credits (Stripe) → balance increases; ledger shows purchase; Idempotency-Key sent
- [ ] **1.3** Ledger section on credits page → entries match; GET /credits/ledger works
- [ ] **1.4** `/search` → cleaners load; filters map to backend params
- [ ] **1.5** Open a cleaner profile `/cleaner/[id]` → profile + reviews load
- [ ] **1.6** `/booking` → complete stepper to estimate; amount shown
- [ ] **1.7** Confirm booking → POST /bookings; balance decreases (held); booking created; no double hold
- [ ] **1.8** `/booking/confirm/[id]` → shows “held” + buffer if available
- [ ] **1.9** `/client/bookings` → new booking appears in list

---

## Phase 2 — Cleaner execution loop (≈15 min)

- [ ] **2.1** As Cleaner: job feed (e.g. `/cleaner/jobs/requests`) → job from 1.7 appears
- [ ] **2.2** Accept job → POST /jobs/:id/transition; status → accepted
- [ ] **2.3** Open job detail `/cleaner/jobs/[id]` (or workflow) → address, notes load
- [ ] **2.4** Check-in (GPS) → inside radius succeeds; outside radius blocked if enforced
- [ ] **2.5** Upload ≥1 **before** photo → accepted; timeline event if applicable
- [ ] **2.6** Upload ≥1 **after** photo → accepted
- [ ] **2.7** Complete / submit job → status → `awaiting_approval`; earnings pending/held, **not** available

---

## Phase 3 — Approval + dispute + payout (≈15 min)

- [ ] **3.1** As Client: `/client/bookings/[id]` → status “Awaiting your approval”; **Approve** + **Open dispute** visible
- [ ] **3.2** Click **Approve** → POST /tracking/:jobId/approve; status → completed; escrow released; no double release on double-click
- [ ] **3.3** As Cleaner: `/cleaner/earnings` → available balance increased
- [ ] **3.4** Request payout → POST /payouts/request; Idempotency-Key; no duplicate payout
- [ ] **3.5** **New booking:** repeat 1.6–1.8 and 2.1–2.7 → second job in `awaiting_approval`
- [ ] **3.6** As Client: **Open dispute** (or `/client/job/[id]/dispute`) → submit reason + details (POST /tracking/:jobId/dispute)
- [ ] **3.7** Dispute created → job status disputed; earnings held
- [ ] **3.8** As Admin: `/admin/disputes` → new dispute visible
- [ ] **3.9** Resolve dispute (e.g. partial refund) → refund ledger; client balance updated; audit log

---

## Phase 4 — Admin + secondary (≈10 min)

- [ ] **4.1** `/admin/dashboard` → realtime/metrics load
- [ ] **4.2** `/admin/bookings` → list + filters + link to detail
- [ ] **4.3** `/admin/users` → list; PATCH status/role if used
- [ ] **4.4** `/admin/finance` → payout list (retry visibility if applicable)
- [ ] **4.5** As Client: `/client/billing` → invoices load
- [ ] **4.6** (Optional) `/client/appointments/[id]/live` → live-status; timer/held if implemented

---

## Phase 5 — Regression / edge cases (≈10 min)

- [ ] **5.1** Double approve same job → second request blocked or idempotent; no double escrow release
- [ ] **5.2** Double payout request → second blocked or idempotent
- [ ] **5.3** Cancel a booking (from list or detail) → POST cancel; status cancelled; escrow reversed if applicable
- [ ] **5.4** Try to create booking with balance &lt; cost → 400; no booking created
- [ ] **5.5** Ledger balance check: sum(ledger deltas) = current_balance (see Deliverable C)

---

## Sign-off (launch readiness)

**You are launch-ready only if all are checked:**

- [ ] **Phase 0:** All roles login and redirect correctly
- [ ] **Phase 1:** Credits purchase and booking create with correct escrow and ledger
- [ ] **Phase 2:** Cleaner can accept, check-in, upload photos, complete (with backend enforcement)
- [ ] **Phase 3:** Client can approve; earnings become available; payout works; dispute and resolve work
- [ ] **Phase 4:** Admin can see disputes, bookings, users, finance
- [ ] **Phase 5:** No double approve/payout; cancel and insufficient-credits behave correctly; ledger balances

---

**Suggested 60-minute run order:** Do Phase 0 → 1 → 2 → 3 (approve + payout) → 3 (dispute: new booking, dispute, admin resolve) → 4 → 5.
