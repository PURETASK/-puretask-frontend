# Frontend — Complete Q&A & Reference

One place for **all questions**, **all answers**, routing, client/cleaner/admin pages, UI assets (have vs need), endpoints per screen, build priority, and suggestions.

---

# Part 1 — Questions & Answers

## App routing + navigation

**Q: What are the top-level areas: Client app, Cleaner app, Admin app (3 separate navs)?**

**A:** Yes. Three role-based areas, each with its own navigation:

- **Client app** — Entry: `/client/dashboard`, `/client/bookings`, `/search`, `/booking`, `/client/credits`, `/client/billing`, `/client/settings`, `/client/support`, `/favorites`, `/messages`. **Nav:** Header (Find a Cleaner, My Bookings, Home); BottomNav on mobile (Home, Bookings, Messages, Profile).
- **Cleaner app** — Entry: `/cleaner/dashboard`, `/cleaner/calendar`, `/cleaner/jobs/*`, `/cleaner/earnings`, `/cleaner/profile`, `/cleaner/availability`, `/cleaner/progress`, `/cleaner/onboarding`, etc. **Nav:** Header (My Dashboard, Progress, Home); BottomNav (Home, Calendar, Messages, Profile).
- **Admin app** — Entry: `/admin`, `/admin/dashboard`, `/admin/users`, `/admin/bookings`, `/admin/disputes`, `/admin/finance`, `/admin/gamification`, etc. **Nav:** Header (Admin Panel, Gamification, Home). No BottomNav.

Shared routes: `/`, `/search`, `/auth/*`, `/help`, `/terms`, `/privacy`, `/cookies`. Role comes from `AuthContext`; `ProtectedRoute` and `roleRouting` enforce access.

---

**Q: What’s the default landing after login for each role?**

**A:**

| Role   | Default after login   |
|--------|------------------------|
| Client | `/client/dashboard`    |
| Cleaner| `/cleaner/dashboard`   |
| Admin  | `/admin` or `/admin/dashboard` |

Defined in `ROLE_DASHBOARDS` in `src/lib/roleRouting.ts` and used in the login redirect.

---

## Client pages (minimum)

**Q: What client pages do we need (minimum)?**

**A:** Listed below with status (✅ Have, 🟡 Partial, ❌ To build).

| Page | Route(s) | Status | Notes |
|------|----------|--------|-------|
| Home / search cleaners (filters, sorting, availability) | `/search`, `/client/dashboard` | ✅ | Search: filters, sort, list/map, CleanerCard grid, pagination. Dashboard: overview + “Book a Cleaner” → search. |
| Cleaner profile page (reliability, rates, badges, reviews, photos) | `/cleaner/[id]` | 🟡 | Public profile; reliability from API. Tier/reliability could be more prominent. |
| Booking flow (type, hours, estimate, hold credits) | `/booking` | ✅ | 4-step stepper: date/time + service + duration, cleaner + estimate, address, review. Draft save, price estimate. |
| Checkout / buy credits (packs, promo, receipt) | `/client/credits`, `/booking/confirm/[id]` | 🟡 | Credits page exists; packs/promo depend on backend. Receipt: `/client/billing` has InvoiceTable. |
| Upcoming job details (status timeline, contact, cancel/reschedule) | `/client/bookings/[id]` | ✅ | JobDetailsTracking (timeline, before/after, presence), cancel, Add to Calendar, messages. Reschedule: not a dedicated flow. |
| Job in progress (timer, held credits, top-up modal) | `/client/bookings/[id]`, `/client/appointments/[bookingId]/live` | 🟡 | Live view exists; timer/held credits/top-up modal partial or missing. |
| Approval + review (approve/dispute + final charge + refund tag) | `/client/bookings/[id]`, `/client/job/[id]/dispute`, `/reviews` | ✅ | When status = `awaiting_approval`: “Review & complete” card with **Approve & release payment** (GradientButton → `approveJob`) and **Open dispute** → `/client/job/[id]/dispute`. Escrow: “Credits held for this job” + “View balance & ledger” in sidebar. Status labels: on_my_way, awaiting_approval, disputed. |
| Wallet / transactions history | `/client/credits`, `/client/billing` | ✅ | Credits balance; billing with InvoiceTable. |

---

## Cleaner pages (minimum)

**Q: What cleaner pages do we need (minimum)?**

**A:**

