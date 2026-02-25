# Deliverable B — Top 20 Screens Required For Launch + All Screens Already Built

Execution-grade reference. For each screen: **Route**, **Role**, **Why required**, **Status**, **What must be added to ship**, **Backend dependency**.  
Then: **All other screens already built** (full picture).

**Status legend:** ✅ Built and wired | 🟡 Built but incomplete or unverified | ❌ Not built

---

# Part 1 — Build Matrix Summary (Deliverable A reference)

| Area | Critical blockers | Priority |
|------|-------------------|----------|
| **Auth** | JWT persistence + role redirect | P0 |
| **Client** | Approval block, dispute form, escrow visibility, credits idempotency | P0 |
| **Cleaner** | GPS/photo enforcement, Stripe gating, earnings correctness | P0 |
| **Admin** | Dispute resolve (partial refund), payout visibility | P0 |

---

# Part 2 — Top 20 Screens Required For Launch

## P0 = Launch blockers (must work end-to-end)

### 1) Login

| Field | Value |
|-------|--------|
| **Route** | `/auth/login` |
| **Role** | All |
| **Why required** | Entry for all roles; token + role drive redirect. |
| **Status** | ✅ Built |
| **To ship** | Hard-test JWT persistence (localStorage key), role redirect to `/client/dashboard`, `/cleaner/dashboard`, `/admin`. Confirm 401 handling and login error UX (no double overlay). |
| **Backend** | `POST /auth/login`, `GET /auth/me` |

---

### 2) Register

| Field | Value |
|-------|--------|
| **Route** | `/auth/register` |
| **Role** | All |
| **Why required** | Client and cleaner sign-up. |
| **Status** | ✅ Built |
| **To ship** | Confirm email uniqueness handling, password rules, error states, role selection. |
| **Backend** | `POST /auth/register` |

---

### 3) Client Dashboard

| Field | Value |
|-------|--------|
| **Route** | `/client/dashboard` |
| **Role** | Client |
| **Why required** | Home after login; bookings snapshot + wallet + “Book a Cleaner”. |
| **Status** | ✅ Built |
| **To ship** | Ensure real data (no mock): `GET /bookings/me`, `GET /client/dashboard/insights`. Wallet/credits snapshot accurate. |
| **Backend** | `GET /bookings/me`, `GET /client/dashboard/insights` |
| **Objects** | User, Booking |

---

### 4) Cleaner Search

| Field | Value |
|-------|--------|
| **Route** | `/search` |
| **Role** | Client / Public |
| **Why required** | Find cleaners before booking. |
| **Status** | ✅ Built |
| **To ship** | Confirm filter/sort params match backend (`GET /cleaners/search`). Empty states. |
| **Backend** | `GET /cleaners/search` |
| **Objects** | CleanerProfile |

---

### 5) Cleaner Public Profile

| Field | Value |
|-------|--------|
| **Route** | `/cleaner/[id]` |
| **Role** | Client / Public |
| **Why required** | Trust + rate clarity before booking. |
| **Status** | 🟡 Built |
| **To ship** | Surface tier badge + reliability (ring/score) + rate clarity prominently. |
| **Backend** | `GET /cleaners/:id`, `GET /cleaners/:id/reviews`, `GET /cleaners/:id/reliability` |

---

### 6) Booking Flow (Stepper)

| Field | Value |
|-------|--------|
| **Route** | `/booking` |
| **Role** | Client |
| **Why required** | Create booking + hold credits. |
| **Status** | ✅ Built |
| **To ship** | Confirm estimate → create booking → escrow hold is real. Handle hold failure and low-balance. |
| **Backend** | `POST /bookings/estimate`, `POST /bookings`, `POST /client/bookings/draft` |
| **Objects** | Booking |

---

### 7) Booking Confirmation

| Field | Value |
|-------|--------|
| **Route** | `/booking/confirm/[id]` |
| **Role** | Client |
| **Why required** | Post-booking clarity; “held credits + buffer” sets expectations. |
| **Status** | 🟡 Built |
| **To ship** | Show “held credits + buffer” and status timeline start clearly. |
| **Backend** | `GET /bookings/:id` |

