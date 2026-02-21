# Gamification & App — Complete vs In-Progress vs Not Started

This document is a **single source of truth** for what is finished, what is started but not finished, and what is not started — for **gamification** and the **rest of the app** as it touches gamification.

---

## 1. GAMIFICATION — COMPLETE AND CORRECT ✅

### 1.1 Routes (all exist and render)

| Area | Route | Status |
|------|--------|--------|
| **Cleaner** | `/cleaner/progress` | ✅ Full hub UI (LevelBadge, ring, core/stretch/maintenance, Next Best Actions, Active Rewards, CTAs) |
| | `/cleaner/progress/level/:levelNumber` | ✅ Page exists (structure; content placeholder) |
| | `/cleaner/goals` | ✅ List with GoalCard |
| | `/cleaner/goals/:goalId` | ✅ Detail page (structure; data placeholder) |
| | `/cleaner/rewards` | ✅ Tabs Active/Earned/Locked/Choice, RewardCard |
| | `/cleaner/badges` | ✅ Tabs Core/Fun/All, BadgeGrid + BadgeCard |
| | `/cleaner/maintenance` | ✅ Status + PausedProgressBanner when paused |
| | `/cleaner/stats` | ✅ Metric tiles + “How it’s calculated” (values placeholder) |
| | `/cleaner/jobs/:jobId` | ✅ Job detail with clock-in, photos, status transitions (gamification “This job helps” hooks can be added; job flow is real API) |
| **Client** | `/cleaner/[id]` (public profile) | ✅ Level + badges block when API returns `level` and `badges`; “What this means” copy |
| **Admin** | `/admin/gamification` | ✅ Overview + links to all sub-pages |
| | `/admin/gamification/goals` | ✅ DataTable, Create/Duplicate/Rollback, row click → edit/preview |
| | `/admin/gamification/goals/:goalId` | ✅ Edit form (title, description, level, type, metric, target, window, enabled), Save, Preview, Rollback |
| | `/admin/gamification/rewards` | ✅ DataTable; uses API or placeholder list |
| | `/admin/gamification/rewards/:rewardId` | ✅ Edit form (name, kind, duration, usage, stacking, permanent, enabled), Save |
| | `/admin/gamification/choices` | ✅ Stub page (title + copy; no DataTable yet) |
| | `/admin/gamification/flags` | ✅ Toggles + Save; calls GET/PATCH flags API |
| | `/admin/gamification/governor` | ✅ DataTable; uses API or placeholder |
| | `/admin/gamification/abuse` | ✅ Tabs, DataTable, Pause rewards; uses API or placeholder |
| | `/admin/support/cleaner/:cleanerId/gamification` | ✅ Full UI: level, progress, why paused, goal progress, active rewards, history, recompute, grant/remove, copy explanation |

### 1.2 Shared components (built and exported)

All in `@/components/gamification` and exported from `index.ts`:

- LevelBadge, LevelProgressRing, ProgressBar (ui), GoalCard, RewardCard, CountdownPill  
- PausedProgressBanner, NextBestActionCard, MetricExplainerModal, QuickTemplatePicker  
- GoalChecklist, StretchGoalPicker, ChoiceRewardModal, RewardEffectPill  
- BadgeCard, BadgeGrid, AchievementToast  

### 1.3 Admin service and API usage

- **`gamificationAdmin.service.ts`** implements all admin + support calls:
  - Flags: getFlags, updateFlags  
  - Goals: getGoals, getGoal(id), createGoal, updateGoal  
  - Rewards: getRewards, getReward(id), updateReward  
  - Governor: getGovernor  
  - Abuse: getAbuseSignals, pauseRewardsForCleaner  
  - Support: getSupportGamification, recomputeSupportGamification, grantSupportReward, removeSupportReward  
- Admin **goals list**, **rewards list**, **goal edit**, **reward edit**, **flags**, **support debug** call these APIs and fall back to placeholder data when the API is empty or fails.

### 1.4 Documentation

- **GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md** — Complete backend spec (auth, flags, goals, rewards, choices, governor, abuse, support debug, cleaner profile extension, cleaner progress/goals, data model, errors).  
- **BACKEND_ENDPOINTS.md** — Lists all frontend-expected endpoints including gamification (admin + cleaner + support).  
- **GAMIFICATION_UI_UX_STATUS.md** — Routes, components, wireframe alignment, and “what’s still missing” kept in sync.

