# Frontend vs Backend: Remaining Work

This document splits each incomplete or started-but-not-finished item into **what the frontend must do** and **what the backend must do**, with concrete steps.

---

## 5. Work that is not completed

### 5.1 Backend stubs: GET /bookings/me, GET /cleaners/:cleanerId/reviews

| Where | Who | What needs to happen |
|-------|-----|----------------------|
| **GET /bookings/me** | **Backend** | Implement the endpoint. Return `{ bookings: Booking[] }` with pagination params (`status`, `page`, `per_page`). Each booking should include fields the client/cleaner dashboards and booking detail pages expect (id, status, scheduled_start_at, scheduled_end_at, client/cleaner info, service_type, credit_amount, etc.). See `docs/BACKEND_ENDPOINTS.md` and the types used by `booking.service.ts` / `useBookings`. |
| | **Frontend** | **Nothing.** Already calls `bookingService.getMyBookings({ status, page, per_page })` and renders the list. Once the backend returns real data, the same UI will show it. |
| **GET /cleaners/:cleanerId/reviews** | **Backend** | Implement the endpoint. Return `{ reviews: Review[], page, per_page, total }` (and optionally `pagination`). Each review: id, rating, comment, author info, created_at, etc. See BACKEND_ENDPOINTS.md and usage in `cleaner.service.getCleanerReviews`, `useCleaners` (reviews for cleaner profile). |
| | **Frontend** | **Nothing.** Already calls `cleanerService.getCleanerReviews(cleanerId, { page, per_page })` and displays reviews. Real data will flow through when backend is implemented. |

**Summary:** Backend implements the two endpoints with the response shapes the frontend already expects. No frontend changes required.

---

### 5.2 Gamification backend

| Where | Who | What needs to happen |
|-------|-----|----------------------|
| **All gamification endpoints** | **Backend** | Implement every route in `docs/GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md`: admin (flags, goals, rewards, choices, governor, abuse, support debug) and cleaner (progress, goals, badges, rewards, stats, maintenance, choice select). Persist data in the suggested tables (gamification_flags, goals, rewards, choice_groups, cleaner_gamification_state, cleaner_reward_grants, etc.). Return the exact response shapes documented so the frontend types match. |
| | **Frontend** | **Nothing.** All pages and services are built: `gamificationAdmin.service.ts` and `cleanerGamification.service.ts` already call these URLs and handle responses. Placeholders/fallbacks are used when the API is missing or fails; once backend returns real data, the same UI will show it. Optional later: remove or refine placeholder copy and add error toasts if desired. |

**Summary:** Backend implements the full gamification API from the guide. Frontend is ready; no new screens or service methods needed.

---

### 5.3 Referral

| Where | Who | What needs to happen |
|-------|-----|----------------------|
| **Referral email API** | **Backend** | Provide an endpoint for “send referral email” (e.g. `POST /referral/send` or `POST /referral/invite`). Request body should include at least: recipient email, sender user id (from auth), optional message. Backend sends the email (or queues it) and returns success/failure. Document the path and body in BACKEND_ENDPOINTS.md. |
| | **Frontend** | In `src/app/referral/page.tsx`, replace the no-op in `handleSendEmail`: call the new referral API (e.g. create `referral.service.ts` with `sendReferralEmail({ email, message? })`), show success/error toast, and optionally refetch referral stats if the backend exposes them. Replace mock `referralCode`, `referralStats`, and `recentReferrals` with data from APIs if/when backend exposes `GET /referral/me` (or similar). |

**Summary:** Backend adds send-referral endpoint (and optionally referral stats); frontend wires the “Send invite” button and can later wire stats/referral code from API.

---

### 5.4 Error reporting (Sentry / ErrorBoundary)

| Where | Who | What needs to happen |
|-------|-----|----------------------|
| **Error tracking** | **Backend** | Not required for this item. (Backend may have its own error logging.) |
| | **Frontend** | In `src/lib/errorHandler.ts`: when handling errors, call Sentry (or your chosen service), e.g. `Sentry.captureException(error)` with optional context. Ensure `Sentry.init` is called at app boot (e.g. in root layout or a dedicated `monitoring/sentry.ts`). In `src/components/error/ErrorBoundary.tsx`: in the error fallback or in a `componentDidCatch`/error effect, call the same reporting (e.g. `Sentry.captureException(error)`). Add env var for DSN if not already (e.g. `NEXT_PUBLIC_SENTRY_DSN`). |

**Summary:** Frontend-only. Wire existing error handler and ErrorBoundary to Sentry (or another provider); no backend change.

---

### 5.5 Tests (failing suites)

| Where | Who | What needs to happen |
|-------|-----|----------------------|
| **Failing tests** | **Backend** | Not involved. |
| | **Frontend** | Fix or document each failing suite: **ToastContext** – fix async/timing or mock toast provider. **ErrorBoundary** – mock or trigger error in a way the test can assert. **Header** – fix role/nav assertions or mocks. **Onboarding steps** – fix async or DOM assertions. **useBookings** – mock `GET /bookings/me` or adapter so hook returns expected shape. **WebSocketContext** – mock socket or skip if not critical. **AuthContext integration** – ensure provider and mocks match. **NotificationContext** – same. **InsightsDashboard** – fix data mocks or assertions. Optionally mark non‑critical tests with `it.skip` and a TODO referencing `docs/TODOS.md` until fixed. |

