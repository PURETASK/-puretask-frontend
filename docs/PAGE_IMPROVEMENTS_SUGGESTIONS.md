# Page-by-Page Improvement Suggestions

Actionable improvements for each major page/area. Grouped by section; each item is a concrete suggestion.

---

## Cross-cutting (all pages)

- **Document title & meta:** Set unique `<title>` and `description` per route (e.g. `metadata` in layout or page) for SEO and browser tabs.
- **Focus management:** After navigation or opening a modal, move focus to the main heading or first interactive element (e.g. `useEffect` + `ref.focus()`).
- **Skip link:** Add a “Skip to main content” link at the top of the layout for keyboard/screen-reader users.
- **Loading consistency:** Prefer skeleton UIs that match the final layout over a single spinner where possible.
- **Error boundary:** Wrap route segments in an error boundary so one page crash doesn’t blank the whole app.
- **Offline / network errors:** On key flows (login, booking, payment), detect offline or failed requests and show a clear message + retry.

---

## Landing (`/`)

- **Hero:** Add a short, visible “How it works” (e.g. 3 steps) so first-time visitors see the flow immediately.
- **CTAs:** Ensure both “Client” and “Cleaner” buttons have clear hover/focus styles and `aria-label` if the text is icon-only.
- **Trust badges:** Replace emoji with small icons or illustrations for a more polished look.
- **Testimonials:** If they’re static, add “Testimonial” or “Review” in a way that’s accessible (e.g. `role="region" aria-label="Reviews"`).
- **Performance:** Lazy-load below-the-fold sections (e.g. testimonials, trust badges) to improve LCP.

---

## Auth

### Login (`/auth/login`)

- **Inline validation:** Show field-level errors (e.g. invalid email, empty password) before submit, in addition to toast on 401.
- **Password visibility toggle:** Add a button to show/hide password; ensure it has `aria-label`.
- **Rate limiting / lockout:** If the backend returns 429 or “too many attempts,” show a specific message and optional countdown.
- **Remember me:** If you add a “Remember me” option, document behavior (e.g. longer-lived token vs session).

### Register (`/auth/register`)

- **Password strength:** Show a simple strength indicator and minimum rules (length, character types).
- **Role selector:** If role is optional, make the default and options clear (e.g. “I’m booking as a client” / “I want to work as a cleaner”).
- **Success:** After register, consider a short confirmation message before redirect to dashboard (e.g. “Account created. Taking you to your dashboard…”).

### Forgot / Reset password (`/auth/forgot-password`, `/auth/reset-password`)

- **Forgot:** Confirm “If an account exists, we’ve sent an email” to avoid leaking existence of emails.
- **Reset:** Match token-in-URL flow with backend; show clear error if link is expired or invalid.

### Profile / Settings (client: `/client/settings`; cleaner: `/cleaner/profile`)

- **Tabs:** Give each tab an `id` and use `aria-selected` / `role="tablist"` for proper tab semantics.
- **Unsaved changes:** Warn when leaving with unsaved edits (e.g. `beforeunload` or router prompt).
- **Avatar:** After upload, show a small success state or thumbnail so the user sees the new image immediately.

---

## Client

### Dashboard (`/client/dashboard`)

- **Error states:** If `useBookings` or insights fail, show an error card with retry instead of failing the whole page.
- **Empty insights:** When there are no insights yet, show a short “Complete a booking to see insights” instead of an empty block.
- **Chart:** Ensure the booking-trends chart has a visible legend or labels and is readable when zoomed or on small screens.
- **Links:** Make “Credits” and “Invoices” look like primary actions (e.g. same style as “Book a Cleaner”) or group under “Wallet.”

### Bookings list (`/client/bookings`)

- **Filters:** Add quick filters (e.g. Upcoming, Past, Cancelled) if the list can get long.
- **Empty state:** Use `EmptyBookings` with a CTA to search/book; ensure it’s visible when the list is empty.
- **Card actions:** On each card, make “View” or “Manage” the obvious primary action (size or placement).

### Booking detail (`/client/bookings/[id]`)

- **Status clarity:** Show one clear status line (e.g. “Waiting for your approval” or “Cleaner on the way”) with a short explanation.
- **Approve / Dispute:** Make the two actions visually distinct (e.g. primary vs secondary) and add a short tooltip or helper: “Approve to release payment” / “Dispute if something went wrong.”
- **Live tracking:** When status is in progress, add a small “Refresh” or “Live” indicator so users know data can update.
- **Cancel flow:** Use a confirmation modal with reason (optional) and “Cancel booking” vs “Keep booking” buttons.

### Credits (`/client/credits-trust`)