---

### 8) Client Booking Detail (core screen)

| Field | Value |
|-------|--------|
| **Route** | `/client/bookings/[id]` |
| **Role** | Client |
| **Why required** | Single place for timeline, before/after, cancel, and (when applicable) approve/dispute. |
| **Status** | ✅ Built, **missing approval/dispute block** |
| **To ship** | Add **Approve** + **Dispute** block when `status === 'awaiting_approval'` (or link to `/client/job/[jobId]` for full review). Show escrow/held credits. Live updates (polling/WS). |
| **Backend** | `GET /bookings/:id`, `GET /jobs/:id/details`, `GET /tracking/:id`, `POST /bookings/:id/cancel` |
| **Objects** | JobDetailsDTO, TrackingState |

---

### 9) Client Live Appointment View

| Field | Value |
|-------|--------|
| **Route** | `/client/appointments/[bookingId]/live` |
| **Role** | Client |
| **Why required** | “Job in progress” experience. |
| **Status** | 🟡 Built |
| **To ship** | Timer + held credits + top-up prompt when balance low. Confirm polling vs WebSocket. |
| **Backend** | `GET /client/jobs/:id/live-status`, tracking endpoints |

---

### 10) Client Approve Job (embedded in booking detail)

| Field | Value |
|-------|--------|
| **Route** | Component inside `/client/bookings/[id]` **or** full page `/client/job/[jobId]` |
| **Role** | Client |
| **Why required** | Release funds; revenue-critical. |
| **Status** | ✅ **Full flow built at `/client/job/[jobId]`** (timeline, before/after slider, Approve CTA). **Missing on `/client/bookings/[id]`**. |
| **To ship** | Either: (1) Add Approve CTA + final charge card to `/client/bookings/[id]` when `awaiting_approval`, or (2) Route client from bookings list to `/client/job/[jobId]` for review. Unify so one path is canonical. |
| **Backend** | `POST /jobs/:id/approve` |

---

### 11) Client Dispute Job (embedded + form)

| Field | Value |
|-------|--------|
| **Route** | `/client/job/[jobId]/dispute` (form) + entry from booking detail or job review |
| **Role** | Client |
| **Why required** | Dispute intake; admin can then resolve. |
| **Status** | ✅ **Built** at `/client/job/[jobId]/dispute` (reason picker + details + submit). |
| **To ship** | Ensure `/client/bookings/[id]` links to dispute (e.g. “Open dispute” → `/client/job/[jobId]/dispute`). Optional: client photo upload for dispute. “What happens next” + expected response time. |
| **Backend** | `POST /jobs/:id/dispute` (or `POST /tracking/:jobId/dispute` per backend) |

---

### 12) Cleaner Onboarding (gate payouts)

| Field | Value |
|-------|--------|
| **Route** | `/cleaner/onboarding` |
| **Role** | Cleaner |
| **Why required** | Stripe Connect; must gate job acceptance until payouts enabled. |
| **Status** | ✅ Built |
| **To ship** | Require Stripe Connect completion (`payouts_enabled`) before allowing job accept. Block job feed / accept if not onboarded. |
| **Backend** | Stripe Connect endpoints, `stripe_connect_accounts` |

---

### 13) Cleaner Job Requests (job feed)

| Field | Value |
|-------|--------|
| **Route** | `/cleaner/jobs/requests` |
| **Role** | Cleaner |
| **Why required** | See and accept available jobs. |
| **Status** | ✅ Built |
| **To ship** | Accept job reliably (`POST /jobs/:id/transition`), refresh feed, show job distance/time. |
| **Backend** | Job feed endpoint, `POST /jobs/:id/transition` |

---

### 14) Cleaner Job Detail (execution hub)

| Field | Value |
|-------|--------|
| **Route** | `/cleaner/jobs/[id]` |
| **Role** | Cleaner |
| **Why required** | Check-in, photos, transitions. |
| **Status** | ✅ Built |
| **To ship** | Enforce step order: GPS check-in (radius), required before/after photos (min counts), then complete. Align with backend `GPS_CHECKIN_RADIUS_METERS`, `MIN_BEFORE_PHOTOS`, `MIN_AFTER_PHOTOS`. |
| **Backend** | `POST /jobs/:id/check-in`, `POST /jobs/:id/photos` (or signed upload + commit), `POST /jobs/:id/transition`, `GET /jobs/:id/details` |