| Page | Route(s) | Status | Notes |
|------|----------|--------|-------|
| Cleaner onboarding (profile, availability, service area, Stripe connect) | `/cleaner/onboarding` | ✅ | Onboarding flow; Stripe Connect per backend. |
| Rate settings page (tier badge + sliders + save) | `/cleaner/profile` | 🟡 | Profile edit; explicit rate/tier sliders + save to add. |
| Job feed (available jobs, claim/accept) | `/cleaner/jobs/requests` | ✅ | Job requests; accept via `POST /jobs/:id/transition`. |
| Job details (address, notes, supplies checklist) | `/cleaner/jobs/[id]` | ✅ | Address, notes, directions, check-in, photos, time/expenses. Supplies checklist optional. |
| Check-in/out flow (GPS confirm + photo upload) | `/cleaner/jobs/[id]` | ✅ | Check-in with geolocation; before/after photo upload. |
| Earnings dashboard (ledger list + next payout banner) | `/cleaner/earnings` | ✅ | Summary, payouts list, request payout, charts, export. |
| Reliability score page (score + how to improve) | `/cleaner/progress`, `/cleaner/stats` | 🟡 | Progress/stats show metrics; dedicated “how to improve” page optional. |

---

## Admin pages (minimum)

**Q: What admin pages do we need (minimum)?**

**A:**

| Page | Route(s) | Status | Notes |
|------|----------|--------|-------|
| Jobs table + status controls | `/admin/bookings` | ✅ | Bookings/jobs list; status controls. |
| Disputes queue + evidence viewer | `/admin/disputes` | ✅ | List, filters, detail, resolve (refund, notes). Evidence from job details. |
| Payouts page (initiated/paid/failed) | `/admin/finance` | ✅ | Finance dashboard; payouts as section. Dedicated payouts table: confirm. |
| Users page (flags, suspensions, tier overrides) | `/admin/users` | ✅ | User list; status/role patches. Extend for flags/suspensions/tier as needed. |
| Notification testing panel | — | ❌ | Not present. Add e.g. `/admin/tools/notifications`. |

---

## UI assets

**Q: What UI assets do we need (brand, illustrations, empty states, badges, photo uploader)?**

**A:** See Part 3 for “Already have” vs “Need to create/build.”

---

## Frontend ↔ backend contract

**Q: What are the API endpoints per screen?**  
**A:** See Part 4 — Endpoints per screen.

**Q: What objects does each screen need (Job, User, Wallet, CleanerProfile, Payout)?**  
**A:** See Part 4 — Objects per screen.

**Q: What real-time updates are required (job status, check-in events)?**  
**A:** See Part 4 — Real-time updates.

---

# Part 2 — Routing & Navigation (full)

## Top-level areas

| Area | Entry routes | Header nav | BottomNav (mobile) |
|------|----------------|------------|---------------------|
| **Client** | `/client/dashboard`, `/client/bookings`, `/search`, `/booking`, `/client/credits`, `/client/billing`, `/client/settings`, `/client/support`, `/favorites`, `/messages` | Find a Cleaner, My Bookings, Home | Home, Bookings, Messages, Profile |
| **Cleaner** | `/cleaner/dashboard`, `/cleaner/calendar`, `/cleaner/jobs/*`, `/cleaner/earnings`, `/cleaner/profile`, `/cleaner/availability`, `/cleaner/progress`, `/cleaner/onboarding` | My Dashboard, Progress, Home | Home, Calendar, Messages, Profile |
| **Admin** | `/admin`, `/admin/dashboard`, `/admin/users`, `/admin/bookings`, `/admin/disputes`, `/admin/finance`, `/admin/gamification` | Admin Panel, Gamification, Home | — |

## Shared / public

- **Public:** `/`, `/search`, `/booking`, `/booking/confirm/[id]`, `/cleaner/[id]`, `/terms`, `/privacy`, `/help`, `/help/category/[categoryId]`, `/cookies`
- **Auth:** `/auth`, `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify-email`

## Default landing after login

- Client → `/client/dashboard`  
- Cleaner → `/cleaner/dashboard`  
- Admin → `/admin`

---

# Part 3 — UI Assets: Have vs Need

## Assets we already have

| Asset | Where / notes |
|-------|----------------|
| **Logo** | Header: PT mark + “PureTask” text |
| **Favicon / metadata** | `layout.tsx` (metadata, viewport, theme-color) |
| **Icon set** | Lucide icons; consistent use across components |
| **Empty states** | `EmptyBookings`, `EmptyCleaners`, `EmptyState` on list pages |
| **Status badges** | RoleBadge, job status pills on cards and booking detail |
| **Illustration style** | Tailwind + Lucide; no separate illustration library |
| **Motion system** | `motion/tokens.ts`, PageTransitionMotion, AnimatedCardMotion, Stagger, ScrollRevealSection, Toggle (spring) |
| **Booking stepper** | 4-step stepper with progress bar and step content |
| **Photo upload (basic)** | `jobService.uploadJobPhoto`; file input on cleaner job page |

## Assets we need to create or build

