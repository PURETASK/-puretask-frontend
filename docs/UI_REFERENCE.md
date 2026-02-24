# PureTask UI – Pages, Behavior & Reference

This document describes every page, how the UI works, and important details you should know. It also suggests improvements.

---

## 1. Overview

**PureTask** is a Next.js frontend for a cleaning-services platform. It has three main user roles:

- **Client** – books cleaners, manages bookings, credits, billing, settings.
- **Cleaner** – calendar, jobs, earnings, gamification (progress, badges, goals), AI assistant.
- **Admin** – dashboards, users, bookings, finance, gamification config, risk, support tools.

**Tech:** Next.js (App Router), React, TypeScript, Tailwind CSS, Framer Motion, TanStack Query, custom API client. Global providers: Auth, Query, Toast, WebSocket, Notifications, Analytics, Error Boundary.

**Layout:** Each page typically uses `Header` + main content + `Footer`. On mobile/tablet (`lg` breakpoint and below), a **BottomNav** appears for clients and cleaners (Home, Bookings/Calendar, Messages, Profile). Admin and auth routes do not show BottomNav.

---

## 2. Global UI Building Blocks

### 2.1 Root layout (`src/app/layout.tsx`)

- Wraps the app with: `SkipNav` → `ErrorBoundary` → `QueryProvider` → `ToastProvider` → `AuthProvider` → `WebSocketProvider` → `NotificationProvider` → `ClientAnalyticsProvider`.
- Renders `{children}` inside `<main id="main-content">`, then `ToastContainer`, then `BottomNav`, then `AnalyticsInitializer`.
- Fonts: Geist (sans), Geist Mono. Metadata and viewport (theme-color, PWA hints) are set here.

### 2.2 Template & route transitions (`src/app/template.tsx`)

- Wraps all page content with **PageTransitionMotion** keyed by `pathname`.
- Every route change gets a consistent enter animation (fade + slide + blur) from `motionTokens.page`.

### 2.3 Header (`src/components/layout/Header.tsx`)

- **Left:** BackButton (history), logo (link to `/`), “PureTask” text (hidden on small screens).
- **Center (desktop):** Role-based nav – Home; for Admin: Admin Panel, Gamification; for Cleaner: My Dashboard, Progress; for Client: Find a Cleaner, My Bookings; for everyone: “I’m a Cleaner” (onboarding).
- **Right:** Search toggle (desktop), NotificationBell (if logged in), user avatar + role badge or Login/Sign Up.
- **Mobile:** Same header plus a second row of horizontal nav links and a mobile menu (MobileNav).
- **Search:** When expanded, a search input appears (placeholder: “Search bookings, cleaners, clients...”); actual search behavior may be wired to a global search component elsewhere.

### 2.4 Footer (`src/components/layout/Footer.tsx`)

- Multi-column links: Company (Home, Help, Terms, Privacy); For Clients (Search, Book, Dashboard, Bookings, Recurring, Settings, Favorites, Reviews); For Cleaners (Onboarding, Dashboard, Calendar, Team, Certifications, Progress, Leaderboard); AI Assistant (chat, quick responses, templates, saved, history, analytics, settings); Account (Login, Sign up, Forgot password, Dashboard, Messages, Notifications, Referral).
- Separate sections for Gamification (cleaner + admin links) and Admin Portal (dashboard, users, bookings, finance, analytics, etc.).
- Bottom bar: logo, “PureTask”, placeholder social links, copyright. Small link to API Test page.

### 2.5 Bottom navigation (`src/components/layout/BottomNav.tsx`)

- **Visibility:** Only on viewports below `lg`; hidden on `/admin/*` and `/auth/*`.
- **Client:** Home → `/client/dashboard`, Bookings → `/client/bookings`, Messages → `/messages`, Profile → `/client/settings`.
- **Cleaner:** Home → `/cleaner/dashboard`, Calendar → `/cleaner/calendar`, Messages → `/messages`, Profile → `/cleaner/profile`.
- Active state: current path or path prefix; active item uses blue styling.

### 2.6 Motion system

