# Deliverable D — Full Integration Audit Plan (Step-by-Step Testing Order)

This plan defines **in what order** to verify frontend ↔ backend integration so that dependencies are tested first and money flows are validated in a single pass. Use with **Deliverable B.1 (60-Minute QA Script)** for execution.

**Related docs:** Build Matrix (Deliverable A), Top 20 Screens (Deliverable B), Money Flow Contract (Deliverable C).

---

## Principles

1. **Auth first** — No screen is valid without login + role + token.
2. **Money flows in one direction** — Credits → Escrow → Approval/Dispute → Payout. Test in that order.
3. **One role at a time** — Complete Client path, then Cleaner path, then Admin path, then cross-role.
4. **Failure before success** — Where useful, test 400/blocked behavior before happy path (e.g. insufficient credits, double approve).

---

## Phase 0 — Environment and auth (≈10 min)

| Order | What to verify | How | Pass criteria |
|-------|----------------|-----|---------------|
| 0.1 | API base URL and health | Call backend health/status | 200, no CORS issues |
| 0.2 | Client login | POST /auth/login → GET /auth/me | JWT stored; role = client; redirect to /client/dashboard |
| 0.3 | Cleaner login | Same with cleaner account | Redirect to /cleaner/dashboard |
| 0.4 | Admin login | Same with admin account | Redirect to /admin |
| 0.5 | Protected routes | Access /client/* as cleaner | Redirect or 403 as designed |
| 0.6 | Token refresh / expiry | (Optional) expire token, retry request | 401 and redirect to login |

---

## Phase 1 — Client money entry and booking (≈15 min)

| Order | What to verify | Screen / endpoint | Pass criteria |
|-------|----------------|-------------------|----------------|
| 1.1 | Credits balance (empty) | /client/credits | GET /credits/balance; show 0 or current |
| 1.2 | Buy credits | /client/credits → purchase | POST (checkout/credits) with Idempotency-Key; balance increases; ledger entry |
| 1.3 | Ledger display | /client/credits (ledger section) | GET /credits/ledger; entries match DB |
| 1.4 | Search cleaners | /search | GET /cleaners/search; filters map to params |
| 1.5 | Cleaner profile | /cleaner/[id] | GET /cleaners/:id, reviews; tier/reliability if available |
| 1.6 | Booking estimate | /booking (stepper) | POST /bookings/estimate or draft; amount shown |
| 1.7 | Create booking (escrow) | /booking → confirm | POST /bookings with Idempotency-Key; balance − held; booking created |
| 1.8 | Booking confirmation | /booking/confirm/[id] | GET /bookings/:id; show “held” + buffer if available |
| 1.9 | Bookings list | /client/bookings | GET /bookings/me; new booking appears |

---

## Phase 2 — Cleaner execution loop (≈15 min)

| Order | What to verify | Screen / endpoint | Pass criteria |
|-------|----------------|-------------------|----------------|
| 2.1 | Job feed | /cleaner/jobs/requests (or feed) | Job from 1.7 appears; GET jobs/me or equivalent |
| 2.2 | Accept job | Accept on feed | POST /jobs/:id/transition; status → accepted |
| 2.3 | Job detail | /cleaner/jobs/[id] (or workflow) | GET /jobs/:id/details; address, notes |
| 2.4 | Check-in (GPS) | Check-in action | POST /jobs/:id/check-in or /tracking/:id/check-in; inside radius succeeds; outside blocked if enforced |
| 2.5 | Before photos | Upload before | Upload flow (sign + put + commit); min 1; timeline event if applicable |
| 2.6 | After photos | Upload after | Same; min 1 |
| 2.7 | Complete job | Complete / submit | Status → awaiting_approval; earnings pending/held, not available |

---

## Phase 3 — Client approval and dispute (≈15 min)

| Order | What to verify | Screen / endpoint | Pass criteria |
|-------|----------------|-------------------|----------------|
| 3.1 | Booking detail (awaiting) | /client/bookings/[id] | Status awaiting_approval; Approve + Dispute visible |
| 3.2 | Approve (happy path) | Click Approve | POST /jobs/:id/approve; status → completed; escrow release; ledger; earnings available |
| 3.3 | Cleaner earnings | /cleaner/earnings | Available balance increased; GET /cleaner/earnings, /cleaner/payouts |
| 3.4 | Payout request | Request payout | POST /payouts/request; Idempotency-Key; no double payout |
| 3.5 | **New booking** (for dispute) | Repeat 1.6–1.8, 2.1–2.7 | Second job in awaiting_approval |
| 3.6 | Dispute form | /client/job/[id]/dispute (or inline) | Reason + details; POST dispute endpoint |
| 3.7 | Dispute created | — | Job status disputed; earnings held |
| 3.8 | Admin disputes | /admin/disputes | GET disputes; new dispute visible |
| 3.9 | Resolve dispute | Resolve with refund | POST resolve endpoint; refund ledger; client balance; audit |

---

## Phase 4 — Admin and secondary screens (≈10 min)

| Order | What to verify | Screen / endpoint | Pass criteria |
|-------|----------------|-------------------|----------------|
| 4.1 | Admin dashboard | /admin/dashboard | GET /admin/dashboard/realtime or equivalent |
| 4.2 | Admin bookings | /admin/bookings | GET /admin/bookings; filters; link to detail |
| 4.3 | Admin users | /admin/users | GET /admin/users; PATCH status/role if used |
| 4.4 | Admin finance | /admin/finance | Payout list; retry visibility if applicable |
| 4.5 | Client billing | /client/billing | GET /client/invoices |
| 4.6 | Live appointment (optional) | /client/appointments/[id]/live | GET live-status; timer/held if implemented |

---

## Phase 5 — Regression and edge cases (≈10 min)

| Order | What to verify | How | Pass criteria |
|-------|----------------|-----|---------------|
| 5.1 | Double approve | Same job approve twice | Second request blocked or idempotent; no double release |
| 5.2 | Double payout | Two payout requests | Second blocked or idempotent |
| 5.3 | Cancel booking | Cancel from list/detail | POST cancel; status cancelled; escrow reversed if applicable |
| 5.4 | Insufficient credits | Create booking with balance &lt; cost | 400; no booking created |
| 5.5 | Ledger balance | After a full loop | Sum(ledger deltas) = current_balance (see Deliverable C) |

---

## Suggested test run order (single 60-minute pass)

1. **Phase 0** — Auth (all three roles).  
2. **Phase 1** — Client: credits → search → booking → confirm → list.  
3. **Phase 2** — Cleaner: feed → accept → detail → check-in → before/after photos → complete.  
4. **Phase 3** — Client: booking detail → approve → Cleaner: earnings → payout.  
5. **Phase 3 (dispute)** — New booking → complete as cleaner → Client: dispute → Admin: resolve.  
6. **Phase 4** — Admin screens + client billing + live (if time).  
7. **Phase 5** — Double approve, double payout, cancel, insufficient credits, ledger check.

---

## Sign-off checklist

- [ ] Phase 0: All roles login and redirect correctly.  
- [ ] Phase 1: Credits purchase and booking create with correct escrow and ledger.  
- [ ] Phase 2: Cleaner can accept, check-in, upload photos, complete (with backend enforcement).  
- [ ] Phase 3: Client can approve; earnings become available; payout works; dispute and resolve work.  
- [ ] Phase 4: Admin can see disputes, bookings, users, finance.  
- [ ] Phase 5: No double charge, no double payout; ledger balances.

When all are checked, the integration audit is complete for launch readiness.

---

*Use with **Deliverable B.1** for the exact click-through script and **Deliverable C** for money contract details.*
