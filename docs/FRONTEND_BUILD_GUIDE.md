# Frontend Build Guide

This guide has two parts:

1. **Assets guide** — What UI assets to build per area (from the Backend → Frontend UI Spec).
2. **How-to: Create, design, implement, and connect** — Step-by-step process for pages, systems, features, and functions.

**Source:** [Backend → Frontend UI Spec](#) (Auth, Credits, Billing, Live Appointment, Reliability, Bookings/Jobs, Tracking, Cleaner, Client, Messages, Admin). Exact APIs: [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md), [TRUST_FRONTEND_BACKEND_SPEC.md](./TRUST_FRONTEND_BACKEND_SPEC.md).

---

# Part 1 — Assets guide

For each area, list **screens**, **data to show**, **actions**, and **assets to build** (components, empty/loading/error states, icons, copy). Use this as a checklist when building or refining UI.

---

## 1. Auth

| Asset type | What to build |
|------------|----------------|
| **Screens** | Login page, Register page, Profile/Me (or settings section). |
| **Components** | Login form (email, password), Register form (+ role if needed), Profile form (name, avatar), Change password form. |
| **Empty / N/A** | No list empty state. |
| **Loading** | Button loading state during login/register; full-page or card skeleton for profile load. |
| **Error** | Inline validation (400); 401 → redirect to login; toast or inline message for wrong credentials. |
| **Icons / visuals** | Lock or key for login; optional success checkmark after register. |

**Data:** GET `/auth/me` → user, profile. **Actions:** POST `/auth/login`, POST `/auth/register`, PATCH profile, logout (drop token).

---

## 2. Credits (Trust — client)

| Asset type | What to build |
|------------|----------------|
| **Screens** | Credits dashboard (balance + ledger), Buy credits / checkout entry. |
| **Components** | Balance card (balance, currency, lastUpdatedISO); Ledger table or list (id, createdAtISO, type, amount, description, status, relatedBookingId, invoiceId); Package selector; Success/cancel redirect handling (?success=1, ?cancel=1). |
| **Empty** | “No transactions yet” + CTA to buy credits. |
| **Loading** | Skeleton for balance card and ledger rows. |
| **Error** | 403 → not client; 401 → login. Toast on checkout failure. |
| **Icons** | Wallet or coin for balance; receipt/list for ledger. |

**Data:** GET `/api/credits/balance`, GET `/api/credits/ledger`. **Actions:** POST `/api/credits/checkout` or `/credits/checkout` (packageId, successUrl, cancelUrl) → redirect to checkoutUrl.

---

## 3. Billing / Invoices (Trust — client)

| Asset type | What to build |
|------------|----------------|
| **Screens** | Invoices list, Invoice detail. |
| **Components** | List: table or cards (date, status, total, bookingId) → link to detail. Detail: subtotal, tax, total, line items, payment method summary; **Pay** button. Pay modal/inline: choose Credits or Card → POST pay. |
| **Empty** | “No invoices yet.” |
| **Loading** | Table/card skeleton; detail skeleton. |
| **Error** | 404 not found / not owned; 403 not client; 401 login. |
| **Icons** | Document/invoice icon; card vs credits for payment method. |

**Data:** GET `/api/billing/invoices`, GET `/api/billing/invoices/:id`. **Actions:** POST `/api/client/invoices/:id/pay` (payment_method: credits \| card).

---

## 4. Live Appointment (Trust — client or cleaner)

| Asset type | What to build |
|------------|----------------|
| **Screens** | Live appointment view (one screen, role-aware). |
| **Components** | Status badge or stepper (scheduled \| en_route \| arrived \| checked_in \| completed); ETA line (“Arriving by 14:35”); Map (plot gps[]); Photos grid (before/after, url, createdAtISO); Checklist (id, label, completed, completedAtISO); Events timeline. Cleaner: “En route”, “Arrived”, “Add note”; if 501 for check_in/check_out → message + link to full tracking flow. |
| **Empty** | No GPS yet: “Waiting for location”; no photos: “No photos yet.” |
| **Loading** | Map placeholder/skeleton; list skeletons. |
| **Error** | 404 not participant; 403 post-event not cleaner; **501** check_in/check_out → “Use full check-in with photos” + link to `/tracking/:jobId` check-in. |
| **Icons** | Map pin, clock (ETA), image (photos), checklist. |

**Data:** GET `/api/appointments/:bookingId/live`. **Actions:** POST `/api/appointments/:bookingId/events`; Socket.IO room `booking:${bookingId}` for real-time.

---

## 5. Reliability (client viewing cleaner)

| Asset type | What to build |
|------------|----------------|
| **Screens** | Section on cleaner profile (or dedicated reliability block). |
| **Components** | Score (0–100): ring or number; Tier badge (Excellent \| Good \| Watch \| Risk); Breakdown (onTimePct, completionPct, cancellationPct, communicationPct, qualityPct) — bars or list; Explainers list. |
| **Empty** | “Reliability data not available.” |
| **Loading** | Ring or score skeleton. |
| **Error** | 404 cleaner not found; 401 login. |
| **Icons** | Shield or gauge for score; tier colors. |

**Data:** GET `/cleaners/:cleanerId/reliability` or `/api/cleaners/:cleanerId/reliability`.

---

## 6. Bookings / Jobs (client & cleaner)

| Asset type | What to build |
|------------|----------------|
| **Screens** | My bookings (client), My jobs (cleaner), Booking/Job detail, Job details (rich), Job tracking (live). |
| **Components** | List: cards or table (date, time, address, status, cleaner name) → detail. Detail: status, timeline, photos, ledger entries, payment/receipt; Cancel, Complete, Review. Rich: JobDetailsTracking (timeline, reliability ring, ledger, presence, photos). Tracking: stepper/timeline; Check-in (with before photos), Check-out (after photos), Approve, Dispute. |
| **Empty** | “No bookings yet” / “No jobs yet” + CTA (Book a cleaner / View requests). |
| **Loading** | JobRowSkeleton, CardSkeleton, map placeholder. |
| **Error** | 404 not found/not participant; 403 role; 401 login. |
| **Icons** | Calendar, map pin, user (cleaner), status pills (use `getJobStatusBadgeClass`). |

**Data:** GET `/bookings/me`, GET `/jobs/me`, GET `/bookings/:id`, GET `/jobs/:id/details`, GET `/tracking/:jobId`. **Actions:** Cancel, complete, review; check-in, check-out, approve, dispute (see Tracking).

---

## 7. Tracking (check-in / check-out / approve / dispute)

| Asset type | What to build |
|------------|----------------|
| **Screens** | Job tracking view; Check-in flow (location + before photos); Check-out flow (after photos, notes); Approve (client); Dispute (client). |
| **Components** | Stepper/timeline from GET `/tracking/:jobId`; Check-in form (location, beforePhotos via upload flow); Check-out form (after photos, notes); Approve button (+ optional rating/tip); Dispute form (reason, description). Photo flow: POST `/uploads/sign` → PUT to putUrl → POST `/jobs/:jobId/photos/commit`. |
| **Empty** | No timeline events yet: “Waiting for activity.” |
| **Loading** | Stepper skeleton; upload progress (e.g. PhotoUploader with progress + retry). |
| **Error** | 403 wrong role; 401 login; 501 check_in/check_out on Trust live → link to full tracking. |
| **Icons** | Location pin, camera (photos), check (approve), alert (dispute). |

**Actions:** POST `/tracking/:jobId/check-in`, check-out, approve, dispute.

---

## 8. Cleaner (profile, schedule, earnings)

| Asset type | What to build |
|------------|----------------|
| **Screens** | My profile, Availability, Schedule (calendar), Earnings summary, Payouts list. |
| **Components** | Profile form (PATCH `/cleaner/profile`); Availability editor (GET/PUT availability, time-off, preferences); Schedule view (GET `/cleaner/schedule` ?from, to; single-date view); Earnings cards + breakdown; Payouts table; Request payout button. |
| **Empty** | “No jobs scheduled”; “No payouts yet”; “No earnings in this period.” |
| **Loading** | Profile skeleton; calendar/schedule skeleton; earnings cards skeleton. |
| **Error** | 403 not cleaner; 401 login. |
| **Icons** | User, calendar, dollar, bank/payout. |

**Data:** GET `/cleaner/profile`, `/cleaner/availability`, `/cleaner/schedule`, `/cleaner/earnings`, `/cleaner/payouts`. **Actions:** PATCH profile, PUT availability, POST `/payouts/request`.

---

## 9. Client (favorites, dashboard, settings)

| Asset type | What to build |
|------------|----------------|
| **Screens** | Favorites, Dashboard (insights), Payment methods, Addresses. |
| **Components** | Favorites list (GET, POST add, DELETE remove); Dashboard cards (insights, recommendations); Payment methods list (default, delete); Addresses list (default, delete). |
| **Empty** | “No favorites”; “No saved payment methods”; “No saved addresses.” |
| **Loading** | Card/list skeletons. |
| **Error** | 501 or stub → show “Coming soon” or graceful empty; 401 login. |
| **Icons** | Heart (favorites), chart (insights), card, map pin. |

**Data:** GET `/client/favorites`, `/client/dashboard/insights`, `/client/payment-methods`, `/client/addresses`. **Actions:** POST/DELETE favorites; set default/delete payment methods and addresses.

---

## 10. Messages & Notifications

| Asset type | What to build |
|------------|----------------|
| **Screens** | Conversations list, Thread (job or user); Notifications list + badge. |
| **Components** | Conversations list; Thread: message list + send form; mark read. Notifications: list + unread count in header; “Mark all read.” |
| **Empty** | “No conversations”; “No notifications.” |
| **Loading** | List skeleton; thread skeleton. |
| **Error** | 401 login; read state may be no-op (see BACKEND_ENDPOINTS). |
| **Icons** | Message bubble, bell (notifications). |

**Data:** GET `/messages/conversations`, `/messages/job/:jobId` or `/messages/with/:userId`, GET `/notifications`, `/notifications/unread-count`. **Actions:** POST send, PATCH read, POST read-all.

---

## 11. Admin

| Asset type | What to build |
|------------|----------------|
| **Screens** | Dashboard, Users, Bookings/Jobs, Finance, Disputes/Risk, Settings. |
| **Components** | Dashboard: overview cards, realtime, alerts. Users: table (filters, pagination), detail, PATCH status/role, risk actions. Bookings/Jobs: table, detail, cancel, resolve dispute (POST `/admin/jobs/:jobId/resolve-dispute` with resolution, admin_notes). Finance: transactions, refund. Disputes: queue, resolve. Settings: GET/PATCH, feature flags. |
| **Empty** | “No users match”; “No disputes”; etc. |
| **Loading** | Table skeletons; dashboard card skeletons. |
| **Error** | 403 not admin; 401 login. |
| **Icons** | Chart, users, file, dispute, settings. |

**Data:** GET `/admin/*` (analytics, users, bookings, finance, disputes, settings). **Actions:** PATCH, POST resolve-dispute, refund, etc.

---

## Shared assets (all areas)

| Asset | Purpose |
|-------|--------|
| **Button, Input, Card, Badge** | Use from `src/components/ui/`. |
| **EmptyState, EmptyBookings, EmptyCleaners** | Use from `src/components/ui/EmptyState.tsx`; add EmptyInvoices, EmptyNotifications if needed. |
| **LoadingSpinner, Skeleton (JobRow, Card, etc.)** | Use from `src/components/ui/` and `src/components/ui/skeleton/`. |
| **ErrorDisplay** | Use from `src/components/error/ErrorDisplay.tsx` for 404/500. |
| **Status labels/badges** | Use `getJobStatusLabel`, `getJobStatusBadgeClass` from `src/constants/jobStatus.ts`. |
| **ProtectedRoute** | Wrap role-gated pages; redirect on 401/403. |
| **PWA** | `public/manifest.json`; add `icon-192.png`, `icon-512.png` when ready. |

---

# Part 2 — How-to: Create, design, implement, and connect

Use this process for **any** new or existing page/feature so screens, data, actions, and states stay aligned with the backend.

---

## Step 1 — Create (scaffold)

1. **Route**  
   Add the page under `src/app/` following existing patterns:
   - Client: `(client)/client/...` or `client/...`
   - Cleaner: `(cleaner)/cleaner/...` or `cleaner/...`
   - Admin: `admin/...`
   - Public: `search`, `booking`, `auth/...`

2. **Layout**  
   Use `Header` + `Footer` (or role-specific layout); wrap in `ProtectedRoute` with `requiredRole` when the page is role-gated.

3. **Entry**  
   Ensure the page is reachable from nav, dashboard, or another page (link or redirect).

**Example:** New “Invoices” list for client → `src/app/client/invoices/page.tsx`, wrapped in `<ProtectedRoute requiredRole="client">`, linked from client dashboard or credits.

---

## Step 2 — Design (data + actions + states)

1. **Data**  
   From the [Backend → Frontend UI Spec](#) (or BACKEND_ENDPOINTS):
   - Which **GET** endpoint(s) feed this screen?
   - Which fields do you show? (list columns, detail cards, labels)

2. **Actions**  
   Which **POST/PATCH/DELETE** does the user trigger? (buttons, forms, links)
   - Method, path, body shape (see TRUST_FRONTEND_BACKEND_SPEC or BACKEND_ENDPOINTS).

3. **States**  
   - **Loading:** Skeleton or spinner while data is loading.
   - **Empty:** No data (e.g. “No invoices yet”) + optional CTA.
   - **Error:** 401 → redirect to login; 403 → “You don’t have access”; 404 → “Not found”; 501 → “This action isn’t available” + optional link to alternative flow.
   - **Success:** Toast or inline success after an action; refetch or invalidate query.

Write this down in a short table (Screen → GET; Actions → POST/PATCH; States → loading, empty, 401, 403, 404, 501) before coding.

---

## Step 3 — Implement (services, hooks, UI)

1. **Service**  
   In `src/services/`, add or reuse a function that calls `apiClient.get/post/patch/delete` with the correct path and body. Use types for request/response (e.g. from BACKEND_ENDPOINTS or TRUST_FRONTEND_BACKEND_SPEC).

   ```ts
   // e.g. src/services/credits.service.ts
   export async function getCreditsBalance() {
     return apiClient.get<{ balance: number; currency: string }>('/api/credits/balance');
   }
   ```

2. **Hook**  
   In `src/hooks/`, add a hook that uses `useQuery` or `useMutation` (TanStack Query) and calls the service. Handle loading, error, and success (invalidate queries on mutation success).

   ```ts
   // e.g. useCreditsBalance.ts
   export function useCreditsBalance() {
     return useQuery({ queryKey: ['credits', 'balance'], queryFn: getCreditsBalance });
   }
   ```

3. **UI**  
   In the page (or a dedicated component):
   - Use the hook; render **loading** (skeleton/spinner), **error** (ErrorDisplay or toast), **empty** (EmptyState), and **data** (cards, table, form).
   - Wire buttons/forms to **mutations** (or `apiClient` in event handlers) with the correct method/path/body.
   - Use shared components: Button, Card, Input, Badge, EmptyState, etc.

---

## Step 4 — Connect (wire API → UI, handle errors)

1. **Base URL**  
   All requests go through `apiClient` (e.g. `src/lib/api.ts`) which uses `API_CONFIG.baseURL` (from `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_API_URL`). Ensure `.env.local` has one correct line per variable (no concatenated values).

2. **Auth**  
   `apiClient` attaches `Authorization: Bearer <token>` from localStorage. On 401, the interceptor can clear token and redirect to login. Protected routes use `ProtectedRoute` so unauthenticated users are redirected.

3. **Role**  
   For role-gated screens, use `ProtectedRoute requiredRole="client"|"cleaner"|"admin"`. For role-gated **actions**, the backend returns 403; show a message or hide the button when the user role doesn’t match.

4. **Refetch after action**  
   After a successful mutation (e.g. add favorite, approve job, request payout), call `queryClient.invalidateQueries({ queryKey: [...] })` so the list or detail refetches and the UI updates.

5. **501 and stubs**  
   If the backend returns 501 or a stub, show a short message (“Use full check-in with photos”) and, if applicable, a link to the correct flow. Document stub behavior in BACKEND_ENDPOINTS.

---

## Checklist per new screen

- [ ] Route and layout (Header/Footer, ProtectedRoute if needed).
- [ ] Data: GET endpoint(s) and fields listed.
- [ ] Actions: POST/PATCH/DELETE and body shape.
- [ ] Service function(s) in `src/services/`.
- [ ] Hook(s) in `src/hooks/` (useQuery/useMutation).
- [ ] Loading state (skeleton or spinner).
- [ ] Empty state (EmptyState or custom + CTA).
- [ ] Error state (401/403/404/501 handled).
- [ ] Success feedback (toast or inline) and refetch.
- [ ] Link or nav entry to the screen.

---

## Related docs

- [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md) — Full endpoint list and stub status.
- [TRUST_FRONTEND_BACKEND_SPEC.md](./TRUST_FRONTEND_BACKEND_SPEC.md) — Request/response shapes (Trust).
- [TRUST_BACKEND_INTEGRATION.md](./TRUST_BACKEND_INTEGRATION.md) — Auth, CORS, errors, Socket.IO.
- [UI_UX_CHANGES_AND_REVIEW.md](./UI_UX_CHANGES_AND_REVIEW.md) — Recent UI/UX work and suggestions.
- [60_MINUTE_INTEGRATION_RUN_SHEET.md](./60_MINUTE_INTEGRATION_RUN_SHEET.md) — End-to-end test order.
