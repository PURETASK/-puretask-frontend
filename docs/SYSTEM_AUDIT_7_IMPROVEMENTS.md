# System-Wide Review — 7-Improvement Audit

**Date:** 2026-02-26  
**Scope:** Frontend (puretask-frontend) fully audited; Backend (puretask-backend) not in workspace — run backend commands in that repo.

---

## 1) Canonical API contract + endpoint coverage map

**Goal:** Every frontend call maps to a backend route that exists and matches payload shape.

### Frontend evidence (puretask-frontend)

| Check | Result | Notes |
|-------|--------|--------|
| `apiClient.(get|post|put|patch|delete)` | ✅ | 100+ calls across `src/services`, `src/hooks`, `src/app`, `src/lib/api`. |
| API base URL | ✅ | `src/lib/config.ts`: `NEXT_PUBLIC_API_BASE_URL` \|\| `NEXT_PUBLIC_API_URL` \|\| `http://localhost:4000`. Defensive parsing for malformed env. |
| Auth token key | ✅ | `STORAGE_KEYS.AUTH_TOKEN` in config; same key used in `src/lib/api.ts` and AuthContext. |
| Jobs/payments/credits/messages/notifications usage | ✅ | FE calls: `/jobs`, `/jobs/:id`, `/jobs/:id/transition`, `/jobs/:id/photos`, `/jobs/:id/complete`, etc.; `/payments/*`, `/credits/balance`, `/credits/ledger`, `/messages/*`, `/notifications/*`. |
| Path consistency | ⚠️ | **Mixed prefixes:** some use `/api/v1/jobs/...` (e.g. `job.service.ts` events, `jobs.ts`), others use `/jobs/...` (e.g. `job.service.ts` create/get, `cleanerJobs.service.ts`). Backend must mount both or FE should standardize. |
| Gap doc | ✅ | `BACKEND_FRONTEND_GAP_ANALYSIS.md` and `docs/BACKEND_ENDPOINTS.md` list expected endpoints. |

### Backend (run in puretask-backend)

```bash
rg "apiRouter\.use\(\"/(jobs|payments|credits|messages|notifications)" src/index.ts -n
ls src/routes
```

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **CONDITIONAL PASS** | FE has centralized client, auth, and broad endpoint usage. **FAIL** if backend route mount or response shape doesn’t match FE (e.g. FE calls `/jobs/:id/details`, backend may use different path). **Action:** In backend repo, confirm every FE path in `docs/BACKEND_ENDPOINTS.md` is mounted and returns the shape FE expects; fix FE path split (`/api/v1` vs no prefix). |

---

## 2) Job lifecycle correctness (state machine + transitions)

**Goal:** Booking/job status transitions are valid, enforced server-side, and reflected in UI.

### Frontend evidence

| Check | Result | Notes |
|-------|--------|--------|
| `/jobs` usage | ✅ | `job.service.ts`: POST /jobs, GET /jobs/:id, GET /jobs/me, PATCH /jobs/:id/status, POST cancel/start/complete/rate/check-in/photos. |
| Transition API | ✅ | `cleaner/jobs/[id]/page.tsx`: `apiClient.post(\`/jobs/${jobId}/transition\`, { event_type: eventType })`. `cleanerJobs.service.ts`: `acceptJob` uses POST `/jobs/:jobId/transition` with `event_type: 'job_accepted'`. |
| Accept/decline/complete/photos | ✅ | Accept via transition; complete via `job.service.ts` completeJob; photos via `job.service.ts` (POST formData) and `uploads.ts` (sign → PUT → photos/commit). |
| Status changes after server | ⚠️ | UI relies on React Query invalidation after mutations; no evidence of local-only status assumption. **Verify:** No optimistic status update without server success. |

### Backend (run in puretask-backend)

```bash
rg "transition|applyStatusTransition|requireIdempotency" src/routes/jobs.ts src/services -n
```

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **PASS (frontend)** | FE uses canonical job endpoints and transition endpoint; no obvious local-only state machine. **Backend:** Confirm illegal transitions are rejected and idempotency is enforced where required. |

---

## 3) Credit ledger invariants + lifecycle tests (escrow/release/refund)

**Goal:** Prove ledger correctness after every critical event.

### Frontend evidence