- **Balance prominence:** Keep the balance card at the top; consider showing it in the header or a sticky bar on scroll.
- **Ledger row click:** Make rows (or a “View” link) open a detail or receipt view if the API supports it.
- **Date filters:** Pre-fill “from” with start of month and “to” with today for a sensible default.

### Billing / Invoices (`/client/billing-trust`, `/client/billing-trust/[id]`)

- **List:** Add a status filter (e.g. Unpaid, Paid) and sort by date (newest first) by default.
- **Detail:** For “Pay with card,” if you redirect to Stripe, show a short “Redirecting to payment…” state.
- **Receipt:** If `receiptUrl` exists, style it as a clear “Download receipt” button.

### Favorites (`/favorites`)

- **Empty state:** Use `EmptyFavorites` and ensure the CTA goes to search with a sensible default (e.g. same area).
- **Remove:** Confirm before removing a favorite (“Remove [name] from favorites?”) to avoid mis-taps.

### Settings – Payment methods & Addresses

- **Payment methods:** Show last 4 digits and brand (e.g. Visa •••• 4242); mark default clearly.
- **Addresses:** For “Set as default,” show which one is current; confirm before deleting.

---

## Search (`/search`)

- **Results count:** Keep “X cleaners available” in sync with filters and show “No results” when the list is empty (with `EmptyCleaners`).
- **Map view:** If map is placeholder or list-only, either implement a real map or hide the map toggle until it’s ready.
- **Filters:** Persist filters in URL (e.g. `?sort=rating&radius=10`) so sharing and back/forward work.
- **Pagination:** Add “Load more” or infinite scroll as an option for mobile; keep accessibility of “Page 2” links.
- **Save search:** After saving, show a short success message and optionally list “Saved searches” so users can re-run them.

---

## Booking flow (`/booking`, `/booking/confirm/[id]`)

- **Address:** Use an address autocomplete (e.g. Places) to reduce errors and support validation.
- **Stepper:** Show current step (e.g. “Step 2 of 4”) and allow going back without losing data.
- **Price summary:** Keep the price/estimate visible (e.g. sticky sidebar) on all steps.
- **Confirm page:** Reiterate “Credits held” and “What happens next” (cleaner assigned, message, etc.); add “Add to calendar” and “Message cleaner” if available.

---

## Cleaner

### Public profile (`/cleaner/[id]`)

- **Book CTA:** Make “Book” or “Request booking” fixed or very visible on scroll (e.g. sticky bar on mobile).
- **Reviews:** Add pagination or “Load more” if the list is long; show rating distribution (e.g. 5★ 80%, 4★ 15%).
- **Reliability:** Keep the “Reliability data not available” message when the API has no data; avoid an empty card.

### My jobs / Job detail (`/cleaner/jobs/[id]`, requests, etc.)

- **Status:** Use the same status labels and colors as client-facing and backend (e.g. `getJobStatusLabel`).
- **Actions:** For “Accept,” “Start,” “Complete,” show one primary action per state and disable the rest when not applicable.
- **Empty:** “No jobs yet” / “No requests” with a CTA to complete profile or view calendar.

### Workflow (`/cleaner/job/[jobId]/workflow`)

- **Stepper:** Disable “Submit” until before/after photos exist; keep the guardrail message visible.
- **Full tracking link:** Keep “Full check-in / check-out (tracking + photos)”; add a one-line explanation: “Use this if you need to add photos with check-in.”

### Tracking (`/cleaner/job/[jobId]/tracking`)

- **Order of steps:** Clarify “1. Upload before photos → 2. Check in” so cleaners don’t check in without photos.
- **Location error:** If geolocation fails, show “Enable location” or “Enter address manually” (if backend supports it).
- **Success:** After check-in/check-out, show a short success message and auto-refresh timeline or redirect back to workflow.

### Upload (`/cleaner/job/[jobId]/upload`)

- **Min photos:** Enforce minimum (e.g. 1) before “Upload & attach”; show “X of 1 required” if needed.
- **Back:** Ensure “Back to workflow” is visible and returns to the correct step.

### Calendar / Availability

- **Calendar:** Mark “No jobs scheduled” for empty days; highlight today.
- **Availability:** When saving, show “Saved” and optionally sync state so the user sees the result immediately.

### Earnings (`/cleaner/earnings`)

- **Next payout:** Keep the banner; if the backend doesn’t support it yet, hide or show “— when available.”
- **Breakdown:** If there’s a date range, default to “This month” and allow “Last month” / custom range.

---

## Live appointment (`/client/appointments/[bookingId]/live-trust`)

- **Real-time:** Replace or supplement polling with Socket.IO so status/ETA/photos update without refresh.
- **Map:** Replace the placeholder with a real map (e.g. Mapbox/Google) and plot `gps[]` when available.
- **Cleaner actions:** If the viewer is the cleaner, show “En route” / “Arrived” etc.; if client, hide or disable them.
- **501 message:** Keep the “Use full check-in with photos” message and link; ensure the linked flow is the tracking page.