---

### 15) Cleaner Earnings Dashboard

| Field | Value |
|-------|--------|
| **Route** | `/cleaner/earnings` |
| **Role** | Cleaner |
| **Why required** | Available vs pending vs held; request payout. |
| **Status** | ✅ Built |
| **To ship** | Ensure “available vs pending vs held” matches payout worker. Verify payout request and next payout date. |
| **Backend** | `GET /cleaner/earnings`, `GET /cleaner/payouts`, `POST /payouts/request` |

---

### 16) Admin Disputes Queue

| Field | Value |
|-------|--------|
| **Route** | `/admin/disputes` |
| **Role** | Admin |
| **Why required** | Triage and resolve disputes. |
| **Status** | ✅ Built |
| **To ship** | Filters, evidence viewer (job details/photos), resolve with **partial refund amount** input. |
| **Backend** | `GET /admin/disputes` (or jobs filtered by disputed) |

---

### 17) Admin Resolve Dispute (modal/page)

| Field | Value |
|-------|--------|
| **Route** | Inside `/admin/disputes` |
| **Role** | Admin |
| **Why required** | Refund credits OR release to cleaner; audit. |
| **Status** | 🟡 Built (resolve flow present) |
| **To ship** | Enforce outcomes: refund amount (partial), release to cleaner, audit log. Confirm endpoint (e.g. `POST /admin/disputes/:id/resolve` or `POST /admin/jobs/:jobId/resolve-dispute`). |
| **Backend** | `POST /admin/disputes/:id/resolve` or `POST /admin/jobs/:jobId/resolve-dispute` |

---

## P1 = Strongly recommended for launch

### 18) Client Credits Wallet

| Field | Value |
|-------|--------|
| **Route** | `/client/credits` |
| **Role** | Client |
| **Why required** | Buy credits; ledger; low-balance cues. |
| **Status** | 🟡 Built |
| **To ship** | Purchase credits with **idempotency key** on all money endpoints. Ledger display, low-balance cues. |
| **Backend** | `GET /credits/balance`, `GET /credits/ledger`, `POST /payments/credits` (or equivalent) |

---

### 19) Client Bookings List

| Field | Value |
|-------|--------|
| **Route** | `/client/bookings` |
| **Role** | Client |
| **Why required** | Upcoming/past; entry to booking detail. |
| **Status** | ✅ Built |
| **To ship** | Tabs (All / Upcoming / Completed / Cancelled), link to `/client/bookings/[id]` (and to `/client/job/[jobId]` for review when awaiting_approval if that’s the canonical review path). |
| **Backend** | `GET /bookings/me` |

---

### 20) Admin Bookings / Jobs Table

| Field | Value |
|-------|--------|
| **Route** | `/admin/bookings` |
| **Role** | Admin |
| **Why required** | Search, filter, status, audit. |
| **Status** | ✅ Built |
| **To ship** | Search/filter/status tools, deep link to job/booking detail, audit trail. |
| **Backend** | `GET /admin/bookings`, admin status endpoints |

---

# Part 3 — Other Screens Already Built (full picture)

All routes that exist in the repo, with role, status, and what’s needed to ship. **Not all are required for launch** but are part of the current build.

## Auth & entry

| Route | Role | Status | To ship / note |
|-------|------|--------|-----------------|
| `/auth` | All | ✅ | Entry/redirect |
| `/auth/forgot-password` | All | ✅ | Reset request |
| `/auth/reset-password` | All | ✅ | Set new password (token) |
| `/auth/verify-email` | All | ✅ | Verify signup email |
| `/` (Landing) | Public | ✅ | Optional: hero role selector (Client vs Cleaner) |

## Client (existing + scaffold)

