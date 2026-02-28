# Customer & Cleaner Flows

This doc defines the **customer (client)** and **cleaner** product flows: which pages exist, what options and features each role sees, and how the two experiences differ.

---

## 1. Customer (Client) Flow

**Goal:** Book cleaning, track jobs, pay with protected payments, and get help when needed.

### 1.1 Entry & hub

| Route | Purpose | Features |
|-------|---------|----------|
| `/client` | **Client home** – single entry for logged-in clients | Cards: Book a clean, My bookings, Credits & payment, Help. Quick stats (next booking, balance). |
| `/client/dashboard` | **My dashboard** – detailed overview | Stats, what’s next, upcoming bookings, insights, recommendations, activity. |
| `/client/book` | **Book** – how do you want to book? | Choose: One-time clean, Recurring, or Book same cleaner again. Each path leads to search or pre-filled booking. |

### 1.2 Finding & booking

| Route | Purpose | Features |
|-------|---------|----------|
| `/search` | **Find a cleaner** | Filters, map/list, cleaner cards, save search, book from card. |
| `/booking` | **New booking** (multi-step) | Steps: service & when → address → cleaner (or choose from search) → confirm. |
| `/booking/confirm/[id]` | **Confirm booking** | Summary, payment (credits), confirm. |

### 1.3 Managing bookings

| Route | Purpose | Features |
|-------|---------|----------|
| `/client/bookings` | **My bookings** | List: upcoming, past. Filter by status. Open booking detail. |
| `/client/bookings/[id]` | **Booking detail** | Timeline, status, approve/release payment, dispute, evidence links, receipt. |
| `/client/appointments/[id]/live-trust` | **Live job** (optional) | Real-time view: check-in/out, credits held, status. |

### 1.4 Payment & account

| Route | Purpose | Features |
|-------|---------|----------|
| `/client/credits-trust` | **Credits** | Balance, add credits, ledger (hold/release), trust banner. |
| `/client/billing-trust` | **Invoices** | List invoices, view/download, trust copy. |
| `/client/settings` | **Settings** | Profile, addresses, notifications. |
| `/client/support` | **Support** | Help, contact, FAQs. |
| `/client/recurring` | **Recurring** | Manage recurring bookings. |

### 1.5 Customer flow summary

- **New customer:** Register → Client home (`/client`) → Book → Search/booking flow → Confirm.
- **Returning:** Client home → Book again or open My bookings / Credits.
- **Options we emphasize:** One-time vs recurring vs same cleaner; clear “what’s next” and evidence (credits held, receipt).

---

## 2. Cleaner Flow

**Goal:** See and accept work, do jobs with a clear workflow, get paid, and grow (reviews, progress).

### 2.1 Entry & hub

| Route | Purpose | Features |
|-------|---------|----------|
| `/cleaner` | **Cleaner home** – single entry for logged-in cleaners | Cards: Today’s jobs, New requests, My jobs, Earnings, Set availability. Quick stats (jobs today, pending requests). |
| `/cleaner/dashboard` | **Dashboard** – full overview | Stats, charts, upcoming jobs, activity, goals. |
| `/cleaner/today` | **Today’s jobs** | List of jobs happening today; start workflow, directions, check-in/out. |
| `/cleaner/ready` | **Get ready** (optional) | Checklist: profile complete, availability set, first-job tips. |

### 2.2 Jobs & requests

| Route | Purpose | Features |
|-------|---------|----------|
| `/cleaner/jobs/requests` | **New requests** | Available jobs to accept; filters (date, service, pay); accept/decline. |
| `/cleaner/jobs/[id]` | **Job detail** | Address, time, client, pay; open workflow or tracking. |
| `/(cleaner)/cleaner/job/[jobId]/workflow` | **Job workflow** | Before/after steps, uploads, complete job. |
| `/(cleaner)/cleaner/job/[jobId]/tracking` | **Tracking** | Check-in/out, time, status. |
| `/(cleaner)/cleaner/job/[jobId]/upload` | **Upload** | Photo/evidence upload. |

### 2.3 Earnings & profile

| Route | Purpose | Features |
|-------|---------|----------|
| `/cleaner/earnings` | **Earnings** | Summary, history, payouts. |
| `/(cleaner)/cleaner/wallet` | **Wallet** | Balance, withdraw. |
| `/cleaner/calendar` | **Calendar** | Availability, booked slots. |
| `/cleaner/availability` | **Availability** | Set hours, block dates. |
| `/cleaner/profile` | **Profile** | Name, photo, bio, services. |

### 2.4 Growth & tools

| Route | Purpose | Features |
|-------|---------|----------|
| `/cleaner/reviews` | **My reviews** | Ratings, client feedback. |
| `/cleaner/progress` | **Progress** | Levels, goals, badges. |
| `/cleaner/rewards` | **Rewards** | Redeem rewards. |
| `/cleaner/ai-assistant` | **AI assistant** | Quick replies, templates, chat. |

### 2.5 Cleaner flow summary

- **New cleaner:** Register (as cleaner) → Onboarding → Cleaner home (`/cleaner`) → Set availability → New requests → Accept → Today → Workflow → Get paid.
- **Returning:** Cleaner home → Today’s jobs or New requests; Earnings and Profile as needed.
- **Options we emphasize:** Today vs requests vs full job list; one-tap “Start” for today’s job; clear workflow steps and evidence.

---

## 3. Shared & role-agnostic

| Route | Purpose |
|-------|---------|
| `/` | Marketing landing (everyone). |
| `/auth/login`, `/auth/register` | Auth (role chosen on register). |
| `/messages` | Messages (client + cleaner). |
| `/notifications` | Notifications. |
| `/help` | Help center. |
| `/favorites` | Saved cleaners (client). |

---

## 4. Nav and entry behavior

- **Header (desktop):** Role-specific main nav.
  - **Client:** Home, Book, My Bookings, Credits, (I’m a Cleaner).
  - **Cleaner:** Home, Today, Requests, Earnings, (optional Progress).
- **Mobile:** Same items in MobileNav, grouped by flow.
- **Post-login redirect:**
  - Client → `/client` (hub).
  - Cleaner → `/cleaner` (hub).
- **“Book” for client** can go to `/client/book` (choice) or directly to `/search`; **“Today” for cleaner** goes to `/cleaner/today`.

This keeps customer and cleaner flows distinct while reusing shared pieces (auth, messages, help) and design system (trust, evidence, one primary CTA).