- **Tokens:** `src/components/motion/tokens.ts` – durations, eases, springs (soft/medium/snappy), hover (lift/press), page enter/exit, stagger, listItem.
- **Exports:** `PageTransitionMotion`, `AnimatedCardMotion`, `Stagger` / `StaggerItem`, `MotionFadeIn`, `motionTokens`.
- **Scroll reveals:** `ScrollRevealSection` (and optionally `ScrollRevealItem`) used on the landing page for sections (How It Works, Trust Badges, Testimonials, CTA).
- **Booking stepper:** `BookingStepper` (progress bar + step circles), `BookingStepContent` (direction-aware slide + fade) with Framer Motion.
- **Toggles:** `Toggle` uses `motion.span` and `motionTokens.spring.snappy` for the thumb.

---

## 3. Pages by Area

### 3.1 Public

| Route | Purpose |
|-------|--------|
| `/` | **Landing.** Hero, How It Works (ScrollRevealSection), Trust Badges, Testimonials, CTA (Find Cleaners → `/search`, Become a Cleaner → `/auth/register`). |
| `/search` | **Find cleaners.** Filters sidebar, list/map toggle, global search, saved searches, cleaner cards grid, pagination. Optional `?cleaner=id` from dashboard/booking. |
| `/booking` | **Create booking.** Optional `?cleaner=id`. 4-step stepper: 1) Date/Time + service + duration + holiday notice, 2) Cleaner summary + reliability + price estimate, 3) Address form, 4) Review. Draft auto-save, real-time price estimate. Submit → API create → redirect to confirmation. |
| `/booking/confirm/[id]` | **Booking confirmation.** Success Lottie, booking details card, Add to Calendar / Share, “What happens next” and tips, links to booking details / dashboard / book another. |
| `/cleaner/[id]` | **Cleaner profile (public).** Shown from search or recommendations; leads into booking with that cleaner. |
| `/terms` | Terms of Service. |
| `/privacy` | Privacy Policy. |
| `/help` | Help Center. |
| `/help/category/[categoryId]` | Help category – FAQs for that category. |
| `/cookies` | Cookie Policy. |

### 3.2 Auth

| Route | Purpose |
|-------|--------|
| `/auth` | Auth entry (likely redirect or choice). |
| `/auth/login` | Email/password, “Remember me”, Forgot password link, Google OAuth. On success: Lottie “Welcome back” then redirect by role (client/cleaner/admin). |
| `/auth/register` | Sign up (role selection and form). |
| `/auth/forgot-password` | Password reset request. |
| `/auth/reset-password` | Set new password (token in `?token=...`). Used when user clicks link from forgot-password email. |
| `/auth/verify-email` | Verify signup email (token in `?token=...`). Calls API then redirects to login. |

### 3.3 Client (role: client)

All under `ProtectedRoute requiredRole="client"`. Wrong role → redirect to that role’s dashboard.

| Route | Purpose |
|-------|--------|
| `/client/dashboard` | **My Dashboard.** Stats (total/upcoming/completed bookings, total spent), insights (booking pattern, favorite cleaner, credit expiration, last booking), recommended cleaners, upcoming booking cards (Stagger + AnimatedCardMotion), booking trends chart, activity feed. Links: Credits, Billing, “Book a Cleaner” (→ `/search`). BookingDetailsDrawer for quick peek. Loading: JobRowSkeleton. |
| `/client/bookings` | **My Bookings.** Tabs: All / Upcoming / Completed / Cancelled. List of BookingCards (Stagger + AnimatedCardMotion); click → `/client/bookings/[id]`. “Book a Cleaner” → `/search`. Mobile: PullToRefresh. Loading: JobRowSkeleton. |
| `/client/bookings/[id]` | **Booking detail.** Summary, status badge, JobDetailsTracking (before/after photos, presence map when available), live status, cancel (with confirm), Add to Calendar, Share. Links to live trust view and messages. Loading/error states. |
| `/client/appointments/[bookingId]/live` | Live appointment view (real-time tracking). |
| `/client/appointments/[bookingId]/live-trust` | Live “trust” view (e.g. tracking + verification). |
| `/client/settings` | **Settings.** Tabs: Profile, Payment Methods, Addresses, Notifications, Credit Settings, Security. ProfileEditForm, ChangePasswordForm; payment/address CRUD; notification toggles (currently native checkboxes; could use shared Toggle); credit balance + auto-refill config. |
| `/client/credits` | Credits balance and purchase. |
| `/client/credits-trust` | Credits + trust/verification info. |
| `/client/billing` | Billing overview. |
| `/client/billing-trust` | Billing + trust. |
| `/client/recurring` | Recurring bookings. |
| `/client/support` | Help & support – Help Center link, message cleaner, open dispute (email), contact support. |
| `/favorites` | Favorite cleaners. |
| `/reviews` | Write a review. |
| `/messages` | Messages (shared with cleaners). |
| `/notifications` | Notification list. |

