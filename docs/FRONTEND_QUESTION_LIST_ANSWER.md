# Frontend Question List — Answers & Build Checklist

This document answers the **question list for the frontend** (routing, pages, assets, API contract) and maps each item to the **current codebase**: ✅ exists, 🟡 partial, ❌ to build. Use it to decide what pages/assets to build next.

---

## 1. App routing + navigation

### What are the top-level areas: Client app, Cleaner app, Admin app (3 separate navs)?

**Answer:** Yes. Three role-based areas with separate nav:

| Area | Entry routes | Nav |
|------|----------------|-----|
| **Client app** | `/client/dashboard`, `/client/bookings`, `/client/settings`, `/search`, `/booking`, `/favorites`, `/messages`, `/client/credits`, `/client/billing`, `/client/support` | Header (Find a Cleaner, My Bookings, Home); BottomNav on mobile (Home, Bookings, Messages, Profile) |
| **Cleaner app** | `/cleaner/dashboard`, `/cleaner/calendar`, `/cleaner/jobs/*`, `/cleaner/earnings`, `/cleaner/profile`, `/cleaner/availability`, `/cleaner/progress`, `/cleaner/ai-assistant`, etc. | Header (My Dashboard, Progress, Home); BottomNav (Home, Calendar, Messages, Profile) |
| **Admin app** | `/admin`, `/admin/dashboard`, `/admin/users`, `/admin/bookings`, `/admin/disputes`, `/admin/finance`, `/admin/gamification`, etc. | Header (Admin Panel, Gamification, Home). No BottomNav on admin. |

Shared: `/`, `/search`, `/auth/*`, `/help`, `/terms`, `/privacy`, `/cookies`. Role is from `AuthContext`; `ProtectedRoute` and `roleRouting` enforce access.

### What’s the default landing after login for each role?

| Role | Default after login |
|------|---------------------|
| **Client** | `/client/dashboard` |
| **Cleaner** | `/cleaner/dashboard` |
| **Admin** | `/admin` (or `/admin/dashboard`) |

Set in `ROLE_DASHBOARDS` in `src/lib/roleRouting.ts` and in the login page redirect after `login(formData)`.

---

## 2. Client pages (minimum) — status

| Page | Route(s) | Status | Notes |
|------|----------|--------|-------|
| **Home / search cleaners** (filters, sorting, availability) | `/search`, `/client/dashboard` | ✅ | Search: filters sidebar, sort, list/map toggle, CleanerCard grid, pagination. Dashboard: overview + “Book a Cleaner” → search. |
| **Cleaner profile page** (reliability, rates, badges, reviews, photos) | `/cleaner/[id]` | 🟡 | Public profile; reliability from `reliabilityService`. Tier badge / reliability ring could be more prominent; reviews from `/cleaners/:id/reviews`. |
| **Booking flow** (type, hours, estimate, hold credits) | `/booking` | ✅ | 4-step stepper: date/time + service + duration, cleaner summary + estimate, address, review. Draft save, price estimate. |
| **Checkout / buy credits** (packs, promo, receipt) | `/client/credits`, `/booking/confirm/[id]` | 🟡 | Credits page exists; checkout/packs/promo depend on backend. Confirmation after booking. Receipt/invoice: `/client/billing` has InvoiceTable. |
| **Upcoming job details** (status timeline, contact, cancel/reschedule) | `/client/bookings/[id]` | ✅ | JobDetailsTracking (timeline rail, before/after, presence, ledger), cancel, Add to Calendar, link to messages. Reschedule: not a dedicated flow. |
| **Job in progress** (timer, held credits, top-up modal) | `/client/bookings/[id]`, `/client/appointments/[bookingId]/live` | 🟡 | Live view: stepper, GPS panel, next action. Timer/held credits/top-up modal: partial or not surfaced. |
| **Approval + review** (approve/dispute + final charge + refund tag) | `/client/bookings/[id]`, `/reviews` | 🟡 | Before/after and status shown; **no dedicated Approve/Dispute CTAs** when status = `awaiting_approval`. Review: `/reviews`. Need: approval block + client dispute form. |
| **Wallet / transactions history** | `/client/credits`, `/client/billing` | ✅ | Credits balance; billing with InvoiceTable. Ledger/transactions: credits and billing endpoints. |

---

## 3. Cleaner pages (minimum) — status