---

## Messages (`/messages`)

- **Empty:** Use `EmptyMessages` when there are no conversations.
- **Thread:** When opening a thread, mark as read (if the API supports it) and scroll to the latest message.
- **Send:** Disable send when the message is empty; show a loading state on the send button while posting.
- **Skeleton:** Use a thread skeleton (e.g. bubbles) while loading the conversation.

---

## Notifications (`/notifications`)

- **API:** Replace mock list with `GET /notifications` and handle loading/empty/error.
- **Empty:** Use an `EmptyNotifications` component when the list is empty.
- **Mark all read:** Wire “Mark all as read” to the API (e.g. POST read-all) and then clear unread badge.
- **Per-item read:** When opening a notification, mark it read and update the badge.
- **Icons:** Fix the `????` / `???` placeholders with proper icons (e.g. Lucide) by type (booking, message, review).

---

## Admin

### Dashboard (`/admin/dashboard`)

- **Realtime metrics:** If the API is slow, show cached data and a “Updated X min ago” with a manual refresh.
- **Alerts:** Make critical alerts (e.g. payment failures) visually prominent and link to the relevant admin page.
- **Error:** If overview or realtime fails, show a partial dashboard with an error card and retry.

### Users (`/admin/users`)

- **Empty:** Use `EmptyAdminUsers` when there are no results.
- **Detail:** When “View” is clicked, show a side panel or page with user detail, risk (if any), and actions (status, role).
- **Bulk actions:** If you add bulk status/role change, require confirmation and show success count.

### Bookings (`/admin/bookings`)

- **Empty:** Use `EmptyAdminBookings` when the list is empty.
- **Filters:** Default sort by date (newest first); keep status and search filters visible.
- **Detail:** “View” could open a drawer with booking + client + cleaner and “Cancel” / “Refund” if supported.

### Disputes (`/admin/disputes`)

- **Resolve modal:** Require admin notes; for “Partial refund,” show a numeric input and currency.
- **Success:** After resolve, close the modal, invalidate list, and show a toast.
- **Empty:** Keep the “No disputes” card when the list is empty.

### Finance (`/admin/finance`)

- **Transactions:** Add date range and status filters; export (CSV) if the API supports it.
- **Refund:** Confirm amount and reason before calling refund; show success and update list.

### Settings (`/admin/settings`)

- **Feature flags:** If you have flags, show name, description, and current value; confirm before toggling.
- **Save:** Indicate “Saving…” and “Saved” so admins know the state was persisted.

---

## Shared components

- **Header:** Ensure nav links have clear active state (e.g. current route); keep notification badge in sync with unread count.
- **Footer:** Keep links (Terms, Privacy, Help) and ensure they’re keyboard-focusable.
- **EmptyState:** Use consistent icon + title + description + optional CTA across the app; add `EmptyNotifications` and use it on the notifications page.
- **ErrorDisplay:** Use it on every data-driven page for 404/500 with a retry action where appropriate.
- **Skeletons:** Prefer layout-matched skeletons (e.g. JobRowSkeleton, CardSkeleton) over a single spinner for lists and cards.

---

## PWA & performance

- **Icons:** Add real `icon-192.png` and `icon-512.png` (or generate from `app/icon.tsx`) and reference them in `manifest.json`.
- **Lazy load:** Lazy-load heavy components (e.g. charts, map) and below-the-fold sections.
- **Images:** Use Next.js `Image` with sensible sizes; add blur placeholder for cleaner avatars and photos.

---

## Summary table

| Area           | Top 2–3 improvements |
|----------------|----------------------|
| Landing        | Document title/meta; skip link; lazy-load sections |
| Login/Register | Inline validation; password visibility; success feedback |
| Client dashboard | Error/empty for insights; chart a11y |
| Booking detail | Clear status line; approve/dispute distinction; cancel confirm |
| Credits/Billing | Sticky balance (optional); receipt button; date defaults |
| Search          | URL filters; empty state; map or hide toggle |
| Booking flow    | Address autocomplete; sticky price; confirm copy |
| Cleaner profile | Sticky Book CTA; review pagination |
| Cleaner workflow/tracking | Step order clarity; location fallback; success feedback |
| Live appointment | Socket.IO; real map; role-based actions |
| Messages        | Empty state; mark read; send loading |
| Notifications   | Real API; EmptyNotifications; fix icons; mark all read |
| Admin           | Empty states; confirm destructive actions; detail panels |
| Global          | Per-route title/meta; skip link; error boundary; offline hint |

Use this list to prioritize: start with **notifications (real API + empty)**, **document title/meta**, **skip link**, and **confirmations** for destructive actions, then iterate by traffic and impact.
