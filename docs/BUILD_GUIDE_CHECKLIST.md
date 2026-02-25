# Build Guide — Implementation Checklist

This checklist maps **Part 1 (Assets guide)** of [FRONTEND_BUILD_GUIDE.md](./FRONTEND_BUILD_GUIDE.md) to the current codebase. Use it to see what’s done and what’s missing.

**Legend:** ✅ Done | 🟡 Partial | ❌ Not done

---

## 1. Auth

| Item | Status | Where / Notes |
|------|--------|----------------|
| Login page | ✅ | `src/app/auth/login/page.tsx` |
| Register page | ✅ | `src/app/auth/register/page.tsx` |
| Profile/Me (settings) | ✅ | Client: `client/settings` (Profile tab + Security = change password). Cleaner: `cleaner/profile` |
| Login form (email, password) | ✅ | Login page |
| Register form (+ role?) | ✅ | Register page |
| Profile form (name, avatar) | ✅ | `ProfileEditForm` in client settings |
| Change password form | ✅ | `ChangePasswordForm` in client settings → Security tab |
| Button loading during login/register | ✅ | Login/register use `isLoading` |
| Profile loading skeleton | ✅ | `ProfileSkeleton` in `ProfileEditForm` when loading |
| 401 → redirect to login | ✅ | `ProtectedRoute` + api interceptor |
| Validation/400, wrong-credentials message | 🟡 | Toast from AuthContext; inline validation can be expanded |

---

## 2. Credits (Trust — client)

| Item | Status | Where / Notes |
|------|--------|----------------|
| Credits dashboard (balance + ledger) | ✅ | `src/app/client/credits-trust/page.tsx` |
| Buy credits / checkout entry | ✅ | Same page: package selector + Buy credits → checkout URL |
| Balance card (balance, currency, lastUpdatedISO) | ✅ | Prominent card with gradient |
| Ledger table (id, createdAtISO, type, amount, description, status, relatedBookingId, invoiceId) | ✅ | Table + filters (from, to, type, status, search) |
| Package selector | ✅ | Dropdown + Buy credits button |
| Success/cancel redirect (?success=1, ?cancel=1) | ✅ | useEffect + toast + invalidate |
| Empty: “No transactions yet” + CTA buy credits | ✅ | `EmptyLedger` |
| Loading: balance + ledger skeletons | ✅ | Card skeleton, `LedgerSkeleton` × 5 |
| 403/401 handling | ✅ | ProtectedRoute client; error card on balance/ledger fail |
| Wallet icon | ✅ | Lucide `Wallet` on balance card |

---

## 3. Billing / Invoices (Trust — client)

| Item | Status | Where / Notes |
|------|--------|----------------|
| Invoices list | ✅ | `src/app/client/billing-trust/page.tsx` |
| Invoice detail | ✅ | `src/app/client/billing-trust/[id]/page.tsx` |
| List: date, status, total, bookingId → link to detail | ✅ | Table + “View” link |
| Detail: subtotal, tax, total, line items, payment method summary | ✅ | Detail page |
| Pay button (Credits \| Card) | ✅ | Inline on list; on detail: choose Credits/Card + Pay |
| Empty: “No invoices yet” | ✅ | `EmptyInvoices` |
| Loading: table/card skeleton, detail skeleton | ✅ | `CardSkeleton` on list; Skeleton on detail |
| 404 not found / not owned | ✅ | Detail page: “Invoice not found or you don’t have access” |
| Document/card icons | 🟡 | Lucide `FileText`, `CreditCard`, `Banknote` on detail |

---

## 4. Live Appointment (Trust)

| Item | Status | Where / Notes |
|------|--------|----------------|
| Live appointment view (role-aware) | ✅ | `src/app/client/appointments/[bookingId]/live-trust/page.tsx` (ProtectedRoute, no role so client + cleaner) |
| Status stepper (scheduled → en_route → arrived → checked_in → completed) | ✅ | Stepper with current step |
| ETA line (“Arriving by HH:MM”) | ✅ | Blue callout when etaISO |
| Map (plot gps[]) | 🟡 | Placeholder block + “Waiting for location” / “GPS data available” + list of points (no real map) |
| Photos grid (before/after, url, createdAtISO) | ✅ | Grid when photos exist |
| Checklist (id, label, completed, completedAtISO) | ✅ | List with ✓ / empty box |
| Events timeline | ✅ | List of events |
| Cleaner: En route, Arrived, Check in, Check out | ✅ | Action buttons |
| 501 check_in/check_out → message + link to full tracking | ✅ | Amber card + “My jobs” + copy |
| Empty: no GPS “Waiting for location”; no photos “No photos yet” | ✅ | In placeholder and photos section |
| Loading: map placeholder, list skeletons | 🟡 | Skeleton for initial load; map is placeholder only |
| Socket.IO real-time | ❌ | Not wired; page uses refetchInterval only |