| Page | Route(s) | Status | Notes |
|------|----------|--------|-------|
| **Cleaner onboarding** (profile, availability, service area, Stripe connect) | `/cleaner/onboarding` | ✅ | Onboarding flow exists. Stripe Connect: depends on backend. |
| **Rate settings page** (tier badge + sliders + save) | `/cleaner/profile` | 🟡 | Profile edit; rate/tier UI may be minimal. Add explicit rate settings + tier badge + save. |
| **Job feed** (available jobs, claim/accept) | `/cleaner/jobs/requests` | ✅ | Job requests; accept via `transition` (e.g. accept). |
| **Job details** (address, notes, supplies checklist) | `/cleaner/jobs/[id]` | ✅ | Address, notes, directions, check-in, photos, time/expenses, status transitions. Supplies checklist: optional. |
| **Check-in/out flow** (GPS confirm + photo upload) | `/cleaner/jobs/[id]` | ✅ | Check-in with geolocation; before/after photo upload. Check-out: via status/photo flow. |
| **Earnings dashboard** (ledger list + next payout banner) | `/cleaner/earnings` | ✅ | Earnings summary, payouts list, request payout, charts, export. Next payout banner: from earnings data. |
| **Reliability score page** (score + how to improve) | `/cleaner/progress`, `/cleaner/stats`, `/cleaner/maintenance` | 🟡 | Progress/stats/maintenance show recovery and metrics. Dedicated “Reliability score + how to improve” page: optional. |

---

## 4. Admin pages (minimum) — status

| Page | Route(s) | Status | Notes |
|------|----------|--------|-------|
| **Jobs table + status controls** | `/admin/bookings` | ✅ | Bookings/jobs list; status controls per backend. |
| **Disputes queue + evidence viewer** | `/admin/disputes` | ✅ | Disputes list, filters, detail modal, resolve (refund amount, notes). Evidence: from job details. |
| **Payouts page** (initiated/paid/failed) | `/admin/finance` | ✅ | Finance dashboard; payouts may be a section. Dedicated payouts table with status: confirm. |
| **Users page** (flags, suspensions, tier overrides) | `/admin/users` | ✅ | User list; status/role patches. Flags/suspensions/tier overrides: extend as needed. |
| **Notification testing panel** | — | ❌ | Not present. Add optional `/admin/tools/notifications` or similar. |

---

## 5. UI assets checklist

| Asset | Status | Location / note |
|-------|--------|------------------|
| **Brand: logo, favicon, app icon set, splash screen** | 🟡 | Logo in Header (PT mark + “PureTask”). Favicon/metadata in layout. App icon set / splash: add for PWA. |
| **Illustration/icon set style** (outline vs filled, rounded) | ✅ | Lucide icons; Tailwind. No single “style guide” doc; consistent in components. |
| **Empty states** (no jobs, no cleaners, no payouts) | ✅ | EmptyBookings, EmptyCleaners, EmptyState; use on list pages. Add empty payouts if needed. |
| **Status badges** (tier badges, job status chips) | ✅ | RoleBadge, status pills on cards and booking detail. Tier badges: add to CleanerCard/profile. |
| **Photo uploader component** (compression, progress, retry) | 🟡 | Upload via `jobService.uploadJobPhoto`; file input/state on cleaner job page. Dedicated reusable uploader with progress/retry/compression: optional. |

---

## 6. Frontend ↔ backend contract

### 6.1 API endpoints per screen (summary)

Below: **screen → main endpoints** the frontend uses. Full list: `docs/BACKEND_ENDPOINTS.md`.

| Screen | Main endpoints |
|--------|-----------------|
| **Login / Register** | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| **Client dashboard** | `GET /bookings/me`, `GET /client/dashboard/insights`, `GET /client/dashboard/recommendations` |
| **Search cleaners** | `GET /cleaners/search` (params: page, per_page, sort_by, etc.) |
| **Cleaner profile** (public) | `GET /cleaners/:id`, `GET /cleaners/:id/reviews`, `GET /cleaners/:id/reliability` |
| **Booking flow** | `POST /client/bookings/draft`, `GET /client/bookings/draft`, `POST /bookings/estimate`, `POST /bookings` |
| **Booking confirmation** | `GET /bookings/:id` |
| **Client booking detail** | `GET /bookings/:id`, `GET /jobs/:id/details`, `GET /tracking/:id` (poll), `POST /bookings/:id/cancel`, `GET /client/jobs/:id/live-status`, `POST /client/jobs/:id/add-to-calendar` |
| **Client live appointment** | `GET /client/jobs/:id/live-status` (or Trust API `/api/appointments/:id/live`) |
| **Client credits / billing** | `GET /credits/balance`, `GET /credits/ledger`, `GET /client/invoices`, payment methods & history |
| **Client approval** (to build) | **Need:** `POST /jobs/:id/approve`, `POST /jobs/:id/dispute` (or `/client/jobs/:id/approve`, `/client/disputes`) |
| **Reviews** | `POST /bookings/:id/review`, `GET /client/reviews/given`, etc. |
| **Cleaner onboarding** | Profile, availability, Stripe connect endpoints per backend. |
| **Cleaner profile/settings** | `GET/PATCH /cleaner/profile`, `GET/PUT /cleaner/availability`, service areas, etc. |
| **Cleaner job requests** | `GET /jobs/me` or job feed endpoint, `POST /jobs/:id/transition` (accept) |
| **Cleaner job detail** | `GET /bookings/:id`, `GET /jobs/:id/details`, `POST /jobs/:id/transition`, `POST /jobs/:id/check-in`, `POST /jobs/:id/photos`, `GET /cleaner/jobs/:id/directions`, time/expenses |
| **Cleaner earnings** | `GET /cleaner/earnings`, `GET /cleaner/payouts`, `POST /payouts/request`, breakdown, export |
| **Admin dashboard** | `GET /admin/dashboard/realtime`, `GET /admin/analytics/overview`, health, alerts |
| **Admin bookings** | `GET /admin/bookings`, `PATCH /admin/bookings/:id/status`, `POST /admin/bookings/:id/cancel` |
| **Admin disputes** | `GET /admin/disputes` or jobs filtered by status, `POST /admin/jobs/:id/resolve-dispute` |
| **Admin users** | `GET /admin/users`, `PATCH /admin/users/:id/status`, `PATCH /admin/users/:id/role`, risk profile/action |
| **Admin finance/payouts** | `GET /admin/finance/*`, payout list if exposed |