---

## 2. GAMIFICATION — STARTED BUT NOT FINISHED ⚠️

### 2.1 Cleaner-facing data wiring (UI done, data placeholder or partial)

| Page | What’s done | What’s missing |
|------|-------------|----------------|
| **Progress hub** (`/cleaner/progress`) | Layout, LevelBadge, ring, next actions, active rewards, links. Uses `cleanerEnhancedService.getGoals()` for a legacy “Active goals (from API)” block. | Level, core %, stretch, maintenance, next best actions, active rewards, recent achievements are **hardcoded**. No `GET /cleaner/progress` (or `/cleaner/progress/summary`) wired yet. |
| **Goals list** (`/cleaner/goals`) | Page, single GoalCard, link to detail. | **No API.** One hardcoded goal. Should call `GET /cleaner/goals` and render list (filters placeholder). |
| **Goal detail** (`/cleaner/goals/:goalId`) | Layout, progress bar, “Do Next Step”, “View Reward Preview”. | **No API.** Goal id from URL only; title/progress/reward are placeholder. Need GET goal by id for cleaner context. |
| **Rewards** (`/cleaner/rewards`) | Tabs, Active tab with one RewardCard. | **No API.** Active/Earned/Locked/Choice content is placeholder. Need endpoints for active rewards and history (and choice eligibility). |
| **Badges** (`/cleaner/badges`) | Tabs, BadgeGrid + BadgeCard with placeholder list. | **No API.** All badges are `PLACEHOLDER_BADGES`. Need GET cleaner badges (or extend profile) and definitions. |
| **Maintenance** (`/cleaner/maintenance`) | Layout, PausedProgressBanner when `isPaused`, “All good” card. | **No API.** `isPaused = false` hardcoded; metrics “load from API” not wired. |
| **Stats** (`/cleaner/stats`) | Metric tiles and labels. | **No API.** All values are “—”. Need metrics from backend (on-time rate, acceptance, photo compliance, etc.). |
| **Level detail** (`/cleaner/progress/level/:levelNumber`) | Level badge, Core/Stretch/Maintenance sections. | **No API.** “Core goals checklist will load from API”, “Stretch goal picker will load here” — no data yet. |

### 2.2 Admin pages with placeholder fallback

- **Goals list**: Calls `getGoals()`; if API returns empty, uses `placeholderGoals`. **Done** once backend returns data.  
- **Rewards list**: Same pattern with `getRewards()` and `placeholderRewards`. **Done** once backend returns data.  
- **Governor**: Calls `getGovernor()`; fallback to `placeholderGovernor`. **Done** when backend implements.  
- **Abuse**: Calls `getAbuseSignals()`; fallback to `placeholderAbuse`. **Done** when backend implements.  
- **Support debug**: Calls `getSupportGamification(cleanerId)` and recompute/grant/remove; uses full `placeholderData` when API fails. **Done** when backend implements.

### 2.3 Admin Choice groups

- **Route** `/admin/gamification/choices` exists.  
- **Started but not finished:** Page is a stub (title + “Define choose 1 of these…”). No DataTable, no GET/PATCH choices API wired, no create/edit UI.

### 2.4 Admin gamification overview

- **Route** `/admin/gamification` exists with links.  
- **Started but not finished:** “Level distribution”, “Time-to-level”, “Reward burn” are placeholders (“(Chart from API)”, “(From API)”). No analytics APIs wired.

### 2.5 Optional route not added

- **`/cleaner/rewards/:rewardId`** — Marked optional in docs; not implemented. Can be added later if needed.

---

## 3. GAMIFICATION — NOT STARTED ❌

### 3.1 Backend (separate repo)

- All endpoints in **GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md** and **BACKEND_ENDPOINTS.md** are **documented and expected by the frontend** but must be **implemented in the backend**.  
- No backend code lives in this frontend repo; “not started” here means “backend not implemented yet.”

### 3.2 Empty / edge states

- Empty goals list, no active rewards, first-time user — mentioned in wireframes; not all implemented (e.g. dedicated empty-state components or copy everywhere).