### 3.4 Cleaner (role: cleaner)

| Route | Purpose |
|-------|--------|
| `/cleaner/dashboard` | Cleaner home: jobs, calendar summary, earnings preview. |
| `/cleaner/calendar` | Calendar view of jobs. |
| `/cleaner/jobs` (e.g. `/cleaner/jobs/[id]`, `/cleaner/jobs/requests`) | Job detail and job requests. |
| `/cleaner/availability` | Set availability. |
| `/cleaner/earnings` | Earnings history. |
| `/cleaner/profile` | Cleaner profile edit. |
| `/cleaner/onboarding` | “Become a cleaner” onboarding flow. |
| `/cleaner/progress` | Progress hub (gamification). |
| `/cleaner/progress/level/[levelNumber]` | Level detail. |
| `/cleaner/goals`, `/cleaner/goals/[goalId]` | Goals list and detail. |
| `/cleaner/rewards` | Rewards. |
| `/cleaner/badges` | Badges. |
| `/cleaner/stats` | Stats. |
| `/cleaner/leaderboard` | Leaderboard. |
| `/cleaner/maintenance` | Maintenance / status. |
| `/cleaner/certifications` | Certifications. |
| `/cleaner/team` | Team management. |
| `/cleaner/reviews` | My reviews – reviews from clients about this cleaner (placeholder until data exists). |
| `/cleaner/ai-assistant` | AI chat. |
| `/cleaner/ai-assistant/quick-responses` | Quick responses. |
| `/cleaner/ai-assistant/templates`, `/new`, etc. | Templates. |
| `/cleaner/ai-assistant/saved`, `/history`, `/analytics`, `/settings` | Saved, history, analytics, AI settings. |

### 3.5 Admin (role: admin)

| Route | Purpose |
|-------|--------|
| `/admin`, `/admin/dashboard` | Admin home / dashboard. |
| `/admin/settings` | Admin settings. |
| `/admin/users` | User management. |
| `/admin/bookings` | Booking management. |
| `/admin/finance` | Finance. |
| `/admin/analytics` | Analytics. |
| `/admin/reports` | Reports. |
| `/admin/communication` | Communication. |
| `/admin/risk` | Risk management. |
| `/admin/disputes` | Disputes. |
| `/admin/api` | API management. |
| `/admin/id-verifications` | ID verifications. |
| `/admin/support/cleaner/[cleanerId]/gamification` | Support: cleaner gamification debug. |
| `/admin/gamification` | Gamification overview. |
| `/admin/gamification/flags` | Feature flags. |
| `/admin/gamification/goals`, `/[goalId]` | Goals library. |
| `/admin/gamification/rewards`, `/[rewardId]` | Rewards. |
| `/admin/gamification/choices`, `/[choiceId]`, `/new` | Choice groups. |
| `/admin/gamification/governor` | Governor. |
| `/admin/gamification/abuse` | Abuse monitor. |
| `/admin/tools/*` | Various tools (quick responses, tooltips, templates, leaderboard, certifications, AI settings, etc.). |

### 3.6 Other

| Route | Purpose |
|-------|--------|
| `/referral` | Referral program. |
| `/dashboard` | Role-agnostic dashboard redirect/entry. |
| `/api-test` | API test page (linked from footer). |
| `/demo/trust` | Demo trust UI. |
| `/day3` | Dev/day-3 placeholder. |

---

## 4. How the UI Operates

### 4.1 Authentication and roles

- **AuthContext** provides `user`, `isAuthenticated`, `login`, `logout`, `isLoading`.
- **ProtectedRoute** wraps client/cleaner/admin pages: if not authenticated → redirect to `redirectTo` (default `/auth/login`). If `requiredRole` is set and user role doesn’t match → redirect to that role’s dashboard. While loading, a full-screen spinner is shown.
- **Header and BottomNav** use `user?.role` to show the right links and bottom nav set.

### 4.2 Data loading and errors

- **TanStack Query** is used for API data (bookings, cleaner, job details, tracking, preferences, etc.). Pages often show:
  - **Loading:** Skeleton components (e.g. `JobRowSkeleton`, `CardSkeleton`, `SkeletonList`) or a spinner.
  - **Error:** `ErrorDisplay` with retry and optional title/variant.
  - **Empty:** Empty-state components (e.g. `EmptyBookings`, `EmptyCleaners`) with primary actions (e.g. “Book a Cleaner”).
