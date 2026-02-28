# App Flows — All Possibilities

This document defines **every user type**, **every entry point**, and **every flow** in the app so that all possibilities have a clear path and the old/duplicate pages don’t confuse users.

---

## 1. User types and entry points

| User type | Description | Default entry after login |
|-----------|-------------|---------------------------|
| **Guest** | Not logged in | Landing `/` or auth |
| **Client** | Books and pays for cleans | `/client` (Client home) |
| **Cleaner** | Does cleans and gets paid | `/cleaner` (Cleaner home) |
| **Admin** | Manages platform | `/admin` (Admin dashboard) |

---

## 2. Guest flows (not logged in)

### 2.1 Landing and role choice

| Step | Route / action | Purpose |
|------|----------------|---------|
| 1 | `/` | Marketing landing: hero, how it works, trust, testimonials, CTA. |
| 2 | CTA: “Find a cleaner” / “Book a clean” | → `/search` or `/auth/register` (client intent). |
| 2 | CTA: “Become a cleaner” / “Join & earn” | → `/cleaner/onboarding` or `/auth/register` (cleaner intent). |
| 2 | “Log in” / “Sign up” in header | → `/auth/login` or `/auth/register`. |

**Recommended:** Landing CTAs should either go to **auth with intent** (e.g. `?role=client` / `?role=cleaner`) or to **search** (for “Find a cleaner”) and **onboarding** (for “Become a cleaner”). Register page already has Client/Cleaner choice.

### 2.2 Auth flows (guest)

| Flow | Steps | Notes |
|------|--------|--------|
| **Sign up (client)** | `/auth/register` → choose Client → fill form → submit → `/client`. | |
| **Sign up (cleaner)** | `/auth/register` → choose Cleaner → fill form → submit → `/cleaner`. Optional: redirect to `/cleaner/onboarding` for first-time. |
| **Log in** | `/auth/login` → submit → redirect by role: `/client`, `/cleaner`, or `/admin`. | |
| **Forgot password** | `/auth/forgot-password` → submit → email sent; link to `/auth/reset-password`. | |
| **Verify email** | `/auth/verify-email` (from email link). | |
| **Legacy /auth** | `/auth` → should redirect to `/auth/login` or show Login | Register tabs. | |

### 2.3 Guest can browse (no login required)

| Route | Purpose |
|-------|---------|
| `/` | Landing. |
| `/search` | Find cleaners (may prompt login when booking). |
| `/help` | Help center. |
| `/terms`, `/privacy`, `/cookies` | Legal. |
| `/cleaner/onboarding` | Learn about becoming a cleaner (may prompt register). |

### 2.4 Guest should not land on

- `/dashboard` — generic dashboard; **redirect** to `/client` or `/cleaner` or `/admin` by role, or to `/auth/login` if guest.
- `/client`, `/cleaner`, `/admin` — protected; redirect guest to `/auth/login`.

---

## 3. Client flows (logged in as client)

### 3.1 Home and primary actions

| Route | Purpose | Next possible steps |
|-------|---------|----------------------|
| `/client` | **Client home (hub).** Cards: Book a clean, My bookings, Credits & payment, Help. Next booking strip if any. | Book → `/client/book`. Bookings → `/client/bookings`. Credits → `/client/credits-trust`. |
| `/client/book` | **How do you want to book?** One-time / Recurring / Same cleaner again. | One-time → `/search`. Recurring → `/client/recurring`. Favorites → `/favorites`. |
| `/client/dashboard` | **Full dashboard.** Stats, what’s next, insights, recommendations, activity, chart. | View booking, Book a cleaner, Credits, Invoices. |

### 3.2 Finding and booking

| Route | Purpose | Next steps |
|-------|---------|------------|
| `/search` | Find cleaners (filters, map/list, save search). | Select cleaner → `/booking?cleaner=id` or book from card. |
| `/booking` | Multi-step new booking (service, date/time, address, cleaner, summary). | Submit → `/booking/confirm/[id]`. |
| `/booking/confirm/[id]` | Confirm and pay (credits). | Confirm → `/client/bookings` or `/client/bookings/[id]`. |

### 3.3 Managing bookings