### 3.3 Strict Figma design system

- 8pt grid, 80px margin, exact color tokens — not applied; Tailwind/conventions used instead. Optional for “pixel-perfect” match.

### 3.4 Cleaner choice reward flow

- **ChoiceRewardModal** component exists.  
- No cleaner-facing page or flow that loads “pending choice” from API and calls `POST /cleaner/rewards/choice/:choiceGroupId/select` yet.

---

## 4. REST OF APP (relevant to gamification)

### 4.1 Complete and correct

- **Client cleaner profile** (`/cleaner/[id]`): Uses `useCleaner(cleanerId)`. Renders **level** and **badges** when present on `cleaner` (e.g. `cleaner.level`, `cleaner.badges`). No internal metrics exposed. **Done** on frontend; backend must add `level` and `badges` to `GET /cleaners/:id`.  
- **Cleaner job detail** (`/cleaner/jobs/:id`): Booking/job data, transitions, directions, time, expenses use real APIs. Gamification “This job helps” tags could be added on top; core job flow is complete.  
- **Navigation / layout**: Links to `/cleaner/progress`, goals, rewards, badges exist (e.g. Footer, Progress hub, dashboard).  
- **Auth / protection**: Gamification pages under `/cleaner/*` use `ProtectedRoute` (cleaner); admin use `ProtectedRoute` (admin).

### 4.2 Other app areas (non-gamification)

- Auth, profile, bookings, jobs, client credits, billing, cleaner profile/availability/earnings, admin dashboard/users/settings/disputes/bookings/analytics/reports/communication/finance/id-verifications, etc. — **unchanged by this review**; status depends on existing backend and product scope.  
- **Stubs noted in BACKEND_ENDPOINTS.md:** `GET /bookings/me`, `GET /cleaners/:cleanerId/reviews` return empty arrays to avoid 404/500.

---

## 5. SUMMARY TABLE

| Category | Complete | Started, not finished | Not started |
|----------|----------|------------------------|-------------|
| **Gamification routes** | All cleaner/admin/support routes exist and render | — | — |
| **Gamification components** | All listed components built and exported | — | — |
| **Admin gamification** | Goals CRUD + edit, Rewards list + edit, Flags, Governor, Abuse, Support debug (UI + API calls) | Choices page (stub only); Overview (placeholder charts) | — |
| **Cleaner gamification data** | Progress hub uses getGoals() for legacy block; structure ready | Progress level/rewards/next actions; Goals list/detail; Rewards; Badges; Maintenance; Stats; Level detail — all need API wiring | — |
| **Client profile** | Level + badges UI when API provides them | — | Backend to add level/badges to GET /cleaners/:id |
| **Backend** | — | — | All gamification endpoints to be implemented per guide |
| **Polish** | — | Empty/edge states; optional Figma tokens | Choice selection flow (cleaner); optional /cleaner/rewards/:rewardId |

---

## 6. RECOMMENDED NEXT STEPS

1. **Backend:** Implement endpoints from **GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md** (flags, goals, rewards, choices, governor, abuse, support debug, GET /cleaners/:id with level/badges, GET /cleaner/goals, GET /cleaner/progress or summary).  
2. **Frontend data wiring:**  
   - Add or use `GET /cleaner/progress` (or summary) and wire Progress hub (level, core %, stretch, maintenance, active rewards, next actions).  
   - Wire Goals list and goal detail to `GET /cleaner/goals` and goal-by-id.  
   - Wire Rewards (active + history + choice) and Badges to the appropriate APIs.  
   - Wire Maintenance and Stats to metrics/pause APIs.  
   - Wire Level detail (core/stretch/maintenance) to goals-by-level API.  
3. **Admin:** Implement Choice groups backend and add Choices page DataTable + create/edit; optionally add Overview analytics APIs and charts.  
4. **Optional:** Empty states, choice selection flow for cleaners, `/cleaner/rewards/:rewardId`, strict Figma design tokens.

---

## 7. DETAILED LIST OF ALL REMAINING WORK

Below is a single checklist of everything that still needs to be done, grouped by area. Items are written so they can be ticked off as you complete them.

---