| Route | Role | Status | To ship / note |
|-------|------|--------|-----------------|
| `/client/dashboard` | Client | ✅ | Real data; see Top 20 #3 |
| `/client/bookings` | Client | ✅ | See Top 20 #19 |
| `/client/bookings/[id]` | Client | 🟡 | Add approval/dispute block or link; see Top 20 #8, #10 |
| `/client/address` | Client | ✅ | Address capture (Places later); scaffold |
| `/client/job/[jobId]` | Client | ✅ | Full review: timeline, before/after slider, Approve + Dispute; scaffold |
| `/client/job/[jobId]/dispute` | Client | ✅ | Dispute form; scaffold |
| `/client/appointments/[bookingId]/live` | Client | 🟡 | Timer, held credits; see Top 20 #9 |
| `/client/appointments/[bookingId]/live-trust` | Client | 🟡 | Trust/live variant |
| `/client/credits` | Client | 🟡 | Idempotency, ledger; see Top 20 #18 |
| `/client/credits-trust` | Client | 🟡 | Credits + trust |
| `/client/billing` | Client | ✅ | Invoices |
| `/client/billing-trust` | Client | 🟡 | Billing + trust |
| `/client/settings` | Client | ✅/🟡 | Profile, payment methods, addresses, notifications |
| `/client/support` | Client | ✅ | Help, dispute entry (email), contact |
| `/client/recurring` | Client | 🟡 | Recurring bookings |

## Client – shared / public

| Route | Role | Status | To ship / note |
|-------|------|--------|-----------------|
| `/search` | Client/Public | ✅ | See Top 20 #4 |
| `/booking` | Client | ✅ | See Top 20 #6 |
| `/booking/confirm/[id]` | Client | 🟡 | See Top 20 #7 |
| `/cleaner/[id]` | Public | 🟡 | See Top 20 #5; tier + reliability |
| `/favorites` | Client | ✅ | Not launch blocker |
| `/reviews` | Client | ✅/🟡 | Write review |
| `/messages` | Client | 🟡 | Realtime depends on backend |
| `/notifications` | All | ✅/🟡 | List + prefs |

## Cleaner (existing + scaffold)

| Route | Role | Status | To ship / note |
|-------|------|--------|-----------------|
| `/cleaner/dashboard` | Cleaner | ✅/🟡 | Real earnings/jobs; see Top 20 |
| `/cleaner/map` | Cleaner | ✅ | Next job map + “Start workflow”; scaffold |
| `/cleaner/job/[jobId]/workflow` | Cleaner | ✅ | Stepper: en route → check-in → before → clean → after → submit; scaffold |
| `/cleaner/job/[jobId]/upload` | Cleaner | ✅ | Before/after upload; scaffold |
| `/cleaner/wallet` | Cleaner | ✅ | Weekly/instant payout, request payout; scaffold (basic); align with earnings |
| `/cleaner/jobs/requests` | Cleaner | ✅ | See Top 20 #13 |
| `/cleaner/jobs/[id]` | Cleaner | ✅ | See Top 20 #14 |
| `/cleaner/earnings` | Cleaner | ✅ | See Top 20 #15 |
| `/cleaner/onboarding` | Cleaner | ✅ | See Top 20 #12; gate on Stripe |
| `/cleaner/profile` | Cleaner | 🟡 | Rate/tier sliders still missing |
| `/cleaner/availability` | Cleaner | ✅/🟡 | Availability UI |
| `/cleaner/calendar` | Cleaner | 🟡 | Calendar view |
| `/cleaner/progress` | Cleaner | 🟡 | Progress/recovery |
| `/cleaner/progress/level/[levelNumber]` | Cleaner | 🟡 | Level detail |
| `/cleaner/stats` | Cleaner | 🟡 | Stats |
| `/cleaner/maintenance` | Cleaner | 🟡 | Maintenance |
| `/cleaner/badges` | Cleaner | 🟡 | Badges |
| `/cleaner/goals` | Cleaner | 🟡 | Goals list |
| `/cleaner/goals/[goalId]` | Cleaner | 🟡 | Goal detail |
| `/cleaner/reviews` | Cleaner | ✅ | My reviews |
| `/cleaner/rewards` | Cleaner | 🟡 | Rewards |
| `/cleaner/leaderboard` | Cleaner | 🟡 | Leaderboard |
| `/cleaner/team` | Cleaner | 🟡 | Team |
| `/cleaner/certifications` | Cleaner | 🟡 | Certifications |
| `/cleaner/ai-assistant/*` | Cleaner | 🟡 | AI assistant (multiple sub-routes) |