| Route | Purpose | Next steps |
|-------|---------|------------|
| `/client/bookings` | List upcoming and past bookings. | Open one → `/client/bookings/[id]`. |
| `/client/bookings/[id]` | **Canonical booking detail:** status, timeline, tracking, approve/release payment, dispute, receipt, trust banners. | Approve → release payment. Dispute → `/client/job/[jobId]/dispute`. Live view → `/client/appointments/[id]/live-trust`. |
| `/client/appointments/[bookingId]/live-trust` | Live job view (check-in/out, credits held). | Back to booking detail. |
| `/client/job/[jobId]` | Job view (timeline, before/after, approve). Used when job ID is known (e.g. from jobs API). | Approve, or Open dispute → `/client/job/[jobId]/dispute`. |
| `/client/job/[jobId]/dispute` | Open dispute (reason, details). | Submit → back to job or booking. |

**Recommendation:** Prefer **one canonical place** for “view my booking and approve/dispute”: `/client/bookings/[id]`. Link to `/client/job/[jobId]` only when the app uses job ID (e.g. from notifications or jobs service). In UI, always link “View booking” to `/client/bookings/[id]` when you have booking id.

### 3.4 Payment and account

| Route | Purpose |
|-------|---------|
| `/client/credits-trust` | Balance, add credits, ledger (hold/release), trust. |
| `/client/billing-trust` | Invoices list; view/download. |
| `/client/billing-trust/[id]` | Single invoice. |
| `/client/settings` | Profile, addresses, notifications. |
| `/client/support` | Help, contact. |
| `/client/recurring` | Manage recurring bookings. |
| `/favorites` | Saved cleaners; book again. |
| `/reviews` | Write a review (after a completed job). |

### 3.5 Client flow summary

- **First time:** Register (client) → `/client` → Book → Search → Booking flow → Confirm.
- **Returning:** `/client` → Book again or My bookings or Credits.
- **After a job:** Notification/email → `/client/bookings/[id]` → Approve or Dispute; or write review → `/reviews`.
- **Problem:** Dispute from booking detail or from `/client/job/[jobId]/dispute`.

---

## 4. Cleaner flows (logged in as cleaner)

### 4.1 Home and primary actions

| Route | Purpose | Next steps |
|-------|---------|------------|
| `/cleaner` | **Cleaner home (hub).** Today’s jobs, New requests, My jobs, Earnings, Set availability. | Today → `/cleaner/today`. Requests → `/cleaner/jobs/requests`. Dashboard → `/cleaner/dashboard`. |
| `/cleaner/today` | Jobs scheduled for today; Start workflow, Details. | Start → `/cleaner/job/[jobId]/workflow`. Details → `/cleaner/jobs/[id]`. |
| `/cleaner/dashboard` | Full overview: stats, charts, upcoming, activity, goals. | Job detail, calendar, earnings. |
| `/cleaner/jobs/requests` | Available jobs to accept (filters, accept/decline). | Accept → `/cleaner/jobs/[id]` or workflow. |
| `/cleaner/jobs/[id]` | Job detail (address, time, client, pay). | Open workflow or tracking. |

### 4.2 Doing the job (workflow)

| Route | Purpose | Next steps |
|-------|---------|------------|
| `/cleaner/job/[jobId]/workflow` | Workflow: En route → Check-in → Before photos → Clean → After photos → Submit. | Complete steps; submit → job done. |
| `/cleaner/job/[jobId]/tracking` | Tracking (check-in/out, time). | |
| `/cleaner/job/[jobId]/upload` | Upload photos/evidence. | |
| `/cleaner/map` | Map view (if used). | |

### 4.3 Earnings and profile

| Route | Purpose |
|-------|---------|
| `/cleaner/earnings` | Earnings summary, history, payouts. |
| `/cleaner/wallet` | Wallet balance, withdraw. |
| `/cleaner/calendar` | Calendar, availability, booked slots. |
| `/cleaner/availability` | Set availability, block dates. |
| `/cleaner/profile` | Name, photo, bio, services. |

### 4.4 Growth and tools

| Route | Purpose |
|-------|---------|
| `/cleaner/reviews` | My reviews and ratings. |
| `/cleaner/progress` | Levels, goals, badges. |
| `/cleaner/rewards`, `/cleaner/goals`, `/cleaner/badges` | Gamification. |
| `/cleaner/leaderboard`, `/cleaner/stats`, `/cleaner/maintenance` | Extra tools. |
| `/cleaner/ai-assistant` | Quick replies, templates, chat. |
| `/cleaner/onboarding` | First-time or “become a cleaner” info. |