### A. BACKEND (implement in backend repo)

**A.1 Feature flags**
- [ ] Implement `GET /admin/gamification/flags` (return gamification_enabled, rewards_enabled, cash_rewards_enabled, seasonal_enabled, governor_enabled, optional region_overrides).
- [ ] Implement `PATCH /admin/gamification/flags` (accept partial body; persist; return full state).

**A.2 Goals library**
- [ ] Implement `GET /admin/gamification/goals` (query params: level, type, enabled; return `{ goals: [] }`).
- [ ] Implement `GET /admin/gamification/goals/:id` (single goal).
- [ ] Implement `POST /admin/gamification/goals` (create; return created goal).
- [ ] Implement `PATCH /admin/gamification/goals/:id` (update; optional versioning).

**A.3 Rewards**
- [ ] Implement `GET /admin/gamification/rewards` (return `{ rewards: [] }`).
- [ ] Implement `GET /admin/gamification/rewards/:id` (single reward for admin edit).
- [ ] Implement `POST /admin/gamification/rewards` (create).
- [ ] Implement `PATCH /admin/gamification/rewards/:id` (update).

**A.4 Choice reward groups**
- [ ] Implement `GET /admin/gamification/choices` (return choice groups).
- [ ] Implement `GET /admin/gamification/choices/:id` (single group with options).
- [ ] Implement `POST /admin/gamification/choices` (create).
- [ ] Implement `PATCH /admin/gamification/choices/:id` (update).
- [ ] Implement `POST /cleaner/rewards/choice/:choiceGroupId/select` (body: `{ reward_id }`; validate eligibility, record selection, grant reward).

**A.5 Governor**
- [ ] Implement `GET /admin/gamification/governor` (per-region state: supply_score, demand_score, fill_time_hours, early_exposure_min, cap_multiplier, locked, etc.).
- [ ] Implement `PATCH /admin/gamification/governor` (overrides or apply_recommended).

**A.6 Abuse / fraud**
- [ ] Implement `GET /admin/gamification/abuse` (query: type, page, per_page; return items + pagination).
- [ ] Implement `POST /admin/gamification/abuse/:cleanerId/pause-rewards` (body: optional reason; set pause state).

**A.7 Support debug**
- [ ] Implement `GET /admin/support/cleaner/:cleanerId/gamification` (full payload: current_level, level_label, progress_paused, progress_paused_reason, core_completion_percent, stretch_selected, maintenance_ok, goal_progress, active_rewards, reward_grant_history, computed_metrics_debug, support_explanation).
- [ ] Implement `POST /admin/support/cleaner/:cleanerId/gamification/recompute` (recompute and persist; return same shape or 204).
- [ ] Implement `POST /admin/support/cleaner/:cleanerId/gamification/grant-reward` (body: reward_id, reason?, duration_days?; guarded).
- [ ] Implement `POST /admin/support/cleaner/:cleanerId/gamification/remove-reward` (body: reward_id, reason?; guarded).

**A.8 Client-facing cleaner profile**
- [ ] Extend `GET /cleaners/:id` response: add optional `level` (1–10) and `badges` (array of `{ id, name, icon? }`) to the cleaner object.

**A.9 Cleaner-facing progress and goals**
- [ ] Implement `GET /cleaner/goals` (for authenticated cleaner; return goals for current level with progress: id, type, title, current, target, window).
- [ ] Implement `GET /cleaner/progress` or `GET /cleaner/progress/summary` (current_level, level_label, core_completion_percent, stretch_selected, maintenance_ok, progress_paused, progress_paused_reason, active_rewards with reward_id, name, effect, expires_at, days_remaining; optionally next_best_actions).

**A.10 Cleaner maintenance and metrics**
- [ ] Expose maintenance status (progress_paused, progress_paused_reason, recovery steps) to cleaner — e.g. via progress summary or dedicated `GET /cleaner/maintenance` if you add it.
- [ ] Expose metrics for Stats page: on-time rate, acceptance rate, photo compliance, rating, disputes, add-on count — e.g. via `GET /cleaner/stats` or fields in progress/metrics API.