**Summary:** Frontend-only. Improve mocks, async handling, or skip with TODOs; no backend work.

---

## 6. Work that was started but not finished

### 6.1 Booking list (“my bookings”)

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | Implement **GET /bookings/me** (same as 5.1). Return real bookings for the authenticated user (client or cleaner, depending on role or a query param). |
| **Frontend** | No change. Already wired; list will populate when backend returns data. |

---

### 6.2 Cleaner job detail: check-in and photo upload

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | (1) **Check-in:** Expose an endpoint for recording job check-in with location, e.g. `POST /jobs/:jobId/check-in` (or a generic `POST /jobs/:jobId/events` with type `check_in`). Body: `{ lat, lng, accuracyM?, source: 'device' \| 'manual_override' }`. Persist and associate with the job. (2) **Photo upload:** Expose an endpoint for before/after photos, e.g. `POST /jobs/:jobId/photos` with `multipart/form-data` (or a presigned URL flow). Body/params: `kind: 'before' \| 'after'`, file(s). Store or link the file(s) to the job. Document in BACKEND_ENDPOINTS.md. |
| **Frontend** | In `src/app/cleaner/jobs/[id]/page.tsx`: (1) In `handleCheckIn`, after getting geolocation, call the new check-in API (e.g. `jobService.checkIn(jobId, { lat, lng, accuracyM })` or `apiClient.post(\`/jobs/${jobId}/check-in\`, { lat, lng })`). Then show success toast and invalidate job query. (2) In `handlePhotoUpload`, for each file, call the new photo upload API (e.g. `jobService.uploadJobPhoto(jobId, kind, file)` or a multipart POST). Then update local state or refetch job so new photos appear, and show success toast. Remove the TODOs. |

**Summary:** Backend adds check-in and photo-upload endpoints; frontend replaces TODOs with real API calls and keeps existing UI.

---

### 6.3 Cleaner calendar: derive bookings from API

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | Ensure the cleaner can get their assigned jobs in a date range. This may already exist as **GET /jobs** (with filter by cleaner) or **GET /cleaner/schedule** (params: from, to). Return bookings/jobs with scheduled_start_at, scheduled_end_at, client name, status, etc. |
| **Frontend** | In `src/app/cleaner/calendar/page.tsx`, replace the empty `bookings` array and the comment “TODO: derive from useAssignedJobs or useCleanerSchedule”. Call `useAssignedJobs()` or `useCleanerSchedule({ from: startOfMonth, to: endOfMonth })` (or the hook that matches your backend). Map the API response to the shape the calendar UI expects (e.g. day, time, client, job id). Render that list in the calendar so cleaners see their jobs per day. |

**Summary:** Backend exposes schedule/assigned jobs (may already exist). Frontend wires the calendar to that data.

---

### 6.4 Cleaner availability: success toast after action

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | Nothing. |
| **Frontend** | In `src/app/cleaner/availability/page.tsx`, find the mutation that updates availability (or time-off) and in its `onSuccess` callback call the app’s toast helper (e.g. `showToast('Availability updated', 'success')`). Remove or resolve the “TODO: Show success toast” comment. |

**Summary:** Frontend-only; add one success toast in the existing success handler.

---

### 6.5 CleanerCard “Add to favorites”

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | Expose **POST /client/favorites** (or equivalent) with body e.g. `{ cleaner_id: string }`. Persist the favorite for the authenticated client. Optionally **DELETE /client/favorites/:id** to remove. Ensure **GET /client/favorites** exists for the favorites list page. (May already be in BACKEND_ENDPOINTS.md.) |
| **Frontend** | In `src/components/features/search/CleanerCard.tsx`, implement the “Add to favorites” button: on click, call the favorites API (e.g. `favoritesService.addFavorite(cleanerId)` from `favorites.service.ts`). Use mutation and invalidate favorites/list query on success. Show toast and optionally toggle button state (e.g. heart filled) if the API returns or the client can refetch favorite state. Remove the TODO. |

**Summary:** Backend provides add (and optionally remove) favorite; frontend wires the button to that API.

---

### 6.6 Admin disputes: resolve endpoint

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | Implement **POST /admin/jobs/:id/resolve-dispute** (or **POST /admin/disputes/:id/resolve** – align with what the frontend calls). Request body should include resolution details (e.g. `{ outcome: 'client_refund' \| 'cleaner_win' \| 'split', amount?: number, reason?: string }`). Backend updates dispute status, applies refunds/payouts if needed, and returns success. |
| **Frontend** | **Nothing.** Already calls `apiClient.post(\`/admin/jobs/${dispute.id}/resolve-dispute\`, data)` in `src/app/admin/disputes/page.tsx`. Ensure the `data` shape matches what the backend expects (outcome, amount, reason, etc.). If the backend chooses a different path (e.g. `/admin/disputes/:id/resolve`), change the URL in that mutation to match. |