### 4.5 Cleaner flow summary

- **First time:** Register (cleaner) → `/cleaner` (or onboarding) → Set availability → New requests → Accept → Today → Workflow → Get paid.
- **Daily:** `/cleaner` → Today’s jobs → Start workflow; or New requests → Accept.
- **Getting paid:** Earnings, Wallet.

---

## 5. Admin flows (logged in as admin)

### 5.1 Home and structure

| Route | Purpose | Next steps |
|-------|---------|------------|
| `/admin` | **Admin dashboard.** Stats, realtime metrics, alerts, revenue, recent activity. | Users, Bookings, Disputes, Finance, Gamification, etc. |
| `/admin/dashboard` | Same as `/admin` (can redirect to `/admin`). | |

### 5.2 Core admin

| Route | Purpose |
|-------|---------|
| `/admin/users` | User management. |
| `/admin/bookings` | Booking management. |
| `/admin/disputes` | Disputes. |
| `/admin/finance` | Finance. |
| `/admin/analytics` | Analytics. |
| `/admin/id-verifications` | ID verifications. |
| `/admin/communication` | Communication. |
| `/admin/risk` | Risk. |
| `/admin/settings` | Admin settings. |
| `/admin/api` | API management. |

### 5.3 Gamification (admin)

| Route | Purpose |
|-------|---------|
| `/admin/gamification` | Overview. |
| `/admin/gamification/flags` | Feature flags. |
| `/admin/gamification/goals` | Goals library. |
| `/admin/gamification/rewards` | Rewards. |
| `/admin/gamification/choices` | Choice groups. |
| `/admin/gamification/governor` | Governor. |
| `/admin/gamification/abuse` | Abuse monitor. |
| `/admin/support/cleaner/[cleanerId]/gamification` | Cleaner-specific gamification. |

### 5.4 Admin tools (internal)

| Route | Purpose |
|-------|---------|
| `/admin/tools` | Tools index. |
| Various under `/admin/tools/*` | Quick responses, AI, leaderboard, certifications, etc. |

### 5.5 Admin flow summary

- **Entry:** Login as admin → `/admin`. From there, go to Users, Bookings, Disputes, Finance, Gamification, etc. No separate “admin hub” page needed if dashboard is the hub.

---

## 6. Shared / cross-role

| Route | Who | Purpose |
|-------|-----|---------|
| `/messages` | Client, Cleaner | Messages. |
| `/notifications` | All | Notifications. |
| `/help` | All | Help center. |
| `/referral` | Client, Cleaner | Referral program. |

---

## 7. Legacy and redirects (recommendations)

| Current | Recommendation |
|---------|----------------|
| `/dashboard` | Redirect: if guest → `/auth/login`; if client → `/client`; if cleaner → `/cleaner`; if admin → `/admin`. |
| `/auth` | Redirect to `/auth/login` or render Login \| Register tabs. |
| `/client/credits` vs `/client/credits-trust` | Prefer **credits-trust** as canonical; redirect credits → credits-trust or deprecate. |
| `/client/billing` vs `/client/billing-trust` | Prefer **billing-trust**; redirect or deprecate billing. |
| `/client/bookings/[id]` vs `/client/job/[jobId]` | Use **bookings/[id]** as main client view; use job/[jobId] when linking by job ID (e.g. from jobs API). |

---

## 8. Flow index (quick reference)

- **Guest:** `/` → `/auth/register` or `/auth/login` or `/search` or `/cleaner/onboarding`.
- **Client:** `/client` → `/client/book` | `/client/bookings` | `/client/credits-trust`; book via `/search` → `/booking` → `/booking/confirm/[id]`; manage via `/client/bookings/[id]` (approve/dispute).
- **Cleaner:** `/cleaner` → `/cleaner/today` | `/cleaner/jobs/requests` | `/cleaner/earnings`; do job via `/cleaner/job/[jobId]/workflow`.
- **Admin:** `/admin` → users, bookings, disputes, finance, gamification, settings.

Implementing redirects and a single canonical path per intent (e.g. one “booking detail” for clients, one “dashboard” per role) will make all possibilities clear and prevent the old pages from undermining the new flows.