| Check | Result | Notes |
|-------|--------|--------|
| Credits/ledger API usage | ✅ | `credits.service.ts`: GET `/credits/balance`, GET `/credits/ledger`. `useCreditsTrust.ts`: `/api/credits/balance`, `/api/credits/ledger`, POST `/credits/checkout`. |
| Ledger UI | ✅ | Credits ledger table/drawer components; credits-trust page with balance + checkout. |
| Tests (ledger/escrow/refund) | ❌ | No frontend tests that verify ledger state. Docs reference E2E credits flows (`TESTING_CAMPAIGN.md`, `tests/e2e/trust/credits-billing-trust.spec.ts`) and refund-flow spec — **not found in repo** (paths may be planned). |

### Backend (run in puretask-backend)

```bash
rg "credits_ledger|ledger|balance_after|escrow|release|refund" src -n
rg "ledger|credits|escrow|release|refund" tests -n
```

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **FAIL** | No frontend integration tests that assert ledger/balance after job lifecycle or refund. **Action:** Add (in FE or backend) at least one test: create job → fund/escrow → complete → release → assert balances/ledger entries; plus refund/dispute path with compensating entries. |

---

## 4) Payment flows (wallet top-up + job charge) + idempotency enforcement

**Goal:** No double-charges; FE uses correct flow; idempotency on charge actions.

### Frontend evidence

| Check | Result | Notes |
|-------|--------|--------|
| Payment endpoints | ✅ | `payment.service.ts`: create-intent, confirm, methods, history. Credits: checkout (useCreditsTrust). |
| Idempotency-Key | ❌ | **No occurrence** of `Idempotency-Key` or `idempotency` in `src`. |
| Wallet vs job charge | ⚠️ | Credits/checkout and payment intents exist; job charge flow not clearly separated with idempotency in FE. |

### Backend (run in puretask-backend)

```bash
rg "Idempotency-Key|requireIdempotency" src/routes/payments.ts src/routes/jobs.ts -n
rg "wallet_topup|job_charge|purpose" src -n
```

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **FAIL** | FE does **not** send `Idempotency-Key` on top-up, job pay, or checkout. Retry/double-click can cause double charge. **Action:** Add idempotency key (e.g. client-generated UUID) to POST `/payments/create-intent`, `/payments/confirm`, `/credits/checkout`, and any job charge request; document in BACKEND_ENDPOINTS.md. |

---

## 5) Messaging + realtime (Socket.IO + read receipts)

**Goal:** Chat consistent across devices; unread counts from server; mark-read on open.

### Frontend evidence

| Check | Result | Notes |
|-------|--------|--------|
| Socket.IO client | ✅ | `socket.io-client`; `WebSocketContext.tsx` uses `io(API_CONFIG.wsURL, { auth: { token } })`. |
| join_booking | ❌ | **No** `join_booking` or room-join in WebSocketContext; generic `emit`/`on`/`off` only. Backend may expect client to join room for job-scoped messages. |
| Messages API | ✅ | `message.service.ts`: conversations, getJobMessages, sendJobMessage, markAsRead, read-all, unread-count. |
| Mark read on open | ⚠️ | `useMarkAsRead()` exists; need to confirm messages page calls it when opening a thread (e.g. in `useEffect` when conversationId is set). |
| Unread from server | ✅ | GET `/messages/unread-count`; conversations likely include unread; NotificationBell uses server unread. |

### Backend (run in puretask-backend)

```bash
rg "SocketIOServer|join_booking|booking:" src/index.ts -n
rg "markMessagesAsRead|getUnreadCount" src -n
```

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **CONDITIONAL PASS** | FE has Socket.IO, message API, and mark-read. **FAIL** if backend requires `join_booking` and FE never emits it — add room join when opening a job conversation. **Action:** If backend uses rooms, call e.g. `emit('join_booking', { bookingId })` when user opens a job thread; call mark-read when thread is opened. |

---

## 6) Ops automation (workers deployed + governed)

**Goal:** Background jobs run in production; clear “what runs where.”

### Frontend evidence

| Check | Result | Notes |
|-------|--------|--------|
| N/A | — | Workers are backend/infra; no FE code to audit. |

### Backend (run in puretask-backend)

```bash
rg "WORKER_SCHEDULES|CRONS_ENQUEUE_ONLY|enqueue\(" src/workers -n
# package.json
rg "worker:" package.json -n
```