| Asset | Priority | Notes |
|-------|----------|--------|
| **App icon set** | Medium | For PWA / “Add to Home Screen”; multiple sizes |
| **Splash screen** | Medium | If targeting PWA or app shell |
| **Reusable photo uploader** | Medium | Progress bar, retry on failure, optional client-side compression |
| **Tier badges on CleanerCard** | Medium | Show tier (e.g. Silver/Gold) on search cards and profile |
| **Empty payouts state** | Low | If payouts list can be empty; reuse EmptyState pattern |
| **Admin notification testing panel** | Low | Optional; e.g. `/admin/tools/notifications` to send test notifications |
| **Style guide doc (optional)** | Low | One-page outline: outline vs filled icons, corner radius, spacing for new assets |

---

# Part 4 — Endpoints, Objects & Real-time

## Endpoints per screen

Full API list: `docs/BACKEND_ENDPOINTS.md`. Summary by screen:

| Screen | Main endpoints |
|--------|-----------------|
| **Login / Register** | `POST /auth/login`, `POST /auth/register`, `GET /auth/me` |
| **Client dashboard** | `GET /bookings/me`, `GET /client/dashboard/insights`, `GET /client/dashboard/recommendations` |
| **Search cleaners** | `GET /cleaners/search` (page, per_page, sort_by, filters) |
| **Cleaner profile (public)** | `GET /cleaners/:id`, `GET /cleaners/:id/reviews`, `GET /cleaners/:id/reliability` |
| **Booking flow** | `POST /client/bookings/draft`, `GET /client/bookings/draft`, `POST /bookings/estimate`, `POST /bookings` |
| **Booking confirmation** | `GET /bookings/:id` |
| **Client booking detail** | `GET /bookings/:id`, `GET /jobs/:id/details`, `GET /tracking/:id` (poll), `POST /bookings/:id/cancel`, `GET /client/jobs/:id/live-status`, `POST /client/jobs/:id/add-to-calendar` |
| **Client live appointment** | `GET /client/jobs/:id/live-status` or Trust API |
| **Client credits / billing** | `GET /credits/balance`, `GET /credits/ledger`, `GET /client/invoices`, payment methods & history |
| **Client approval** | **POST /tracking/:jobId/approve**, **POST /tracking/:jobId/dispute** (auth + job ownership) |
| **Reviews** | `POST /bookings/:id/review`, `GET /client/reviews/given`, etc. |
| **Cleaner onboarding** | Profile, availability, Stripe connect per backend |
| **Cleaner profile/settings** | `GET/PATCH /cleaner/profile`, `GET/PUT /cleaner/availability`, service areas |
| **Cleaner job requests** | Job feed endpoint, `POST /jobs/:id/transition` (accept) |
| **Cleaner job detail** | `GET /bookings/:id`, `GET /jobs/:id/details`, `POST /jobs/:id/transition`, `POST /jobs/:id/check-in`, `POST /jobs/:id/photos`, `GET /cleaner/jobs/:id/directions`, time/expenses |
| **Cleaner earnings** | `GET /cleaner/earnings`, `GET /cleaner/payouts`, `POST /payouts/request`, breakdown, export |
| **Admin dashboard** | `GET /admin/dashboard/realtime`, `GET /admin/analytics/overview`, health, alerts |
| **Admin bookings** | `GET /admin/bookings`, `PATCH /admin/bookings/:id/status`, `POST /admin/bookings/:id/cancel` |
| **Admin disputes** | `GET /admin/disputes` (or jobs filtered), `POST /admin/jobs/:id/resolve-dispute` |
| **Admin users** | `GET /admin/users`, `PATCH /admin/users/:id/status`, `PATCH /admin/users/:id/role`, risk profile/action |
| **Admin finance/payouts** | `GET /admin/finance/*`, payout list if exposed |

## Objects each screen needs

| Object | Used on |
|--------|--------|
| **User** | Auth, profile, header, settings |
| **Job / Booking** | Booking list/detail, live view, cleaner job, admin bookings (id, status, scheduled_*, address, credit_amount, client_id, cleaner_id, cleaner, etc.) |
| **JobDetailsDTO** | Client booking detail, cleaner job: job, cleaner, presence (checkins), ledger, photos. From `GET /jobs/:id/details`. |
| **TrackingState** | Client live view: status, currentLocation, events. From `GET /tracking/:id`. |
| **Wallet / Credits** | Client credits, checkout, ledger; cleaner earnings (balance, ledger entries, payment methods) |
| **CleanerProfile** | Search cards, `/cleaner/[id]`: name, rating, reliability, tier, rates, reviews, availability |
| **Payout** | Cleaner earnings (list, next payout, request); admin finance |
| **Dispute** | Admin disputes (job, client, cleaner, reason, status, evidence); client: submit dispute payload (to be built) |
| **Invoice** | Client billing (list, detail, receipt) |
| **Message / Conversation** | Messages page, job conversation |