**A.11 Cleaner badges**
- [ ] Expose earned badges for authenticated cleaner (e.g. `GET /cleaner/badges` or include in profile/progress). Return list of badge definitions with earned status and earned_at where applicable.
- [ ] (If badge definitions are dynamic) Admin or system endpoint for badge definitions (id, name, icon, how_to_earn, category Core/Fun); or use static list in backend.

**A.12 Cleaner active rewards and history**
- [ ] Expose active rewards and reward grant history to cleaner (can be part of `GET /cleaner/progress` or separate `GET /cleaner/rewards` with tabs: active, earned/history, locked, choice-eligible).
- [ ] Expose “pending choice” (choice groups the cleaner is eligible to select from) for Choice tab and choice flow.

---

### B. FRONTEND — Cleaner-facing data wiring

**B.1 Progress hub (`/cleaner/progress`)**
- [ ] Add `cleanerProgressService` (or use existing) method for `GET /cleaner/progress` (or `/cleaner/progress/summary`).
- [ ] Replace hardcoded `currentLevel`, `levelLabel`, `coreCompletionPercent`, `stretchSelected`, `maintenanceOk`, `progressPausedReason` with API response.
- [ ] Replace hardcoded `nextBestActions` with API response (or derive from goals/progress if backend sends goals only).
- [ ] Replace hardcoded `activeRewards` with API response (e.g. from progress or rewards endpoint).
- [ ] Replace hardcoded `recentAchievements` with API response (e.g. from badges or progress).
- [ ] Handle loading and error states (skeleton or message when API fails).

**B.2 Goals list (`/cleaner/goals`)**
- [ ] Call `GET /cleaner/goals` (e.g. via `cleanerEnhancedService.getGoals()` or new service) and map response to GoalCard props.
- [ ] Render list of GoalCard components from API data (id, title, progress, target, countsWhen, rewardPreview, detailHref, actionHref).
- [ ] Add optional filters (level, type, “almost complete”) — UI placeholder exists; wire when backend supports query params.
- [ ] Handle empty state (no goals).
- [ ] Handle loading and error states.

**B.3 Goal detail (`/cleaner/goals/:goalId`)**
- [ ] Fetch goal by id for current cleaner (backend may expose via `GET /cleaner/goals` and find by id, or add `GET /cleaner/goals/:goalId`).
- [ ] Replace placeholder title, progress, “what counts”, reward text with API data.
- [ ] “Do Next Step” and “View Reward Preview” can link to jobs and reward info; ensure links use real goal/reward data if needed.

**B.4 Rewards center (`/cleaner/rewards`)**
- [ ] Add service method(s) for active rewards and reward history (and choice-eligible if separate).
- [ ] **Active tab:** Populate from API (active rewards list) instead of single hardcoded RewardCard.
- [ ] **Earned tab:** Populate from API (reward grant history or “earned” list).
- [ ] **Locked tab:** Populate from API if backend exposes “locked” rewards; otherwise keep placeholder copy until backend supports it.
- [ ] **Choice tab:** Show choice-eligible groups; wire “Select reward” to open ChoiceRewardModal and call `POST /cleaner/rewards/choice/:choiceGroupId/select` on confirm.
- [ ] Handle empty states per tab; loading and error states.

**B.5 Badges (`/cleaner/badges`)**
- [ ] Add service method for `GET /cleaner/badges` (or equivalent) returning earned badges and definitions.
- [ ] Replace `PLACEHOLDER_BADGES` with API data; map to BadgeGrid/BadgeCard props (id, name, icon, earned, earnedDate, howToEarn, featured, canPin, onPin, onShare).
- [ ] Keep Core/Fun/All tabs; filter by category from API or client-side.
- [ ] Handle empty state; loading and error states.

**B.6 Maintenance (`/cleaner/maintenance`)**
- [ ] Source `isPaused` and reason from API (e.g. from progress summary or dedicated maintenance endpoint).
- [ ] Replace hardcoded `isPaused = false` with API value; show PausedProgressBanner with API reason and recovery steps when paused.
- [ ] Wire “load from API” metric cards if backend exposes maintenance metrics on this page.