**Summary:** Backend implements the resolve endpoint; frontend may only need a URL or body tweak to match backend contract.

---

### 6.7 Gamification data (placeholders until backend)

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | Same as 5.2: implement all gamification endpoints from GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md so progress, goals, rewards, badges, stats, maintenance, choices, and admin features return real data. |
| **Frontend** | No structural change. Existing code already uses fallbacks when API fails or returns empty; once backend is live, real data will show. Optional: remove or soften placeholder copy and add clearer error messages if desired. |

**Summary:** Backend implements gamification APIs; frontend is ready.

---

### 6.8 Trust / main live backend

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | (1) **Main app live:** Implement **GET /appointments/:bookingId/live** (or the path used by `appointment.service.getLiveAppointment`). Return state, checklist (items with `id`, `completed`, `completedAtISO` only – no `label`; frontend adds labels from constants), gps, photos, events. (2) **Trust API live:** Implement the Trust-Fintech live appointment and events endpoints (e.g. GET live, POST events) used by `useLiveAppointmentTrust` and `usePostAppointmentEvent`. (3) Checklist: backend returns checklist items without `label`; frontend merges with `TRUST_CHECKLIST_ROOM_LABELS`. |
| **Frontend** | **Nothing for data shape.** Already uses `mergeChecklistWithLabels` for the main live page and Trust hooks for live-trust. If the backend uses a different path for the main app live endpoint, update `appointment.service.ts` to call that path. |

**Summary:** Backend implements live and Trust endpoints and checklist without labels; frontend already handles labels and hooks.

---

### 6.9 Job Details / Tracking (single-call DTO)

| Who | What needs to happen |
|-----|----------------------|
| **Backend** | **(Recommended)** Add **GET /jobs/:jobId/details** returning one payload: `job` (identity, schedule, location, status), `cleaner` (display + `reliability_score`, optional `tier`, `avg_rating`, `jobs_completed`), `checkins` (from `job_checkins`: id, type, lat, lng, distance_from_job_meters, is_within_radius, created_at), `photos` (from `job_photos`: type before/after, url, thumbnail_url, created_at), `ledgerEntries` (from `credit_ledger` for this job: delta_credits, reason e.g. job_escrow/job_release, created_at), `paymentIntent` (latest payment_intents where job_id and purpose=job_charge), `payout` (latest payouts for job). See `src/types/jobDetails.ts` for the exact DTO types. This avoids multiple round-trips and “loading pop” on the booking detail page. |
| **Frontend** | **Done.** Uses `getJobDetails(jobId)` which calls GET /jobs/:jobId/details. If the endpoint returns 404/501, frontend falls back to GET /jobs/:jobId and shows a minimal DTO (job + optional nested cleaner). The client booking detail page (`/client/bookings/[id]`) renders **JobDetailsTracking** (timeline rail, reliability ring, ledger phase, check-ins, before/after photos) when details are available. Status mapping: requested/accepted/pending/scheduled → Booked, on_my_way → On Route, in_progress/awaiting_approval → Working, completed → Completed. |

**Summary:** Frontend is implemented. Backend can add GET /jobs/:jobId/details for a single-call job-details payload; until then, the UI still works with the fallback (job + optional cleaner from GET /jobs/:id). See **docs/JOB_DETAILS_API.md** for which endpoint to call, response type (`JobDetailsResponse`), and status/ledger mapping rules.

---

## Quick reference table

| Item | Backend | Frontend |
|------|---------|----------|
| GET /bookings/me | Implement endpoint | No change |
| GET /cleaners/:id/reviews | Implement endpoint | No change |
| Gamification | Implement all guide endpoints | No change |
| Referral | Add send-invite (and optionally stats) API | Wire button + optional stats |
| Error reporting | — | Wire errorHandler + ErrorBoundary to Sentry |
| Tests | — | Fix mocks / async / skip with TODO |
| Booking list | Same as GET /bookings/me | No change |
| Job check-in | Add check-in endpoint | Call API in handleCheckIn |
| Job photo upload | Add photo upload endpoint | Call API in handlePhotoUpload |
| Cleaner calendar | Expose schedule/assigned jobs | Use useAssignedJobs or useCleanerSchedule for bookings |
| Availability toast | — | Add success toast in onSuccess |
| Add to favorites | Add favorite endpoint(s) | Wire CleanerCard button to API |
| Admin resolve dispute | Implement resolve endpoint | Optional URL/body alignment |
| Gamification data | Same as gamification backend | No change |
| Trust/live | Implement live + Trust endpoints, checklist without label | Optional path in appointment.service |
| Job Details DTO | Optional: GET /jobs/:id/details (job, cleaner, checkins, photos, ledger, paymentIntent, payout) | Done: JobDetailsTracking + useJobDetails; fallback to GET /jobs/:id |