## Admin

| Route | Role | Status | To ship / note |
|-------|------|--------|-----------------|
| `/admin` | Admin | ✅ | Entry |
| `/admin/dashboard` | Admin | 🟡 | Realtime metrics; see Top 20 |
| `/admin/bookings` | Admin | ✅ | See Top 20 #20 |
| `/admin/disputes` | Admin | ✅ | See Top 20 #16, #17 |
| `/admin/finance` | Admin | ✅/🟡 | Payout visibility, retry; see Build Matrix |
| `/admin/users` | Admin | ✅ | See Top 20 |
| `/admin/analytics` | Admin | 🟡 | Analytics |
| `/admin/settings` | Admin | 🟡 | Settings |
| `/admin/risk` | Admin | 🟡 | Risk |
| `/admin/communication` | Admin | 🟡 | Communication |
| `/admin/id-verifications` | Admin | 🟡 | ID verification queue |
| `/admin/reports` | Admin | 🟡 | Reports |
| `/admin/gamification` | Admin | 🟡 | Gamification config |
| `/admin/gamification/*` | Admin | 🟡 | Goals, rewards, choices, abuse, governor, flags |
| `/admin/support/cleaner/[cleanerId]/gamification` | Admin | 🟡 | Cleaner gamification support |
| `/admin/tools/*` | Admin | 🟡 | Many tool pages (no notification test panel yet) |

## Public / legal / help

| Route | Role | Status | To ship / note |
|-------|------|--------|-----------------|
| `/help` | Public | ✅ | Help center |
| `/help/category/[categoryId]` | Public | ✅ | Help category |
| `/terms` | Public | ✅ | Terms of Service |
| `/privacy` | Public | ✅ | Privacy Policy |
| `/cookies` | Public | ✅ | Cookie Policy |
| `/referral` | User | ✅ | Referral |
| `/api-test` | Dev | ✅ | API test page |
| `/demo/trust` | Dev | 🟡 | Demo trust |
| `/dashboard` | ? | ✅ | Generic dashboard |
| `/day3` | Dev | 🟡 | Dev page |

---

# Part 4 — Critical Integration Blockers (recap)

These must be solved before launch:

1. **Client approval flow** — Approve CTA when `awaiting_approval` (on `/client/bookings/[id]` or canonical `/client/job/[jobId]`).
2. **Dispute submission form** — ✅ Built at `/client/job/[jobId]/dispute`; ensure entry from main booking detail.
3. **Escrow visibility** — Held vs available credits clear on booking detail and confirmation.
4. **Cleaner Stripe onboarding gating** — Block job accept until `payouts_enabled`.
5. **Earnings status correctness** — Available vs pending vs held matches backend/payout worker.
6. **Idempotency header** on ALL money endpoints (credits purchase, payout request, etc.).

---

# Part 5 — Safe for Later (not launch blockers)

- Notification preferences UI polish  
- KPI visual polish  
- Gamification education screens  
- PWA install assets  
- Admin notification test panel  
- Favorites, messages polish  
- Cleaner AI assistant polish  
- Admin tools polish  

---

# Part 6 — Launch Readiness (honest)

- **Backend:** ~90% marketplace-ready (per Build Matrix).  
- **Frontend UI scaffolding:** ~75% (most screens exist).  
- **Frontend live integration completeness:** ~55–65%.  

The missing ~30% is the **revenue-critical** 30%: approval block on main booking detail, escrow/credits clarity, Stripe gating, earnings correctness, idempotency.

**Next deliverables (optional):**  
- **Deliverable C:** Money Flow Contract Checklist  
- **Deliverable D:** Full Integration Audit Plan (step-by-step testing order)