---

## 5. Reliability (client viewing cleaner)

| Item | Status | Where / Notes |
|------|--------|----------------|
| Section on cleaner profile | ✅ | `src/app/cleaner/[id]/page.tsx` — Reliability score card |
| Score (0–100) + tier badge | ✅ | `ReliabilityScoreCard` |
| Breakdown (onTimePct, etc.) | ✅ | `ReliabilityBreakdownBars` |
| Explainers list | ✅ | `ReliabilityWhyThisMatch` |
| Empty: “Reliability data not available” | ✅ | Shown when no reliability data |
| Loading: ring/score skeleton | 🟡 | General loading for whole profile; no dedicated reliability skeleton |
| 404 cleaner not found | ✅ | “Cleaner Not Found” card |

---

## 6. Bookings / Jobs (client & cleaner)

| Item | Status | Where / Notes |
|------|--------|----------------|
| My bookings (client) | ✅ | `src/app/client/bookings/page.tsx` |
| My jobs (cleaner) | ✅ | `cleaner/jobs/[id]`, `cleaner/jobs/requests`, etc. |
| Booking/Job detail | ✅ | `client/bookings/[id]`, `(client)/client/job/[jobId]`, `cleaner/jobs/[id]` |
| Job details (rich) | ✅ | `JobDetailsTracking` on client booking detail; `getJobDetails` / job details APIs |
| Job tracking (live) | ✅ | `useJobTrackingPoll`, JobDetailsTracking; cleaner: `cleaner/job/[jobId]/tracking` |
| List: date, time, address, status, cleaner → detail | ✅ | Cards/tables + links |
| Detail: status, timeline, photos, ledger, Cancel, Complete, Review | ✅ | Client job page: timeline, photos, Approve, Dispute |
| Empty: No bookings/jobs + CTA | ✅ | `EmptyBookings`; cleaner lists have empty handling |
| Loading: JobRowSkeleton, CardSkeleton | ✅ | Used on dashboard/bookings |
| Status pills (getJobStatusLabel / getJobStatusBadgeClass) | ✅ | Used on client booking detail and elsewhere |

---

## 7. Tracking (check-in / check-out / approve / dispute)

| Item | Status | Where / Notes |
|------|--------|----------------|
| Job tracking view | ✅ | `cleaner/job/[jobId]/tracking` + workflow page |
| Check-in flow (location + before photos) | ✅ | Tracking page: PhotoUploader before → Check in (location + beforePhotos) via POST `/tracking/:jobId/check-in` |
| Check-out flow (after photos, notes) | ✅ | Tracking page: PhotoUploader after + notes → POST `/tracking/:jobId/check-out` |
| Approve (client) | ✅ | `(client)/client/job/[jobId]/page.tsx` → `approveJob` (POST `/tracking/:jobId/approve`) |
| Dispute (client) | ✅ | `(client)/client/job/[jobId]/dispute/page.tsx` → `openDispute` (POST `/tracking/:jobId/dispute`) |
| Stepper/timeline from GET `/tracking/:jobId` | ✅ | JobDetailsTracking + useJobTrackingPoll; workflow uses timeline |
| Photo flow: sign → PUT → commit | ✅ | `PhotoUploader` + `uploads.ts` |
| Empty: “Waiting for activity” | 🟡 | Timeline in JobDetailsTracking shows events; no explicit “Waiting for activity” on tracking page |
| Upload progress + retry | ✅ | PhotoUploader progress bar + Retry on error |
| Link from live 501 to full tracking | ✅ | Live-trust 501 card links to My jobs + copy |

---

## 8. Cleaner (profile, schedule, earnings)

| Item | Status | Where / Notes |
|------|--------|----------------|
| My profile | ✅ | `src/app/cleaner/profile/page.tsx` |
| Availability | ✅ | `cleaner/availability/page.tsx` |
| Schedule (calendar) | ✅ | `cleaner/calendar/page.tsx` |
| Earnings summary | ✅ | `cleaner/earnings/page.tsx` (with next payout banner) |
| Payouts list | ✅ | Earnings/payouts in cleaner area |
| Profile form (PATCH) | ✅ | Cleaner profile tab |
| Availability editor, schedule view | ✅ | Availability + calendar pages |
| Earnings cards + breakdown; Request payout | ✅ | Earnings page |
| Empty: no jobs scheduled; no payouts; no earnings | 🟡 | Some pages have empty states; can standardize with EmptyState |
| Profile/calendar/earnings skeletons | 🟡 | Loading used; dedicated skeletons in places |

---

## 9. Client (favorites, dashboard, settings)