**B.7 Stats (`/cleaner/stats`)**
- [ ] Add service method for stats/metrics (e.g. `GET /cleaner/stats` or metrics from progress).
- [ ] Replace “—” values with API data (on-time rate, acceptance rate, photo compliance, avg rating, disputes, add-on count).
- [ ] Wire “How it’s calculated” to MetricExplainerModal or tooltip content if backend provides explainer text.

**B.8 Level detail (`/cleaner/progress/level/:levelNumber`)**
- [ ] Fetch goals for level (e.g. from `GET /cleaner/goals` filtered by level, or `GET /admin/gamification/goals?level=:levelNumber` if cleaner can read, or new endpoint).
- [ ] Populate Core goals section with GoalChecklist (or list) from API.
- [ ] Populate Stretch section with StretchGoalPicker and options from API; wire “Select Stretch Goal” to API if backend supports setting stretch selection.
- [ ] Populate Maintenance section from API if available.
- [ ] Handle loading and empty states.

---

### C. FRONTEND — Admin

**C.1 Choice groups page (`/admin/gamification/choices`)** — DONE
- [x] Add to `gamificationAdmin.service.ts`: getChoices(), getChoice(id), createChoice(), updateChoice() calling GET/POST/PATCH `/admin/gamification/choices` and `.../choices/:id`.
- [ ] Build DataTable for choice groups (columns: title, reward_ids count, eligibility_window_days, expires_at, enabled, updated_at; row click → edit).
- [ ] Add “Create choice group” flow (form: title, reward_ids, eligibility_window_days, expires_at, enabled).
- [ ] Add edit page or modal for choice group (e.g. `/admin/gamification/choices/:id`) with PATCH on save.
- [ ] Handle loading, empty, and error states.

**C.2 Gamification overview (`/admin/gamification`)**
- [ ] Define analytics endpoints (if backend will provide): e.g. level distribution, time-to-level median, reward burn/caps.
- [ ] Add service methods for those endpoints.
- [ ] Replace “(Chart from API)” / “(From API)” with real data and charts (e.g. simple bar/line charts or summary numbers).
- [ ] If backend does not provide these, leave placeholders or remove cards until backend is ready.

---

### D. FRONTEND — Cleaner choice reward flow (user-facing)

- [ ] Determine where “pending choice” appears (e.g. Progress hub, Rewards Choice tab, or toast after level-up).
- [ ] Add API call to fetch pending choice groups for current cleaner (e.g. from progress or `GET /cleaner/rewards` with choice-eligible).
- [ ] When user chooses “Select reward”, open ChoiceRewardModal with options from the group; on confirm call `POST /cleaner/rewards/choice/:choiceGroupId/select` with selected reward_id.
- [ ] Show success feedback and refresh active rewards / progress as needed.

---

### E. EMPTY AND EDGE STATES

- [x] **Goals list:** Empty state (no goals for level) — message + CTA or illustration.
- [ ] **Goal detail:** 404 or “Goal not found” when goal id invalid or not applicable to cleaner.
- [ ] **Rewards:** Empty state for Active tab (“No active rewards”); empty state for Earned/Locked/Choice as needed.
- [ ] **Badges:** Empty state per tab when no badges in category.
- [ ] **Progress hub:** First-time user (e.g. level 1, no goals yet) — consider copy or onboarding hint.
- [ ] **Maintenance:** When paused, ensure recovery steps and “Contact support” are clear.

---

### F. OPTIONAL / NICE-TO-HAVE

- [ ] **Route** `/cleaner/rewards/:rewardId`: Detail page for a single reward (if product wants it).
- [ ] **Job detail gamification:** “This job helps” tags on `/cleaner/jobs/:jobId` (e.g. “Counts toward Add-on goal”) using goal data from API.
- [ ] **Strict Figma design system:** 8pt grid, 80px margin, design tokens for colors/typography (optional).
- [ ] **AchievementToast:** Wire to real “reward/badge earned” events (e.g. from WebSocket or poll) and show toast when user earns something.

---

### G. DOCUMENTATION AND STUBS (general app)

- [ ] Replace or implement **stub** `GET /bookings/me` with real implementation when backend is ready.
- [ ] Replace or implement **stub** `GET /cleaners/:cleanerId/reviews` with real implementation when backend is ready.
- [ ] Keep BACKEND_ENDPOINTS.md and GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md in sync with any new endpoints you add.