## Real-time updates required

| Area | What | Current approach |
|------|------|-------------------|
| Job status changes | Client/cleaner see status (e.g. on_my_way, in_progress, completed) | Polling: `useJobTrackingPoll(bookingId, 8000)` + refetch job details. WebSocketContext exists for future events. |
| Check-in events | Client sees “Cleaner checked in” / presence | `GET /jobs/:id/details` (checkins) + `GET /tracking/:id`; poll every 5–10s on detail/live. |
| Messages | New messages in conversation | `useRealtimeMessages` + WebSocket or polling |
| Notifications | Badge / list updates | NotificationContext; polling or WebSocket |
| Cleaner job feed | New/claimed jobs | Poll or refetch on interval |

**Recommendation:** Keep polling for job/tracking until backend exposes WebSocket; then subscribe to job status/check-in/location events and invalidate queries or update state.

---

# Part 5 — Build priority

Ordered by impact and dependencies:

1. **Client approval + dispute** — On `/client/bookings/[id]` when status = `awaiting_approval`: add Approve and Dispute CTAs; dispute form (reason + details). Backend: `POST /jobs/:id/approve`, `POST /client/disputes` (or equivalent).
2. **Cleaner rate settings** — Dedicated rate/tier section or page: tier badge, sliders, save. Use existing profile/availability patterns.
3. **Job in progress: timer + held credits** — On client booking detail when in progress: show elapsed time and “credits held”; optional top-up modal if balance low.
4. **Checkout / credits packs** — If backend supports: packs selector, promo code, receipt on `/client/credits`.
5. **Photo uploader component** — Reusable: progress, retry, optional compression; use on cleaner job and anywhere else photos are uploaded.
6. **Admin notification testing** — Optional panel to send test notifications (e.g. `/admin/tools/notifications`).
7. **Brand (PWA)** — App icon set, splash screen if targeting installable app.

---

# Part 6 — Other suggestions & improvements

## High impact

- **Client approval flow** — Make “Approve job” and “Open dispute” the primary actions when status is `awaiting_approval`; show final charge and refund tag after resolution.
- **Shared job timeline** — Reuse one Job Timeline / status rail component on client booking detail, cleaner job detail, and (if useful) admin job view for consistency.
- **Cleaner guardrails** — On cleaner job detail: clear “Check in” / “Start” / “Complete” steps with GPS/photo requirements and validation messages.
- **Hero role selector** — On landing: “I’m a Client” / “I’m a Cleaner” to route to search vs onboarding or cleaner dashboard.
- **Tier & reliability on CleanerCard** — Show tier badge and reliability (e.g. ring or score) on search results and favorites.

## Medium impact

- **Places Autocomplete** — For booking address step to improve accuracy and UX.
- **Wallet animation** — Subtle animation when balance updates (e.g. after purchase or job completion).
- **Reschedule flow** — Dedicated “Reschedule” from upcoming job detail (pick new date/time, confirm) if backend supports it.
- **Next payout banner** — Prominent “Next payout: $X on DATE” on cleaner earnings page using existing payouts data.

## Nice to have

- **Dedicated reliability page (cleaner)** — Single page: score, breakdown, “How to improve” tips.
- **Style guide** — Short doc or Storybook: icon style (outline/filled), corner radius, empty-state layout for new contributors.
- **Offline / install** — PWA manifest + service worker for basic offline shell if product goals include installability.

---

## Product / alignment (backend + n8n)

- **Canonical job status** — Enum and transitions are defined in **`docs/CANONICAL_JOB_STATUS.md`**. Frontend uses **`src/constants/jobStatus.ts`**. Backend and n8n should use the same enum and transition table so status stays in sync. Optional: **GET /config/job-status** — when implemented, frontend can use **`useJobStatusConfig`** for status/transition logic (see **`src/hooks/useJobStatusConfig.ts`** and **`docs/BACKEND_ENDPOINTS.md`**).
- **Admin audit log** — Backend must log admin actions (resolve dispute, overrides, credit changes). See **`docs/ADMIN_AUDIT_LOG.md`**. UI: Admin → Settings → Security.

---

*Sources: `docs/UI_REFERENCE.md`, `docs/UI_UX_CHANGES_AND_REVIEW.md`, `docs/FRONTEND_BUILD_GUIDE.md`, `docs/BACKEND_ENDPOINTS.md`, `docs/CANONICAL_JOB_STATUS.md`, `docs/ADMIN_AUDIT_LOG.md`, `docs/PAGES_AND_FEATURES_ANALYSIS.md`, `docs/FRONTEND_QUESTION_LIST_ANSWER.md`, and current codebase. Update this doc when adding/removing pages or APIs.*