- **Toasts** (`useToast`) are used for success/info/error feedback (e.g. “Draft saved”, “Preferences saved”).

### 4.3 Booking flow (high level)

1. **Search** (`/search`) – filter/search cleaners, optional map.
2. **Cleaner profile** (`/cleaner/[id]`) – view then “Book” (or similar) → `/booking?cleaner=id`.
3. **Booking** (`/booking`) – 4-step stepper; draft auto-saved; price estimate; submit → POST booking.
4. **Confirmation** (`/booking/confirm/[id]`) – success screen, add to calendar, share, next steps.
5. **Booking detail** (`/client/bookings/[id]`) – full details, tracking, before/after, presence map, cancel, live/messages links.

### 4.4 Trust and job details

- **JobDetailsTracking** (booking detail page) shows before/after comparison (slider when both exist) and presence map card when data exists.
- **PresenceMapCard** and **BeforeAfterCompare** use the same motion/styling patterns. Job details and tracking are polled or pushed via hooks (e.g. `useJobDetails`, `useJobTrackingPoll`, `useLiveJobStatus`).

### 4.5 Responsive and mobile

- **BottomNav** only on smaller breakpoints; Header has a compact/mobile row and MobileNav.
- **PullToRefresh** on client bookings list on mobile.
- Touch targets and spacing follow accessibility (e.g. min height 44px where needed). SkipNav targets `#main-content`.

---

## 5. Important Information

### 5.1 Motion tokens

- Use **motionTokens** from `@/components/motion/tokens` (or re-exported from `@/components/motion`) for all Framer Motion transitions so the app feels consistent (page, cards, stagger, springs, hover).

### 5.2 Shared components

- **UI:** Button, Input, Card, Toggle (spring thumb), Avatar, Skeleton, LoadingSpinner, LottieSuccess, etc.
- **Features:** BookingStepper, BookingStepContent, DateTimePicker, ServiceSelection, BookingConfirmation, CreditsCounter, AnimatedCheckRow, CleanerCard, SearchFilters, BookingCard, StatsOverview, ActivityFeed, etc.
- **Trust/tracking:** JobDetailsTracking, BeforeAfterCompare, PresenceMapCard.
- **Layout:** Header, Footer, BottomNav, BackButton, MobileNav.

### 5.3 Environment and API

- API base URL and feature toggles (e.g. job details/tracking) are documented in `.env.example` and used via config. Job details and tracking paths depend on backend support.

### 5.4 Accessibility

- SkipNav, semantic HTML, ARIA where needed (e.g. `aria-label` on icon buttons, `role="switch"` on Toggle). Focus and keyboard flow should be kept in mind when adding modals or new flows.

---

## 6. Suggested Improvements

### 6.1 Consistency and polish

- **Settings toggles:** Use the shared **Toggle** component (with spring animation) in **Notification preferences** and **Credit settings** (auto-refill) instead of raw `<input type="checkbox">` for a consistent “premium” feel.
- **Search in Header:** Connect the Header search bar to the same search used on `/search` (e.g. GlobalSearch or a shared hook) so it actually filters bookings/cleaners/clients or navigates to search with a query.
- **Empty states:** Use the same empty-state component pattern (illustration + title + description + primary CTA) across all list pages (e.g. favorites, recurring, messages) for consistency.

### 6.2 Navigation and discovery

- **BottomNav for guests:** Consider a minimal bottom bar for logged-out users on mobile (e.g. Home, Find Cleaner, Login) to make discovery easier.
- **Breadcrumbs:** Add breadcrumbs on deep pages (e.g. booking detail, cleaner profile, admin sub-pages) to clarify context and improve back-navigation.
- **Footer simplification:** The footer is very long. Consider collapsing sections into “For Clients”, “For Cleaners”, “Company & Legal”, “Admin” (or hide admin in production) and moving gamification/admin links to a separate “Staff” or “Developer” area.

### 6.3 Performance and UX

- **Route prefetching:** Next.js prefetches links by default; ensure high-value routes (e.g. `/search`, `/booking`, `/client/dashboard`) are linked with `<Link>` so they’re prefetched.
- **Skeleton coverage:** Ensure every list/detail page that fetches data has a skeleton or loading state that matches the final layout (e.g. booking detail, cleaner profile, settings tabs).
- **Error messages:** Standardize API error handling so users see clear, actionable messages (e.g. “Couldn’t load bookings. Check your connection and try again”) and optional “Contact support” for 5xx.