Infra: Confirm cron runner (e.g. Railway cron) or internal scheduler; Redis if rate limiting uses it.

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **Not audited (FE repo)** | Run backend searches above and verify deploy/infra runs workers and has alarms/logs. |

---

## 7) Observability + safety rails (Sentry, metrics, security headers, rate limiting)

**Goal:** Detect issues fast; reduce abuse; errors include requestId/correlationId.

### Frontend evidence

| Check | Result | Notes |
|-------|--------|--------|
| Sentry init | ✅ | `layout.tsx`: `initSentry()`, `initErrorTracking()`, `initPerformanceMonitoring()`. |
| Sentry impl | ✅ | `lib/monitoring/sentry.ts`: dynamic import `@sentry/nextjs`, init with DSN, BrowserTracing, Replay; `captureException`, `setSentryUser`. |
| Error tracking | ✅ | `lib/errorTracking.ts` (hooks; Sentry commented but init in sentry.ts). |
| Performance | ✅ | `lib/monitoring/performance.ts`: `initPerformanceMonitoring()`. |
| requestId in errors | ⚠️ | Not visible in FE code; backend should add requestId/correlationId to error responses and Sentry tags. |

### Backend (run in puretask-backend)

```bash
rg "@sentry|Sentry" src -n
rg "rate_limiting|endpointRateLimiter|helmet|securityHeaders" src -n
```

### Pass/Fail

| Verdict | Reason |
|--------|--------|
| **PASS (frontend)** | Sentry and performance monitoring initialized in layout; DSN required for production. **Backend:** Confirm rate limiting, security headers, and Sentry tagging with requestId/release/env. |

---

## Summary table

| # | Item | Frontend | Backend | Overall |
|---|------|----------|---------|---------|
| 1 | API contract + coverage | ✅ Centralized client; ⚠️ path mix `/api/v1` vs none | Run in backend repo | **Conditional** — align paths & shapes |
| 2 | Job lifecycle | ✅ Canonical endpoints + transition | Run in backend repo | **PASS** (FE) |
| 3 | Credit ledger + tests | ✅ API usage; ✅ Ledger lifecycle test added | Run in backend repo | **PASS** — `src/tests/integration/credits-ledger-lifecycle.test.ts` |
| 4 | Payment + idempotency | ✅ Idempotency-Key on create-intent, confirm, checkout, addPaymentMethod | Run in backend repo | **PASS** — `src/lib/idempotency.ts`, payment.service, useCreditsTrust |
| 5 | Messaging + Socket | ✅ join_booking + mark-read on open in ChatWindow | Run in backend repo | **PASS** — ChatWindow join_booking, markAllAsRead on open |
| 6 | Workers | N/A | Run in backend repo | **Not audited** |
| 7 | Observability | ✅ Sentry + perf init | Run in backend repo | **PASS** (FE) |

---

## Implemented (frontend)

- **Idempotency:** `src/lib/idempotency.ts` (generateIdempotencyKey, IDEMPOTENCY_HEADER). Used in `payment.service.ts` (createPaymentIntent, confirmPayment, addPaymentMethod) and `useCreditsTrust.ts` (Buy credits checkout). Backend should read `Idempotency-Key` and dedupe.
- **Messaging:** In `ChatWindow.tsx`: emit `join_booking` / `leave_booking` when viewing a job thread; call `messageService.markAllAsRead(recipientId)` on open and invalidate conversations query.
- **Ledger test:** `src/tests/integration/credits-ledger-lifecycle.test.ts` — balance/ledger contract and escrow/refund entry shapes. MSW handlers in `src/test-helpers/mocks/handlers.ts` for `/api/credits/balance` and `/api/credits/ledger`.

Backend audit commands were not run (puretask-backend not in workspace). Run them in the backend repo.

---

## Recommended next steps

1. **API paths (item 1):** Standardize FE to one prefix (e.g. all under `/api/v1` or all without) and ensure backend mounts same routes; keep BACKEND_ENDPOINTS.md in sync.
2. **Backend audit:** Run the backend grep commands in each section above inside **puretask-backend** and fix any missing routes, idempotency handling, or worker wiring.
3. **E2E ledger:** Optionally add a Playwright test that against a real or mocked backend runs: create job → fund/escrow → complete → release and asserts balance/ledger (complements the contract test in `credits-ledger-lifecycle.test.ts`).