| Item | Status | Where / Notes |
|------|--------|----------------|
| Favorites | ✅ | `src/app/favorites/page.tsx` + EmptyFavorites |
| Dashboard (insights) | ✅ | `client/dashboard/page.tsx` + insights/recommendations |
| Payment methods | ✅ | Client settings → Payment methods tab |
| Addresses | ✅ | `client/address/page.tsx` + settings Addresses tab |
| Favorites list (GET, add, remove) | ✅ | favoritesService + mutations |
| Dashboard cards (insights, recommendations) | ✅ | StatsOverview, insights cards, recommendations |
| Payment methods list (default, delete) | ✅ | Settings Payment methods tab |
| Addresses list (default, delete) | ✅ | Settings + address page |
| Empty: no favorites; no payment methods; no addresses | ✅ | EmptyFavorites; settings can show empty lists |
| 501/stub handling | 🟡 | Some endpoints may be stubs; graceful empty used where needed |

---

## 10. Messages & Notifications

| Item | Status | Where / Notes |
|------|--------|----------------|
| Conversations list | ✅ | `src/app/messages/page.tsx` + useConversations |
| Thread (job or user) | ✅ | ChatWindow / thread in messages page |
| Notifications list | ✅ | `src/app/notifications/page.tsx` |
| Unread count in header | ✅ | `NotificationBell` in Header |
| Send message, mark read | ✅ | useMessages; mark read may be no-op if backend not ready |
| Mark all read | 🟡 | Notifications page has button; backend may not support |
| Empty: No conversations; No notifications | ✅ | EmptyMessages on messages; notifications page uses mock list (no API empty state yet) |
| List/thread skeleton | ✅ | SkeletonList on messages |

---

## 11. Admin

| Item | Status | Where / Notes |
|------|--------|----------------|
| Dashboard | ✅ | `admin/dashboard/page.tsx` (overview, realtime, alerts) |
| Users | ✅ | `admin/users/page.tsx` (table, filters, pagination, PATCH status/role) |
| Bookings/Jobs | ✅ | `admin/bookings/page.tsx` |
| Finance | ✅ | `admin/finance/page.tsx` |
| Disputes / Risk | ✅ | `admin/disputes/page.tsx`, `admin/risk/page.tsx` |
| Settings | ✅ | `admin/settings/page.tsx` |
| Resolve dispute (POST resolve-dispute + admin_notes) | ✅ | Disputes page modal → POST `/admin/jobs/:id/resolve-dispute` |
| Empty: No users match; No disputes; etc. | ✅ | EmptyAdminUsers, EmptyAdminBookings; disputes “No Disputes” card |
| Table/dashboard skeletons | ✅ | SkeletonList, Loading, etc. |
| 403 not admin | ✅ | ProtectedRoute requiredRole="admin" |

---

## Shared assets (guide)

| Asset | Status | Where / Notes |
|-------|--------|----------------|
| Button, Input, Card, Badge | ✅ | `src/components/ui/` |
| EmptyState + EmptyBookings, EmptyCleaners | ✅ | `EmptyState.tsx` |
| EmptyInvoices, EmptyNotifications | 🟡 | EmptyInvoices ✅; EmptyNotifications not added (notifications page uses inline empty or mock data) |
| LedgerSkeleton, CardSkeleton, JobRowSkeleton, ProfileSkeleton | ✅ | `src/components/ui/skeleton/` |
| ErrorDisplay | ✅ | `src/components/error/ErrorDisplay.tsx` |
| getJobStatusLabel, getJobStatusBadgeClass | ✅ | `src/constants/jobStatus.ts` |
| ProtectedRoute | ✅ | `src/components/auth/ProtectedRoute.tsx` |
| PWA manifest | ✅ | `public/manifest.json` + layout metadata |
| PWA icon-192, icon-512 | ❌ | Placeholder paths in manifest; files not created |

---

## Summary

- **Done:** Auth, Credits Trust, Billing Trust, Live Appointment (except real map + Socket.IO), Reliability, Bookings/Jobs, Tracking (check-in/check-out/approve/dispute), Cleaner screens, Client (favorites/dashboard/settings), Messages, Notifications list + badge, Admin (dashboard/users/bookings/finance/disputes/settings), and shared UI/skeletons/empty states.
- **Partial:** Live map (placeholder only), Socket.IO for live appointment, reliability loading skeleton, “Waiting for activity” on tracking, notifications “Mark all read” and API-driven empty state, some cleaner/client empty states, PWA icons.
- **Not done:** Real PWA icon assets (icon-192.png, icon-512.png); optional EmptyNotifications component if you want it for notifications page.

If you want to close gaps, the next useful additions are: **EmptyNotifications** (and use it on notifications page when list is empty), **PWA icons** (add or generate icon-192/512), and **Socket.IO** for live appointment real-time updates.