### 6.4 Trust and transparency

- **Job details fallback:** When before/after or presence data isn’t available yet, show a clear “Tracking will appear when the job starts” or “Photos will appear after completion” instead of an empty block.
- **Status copy:** Use the same status labels everywhere (e.g. “Finding Cleaner” for pending, “In Progress” for in_progress) – consider a small `bookingStatusLabels` map used by booking card, detail, and confirmation.

### 6.5 Admin and tools

- **Admin guard:** Ensure all `/admin/*` routes are protected by `requiredRole="admin"` (or equivalent) so only admins can access.
- **Tool pages:** Many `/admin/tools/*` pages exist; consider a single “Tools” dashboard with cards linking to each tool, and hide or gate experimental tools behind a feature flag or env.

### 6.6 Documentation and maintenance

- **Storybook or component doc:** Document shared components (Button variants, Card, Toggle, BookingStepper, etc.) in a single place so new screens stay consistent.
- **Route list:** Keep this document (or a generated route list) in sync when adding/removing pages so onboarding and QA have a single source of truth.

---

## 7. Do We Need to Add Any Pages or Special Sections?

### 7.1 Recommended (fix gaps)

| Need | What | Why |
|------|------|-----|
| **Help category page** | `/help/category/[categoryId]` | ✅ Implemented. |
| **Set-new-password page** | `/auth/reset-password?token=...` | ✅ Implemented. Backend “forgot password” email link can point here. |
| **Verify-email page** | `/auth/verify-email?token=...` | ✅ Implemented. Signup verification link can point here. |
| **Cookie policy** | `/cookies` | ✅ Implemented; link in Footer. |
| **Root loading** | `src/app/loading.tsx` | ✅ Implemented. |
| **Client support entry** | `/client/support` | ✅ Implemented. |
| **Cleaner My reviews** | `/cleaner/reviews` | ✅ Implemented (placeholder). |

### 7.2 Optional (nice to have)

| Page or section | Where | Why |
|-----------------|--------|-----|
| ~~Client: Disputes / Support tickets~~ | ~~e.g. `/client/support`~~ | ✅ Implemented as `/client/support`. |
| ~~Cleaner: My reviews~~ | ~~e.g. `/cleaner/reviews`~~ | ✅ Implemented as `/cleaner/reviews`. |
| ~~Root `loading.tsx`~~ | ~~`src/app/loading.tsx`~~ | ✅ Implemented. |
| ~~Cookie policy~~ | ~~e.g. `/cookies`~~ | ✅ Implemented. |
| ~~Email verification~~ | ~~e.g. `/auth/verify-email?token=...`~~ | ✅ Implemented. |
| Maintenance / status | e.g. `/status` (public) | “All systems operational” or incident history. Builds trust; optional. |

### 7.3 Special sections (within existing pages)

| Section | Page | Suggestion |
|--------|------|------------|
| **Notification prefs** | Client Settings → Notifications | Use the shared **Toggle** component (spring) instead of raw checkboxes for consistency with the rest of the UI. |
| **Credit auto-refill** | Client Settings → Credit Settings | Same: use **Toggle** for the “Auto-refill credits” switch. |
| **Booking detail – “no tracking yet”** | `/client/bookings/[id]` | When before/after or presence data isn’t available, show a short message (e.g. “Tracking will appear when the job starts”) instead of an empty block. |
| **Client dashboard – empty state** | `/client/dashboard` | You have `EmptyBookings`; ensure first-time users see a clear CTA (e.g. “Book your first cleaner”) and maybe a short onboarding tip. |

### 7.4 Summary

- **You already have:** 404 (`not-found.tsx`), error (`error.tsx`), root loading (`loading.tsx`), landing, auth (login, register, forgot, **reset-password**, **verify-email**), full client/cleaner/admin flows, **client support** (`/client/support`), **cleaner reviews** (`/cleaner/reviews`), billing with invoices, help center + **help category**, **cookie policy** (`/cookies`).  
- **Optional:** Status page (`/status`); in-page improvements (Toggle in settings, empty-state copy).

---

*Last updated to reflect the codebase as of the UI polish work (motion, skeletons, booking stepper, landing scroll reveals, Toggle spring, job details tracking, and trust components).*