### 6.2 Objects each screen needs (high level)

| Object | Used on |
|--------|--------|
| **User** | Auth, profile, header, settings |
| **Job / Booking** | Booking detail, list, live view, cleaner job view, admin bookings. Fields: id, status, scheduled_*, address, credit_amount, client_id, cleaner_id, cleaner, etc. |
| **JobDetailsDTO** | Client booking detail, cleaner job (optional): job, cleaner, presence (checkins), ledger, photos. From `GET /jobs/:id/details`. |
| **TrackingState** | Client booking detail (live), optional cleaner: status, currentLocation, events. From `GET /tracking/:id`. |
| **Wallet / Credits** | Client credits page, checkout, ledger; cleaner earnings. Balance, ledger entries, payment methods. |
| **CleanerProfile** | Search cards, public profile `/cleaner/[id]`: name, rating, reliability, tier, rates, reviews, availability. |
| **Payout** | Cleaner earnings: list, next payout, request payout. Admin finance. |
| **Dispute** | Admin disputes queue: job, client, cleaner, reason, status, evidence. Client: need submit dispute payload. |
| **Invoice** | Client billing: list, detail, receipt. |
| **Message / Conversation** | Messages page, job conversation. |

### 6.3 Real-time updates required

| Area | What | Current approach |
|------|------|-------------------|
| **Job status changes** | Client and cleaner see status updates (e.g. on_my_way, in_progress, completed) | **Polling:** `useJobTrackingPoll(bookingId, 8000)` and refetch booking/job details. WebSocket: `WebSocketContext` exists; job events can be subscribed there. |
| **Check-in events** | Client sees “Cleaner checked in” / presence | From `GET /jobs/:id/details` (checkins) and `GET /tracking/:id` (currentLocation). Poll every 5–10s on detail/live page. |
| **Messages** | New messages in conversation | `useRealtimeMessages` + WebSocket or polling. |
| **Notifications** | New notification badge / list | NotificationContext; polling or WebSocket. |
| **Cleaner job feed** | New/claimed jobs | Poll or refetch on interval; WebSocket optional. |

**Recommendation:** Keep polling for job details/tracking and live status until backend exposes WebSocket events; then subscribe to `job:status`, `job:checkin`, `job:location` (or equivalent) and invalidate queries or update state.

---

## 7. Build priority (from gaps)

1. **Client approval + dispute** — Approve/Dispute block on `/client/bookings/[id]` when status = `awaiting_approval`; client dispute form (reason + details) + backend `POST /jobs/:id/approve`, `POST /client/disputes` (or equivalent).
2. **Cleaner rate settings** — Dedicated rate/tier section or page with sliders + save.
3. **Job in progress: timer + held credits** — Show elapsed time and “credits held” on client booking detail when status in progress; optional top-up modal.
4. **Checkout / credits packs** — If backend supports packs and promo: UI on `/client/credits` (packs, promo code, receipt).
5. **Photo uploader** — Reusable component with progress, retry, optional compression.
6. **Admin notification testing** — Optional panel to send test notifications.
7. **Brand** — Favicon, app icon set, splash if targeting PWA/app shell.

---

*Source: current routes, `docs/UI_REFERENCE.md`, `docs/BACKEND_ENDPOINTS.md`, and service/hook usage. Update when adding or removing screens or APIs.*
