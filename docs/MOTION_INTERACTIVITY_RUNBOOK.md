# PureTask Motion + Interactivity Runbook (Phases 1–3)

**Purpose:** Execute Phases 1–3 (Global Motion + Skeletons → Booking + Job Details Polish → Presence Map) in one ordered sweep. This runbook is aligned with the current PureTask frontend repo. **Full-app coverage:** See [FULL_APP_REFINEMENT_CHECKLIST.md](./FULL_APP_REFINEMENT_CHECKLIST.md) for every area (Landing, Auth, Dashboard, Cleaner profiles, Payments, Settings, Admin, Psychological) mapped to runbook sections and addenda.

**Repo facts (verified):**

- **Framework:** Next.js 16, **App Router** (`src/app/`), no `pages/`.
- **Animation:** `framer-motion` ^12.x in package.json; used in `JobStatusRail`, `ReliabilityRing`, `MotionFadeIn`, `HeroSection`.
- **UI:** `src/components/ui/` — `Skeleton`, `SkeletonList`, `SkeletonCard`, `SkeletonTable`, `PageTransition` (CSS opacity + pathname), `AnimatedCard` (CSS animation classes), `EmptyState`, `Card`, `Button`, etc.
- **Motion:** `src/components/motion/MotionFadeIn.tsx` (simple fade). No shared motion tokens yet.
- **Job details:** `src/app/client/bookings/[id]/page.tsx`; `JobDetailsTracking` in `src/components/trust/`; `getJobDetails` + `getJobTracking` in `src/services/jobDetails.service.ts`; `useJobDetails`, `useJobTrackingPoll`.
- **Booking:** `src/app/booking/page.tsx` (step-based, `ServiceSelection`, `DateTimePicker`, etc.); `src/app/booking/confirm/[id]/page.tsx`.
- **Styles:** `src/app/globals.css` imports `src/styles/animations.css`; `animations.css` has `@keyframes shimmer` and `.animate-shimmer` (light-theme gradient).
- **Data:** GET `/jobs/:jobId/details` and GET `/tracking/:jobId` are used; backend implements details payload.

---

## Strategy

1. **Phase 1** — Global motion tokens + Framer-based wrappers + skeleton shimmer; apply to key pages.
2. **Phase 2** — Booking flow (stepper, price, cleaner cards, confirmation) + Job Details (timeline v2, proof gallery v2, ledger v2).
3. **Phase 3** — Presence map (styled map, home marker, cleaner dot, optional route, arrival glow).

Implement in that order to avoid rework. Each phase section below: **Files**, **What to do**, **Wire where**, **Verification**, **Acceptance**.

---

## 0) Pre-flight (one-time)

| Check | Action |
|-------|--------|
| **Router** | Confirm `src/app/` exists; no `src/pages/`. ✅ App Router. |
| **framer-motion** | In package.json: `"framer-motion": "^12.x"`. If missing, `npm i framer-motion`. |
| **Build** | `npm run dev` and a page that imports `framer-motion` compile. |

**Acceptance:** You know layout lives in `src/app/layout.tsx`; page-level wrappers go inside each route’s page or a shared layout; deps are installed.

---

## PHASE 1 — Global Motion System + Skeleton Loading

### 1.1 Motion tokens (single source of truth)

**Create:** `src/components/motion/tokens.ts`

- Export `motionTokens`: `duration` (instant, fast, base, slow), `ease` (out, inOut), `spring` (soft, medium, snappy), `hover` (lift, press), `page` (enter, initial, exit).
- Use same numeric/cubic-bezier values as in the Phase 1 spec (e.g. `ease.out: [0.16, 1, 0.3, 1]`).

**Verification:** Import `motionTokens` in any component; build passes.

**Acceptance:** One file defines all motion constants used across the app.

---

### 1.2 Framer Motion wrappers (do not replace existing UI yet)

**Create:**

- `src/components/motion/PageTransitionMotion.tsx` — Framer Motion div with `initial/animate/exit` from `motionTokens.page`, `transition` from `motionTokens.duration.base` and `ease.out`. Use for **page-level** transitions.
- `src/components/motion/AnimatedCardMotion.tsx` — Framer Motion div with `whileHover` (lift), `whileTap` (press) from tokens, `transition` from `motionTokens.spring.soft`. Wraps children only (no Card styling).
- `src/components/motion/Stagger.tsx` — Container with `initial="hidden"` / `animate="show"` and `staggerChildren` + `delayChildren`. Export `StaggerItem` with variants opacity/y/blur.

**Note:** Keep existing `src/components/ui/PageTransition.tsx` and `src/components/ui/AnimatedCard.tsx` as-is for now; migrate pages to Motion wrappers where you want the new behavior.

**Verification:** Use `PageTransitionMotion` on one page; use `AnimatedCardMotion` around one Card; use `Stagger` + `StaggerItem` on one list; build and visual check.

**Acceptance:** Reusable motion wrappers exist and are used in at least one place.

---

### 1.3 Skeleton shimmer (upgrade + app-specific blocks)

**Option A (recommended):** Add a **shimmer** variant to existing `src/components/ui/Skeleton.tsx` that uses the existing `.animate-shimmer` from `src/styles/animations.css` (or a new `.skeleton-shimmer` class with dark-mode-friendly gradient). Keep existing `animate-pulse` as default; add prop `variant="shimmer"` or `animated="shimmer"`.

**Option B:** Add new class in `globals.css` or `animations.css`: `.skeleton-shimmer` with gradient + `background-size` + `animation: shimmer`.

**Create (or extend Skeleton.tsx):**

- **Job row:** `src/components/ui/skeleton/JobRowSkeleton.tsx` — Row layout: avatar block, lines (title, subtitle), pill. Use `Skeleton` (or shimmer variant).
- **Card block:** `src/components/ui/skeleton/CardSkeleton.tsx` — Rounded card shape with header line, body block, optional footer.
- **Profile:** `src/components/ui/skeleton/ProfileSkeleton.tsx` — Avatar + lines + pills (match `ProfileSkeleton` from spec).
- **Map placeholder:** `src/components/ui/skeleton/MapPlaceholderSkeleton.tsx` — Rectangular map area with subtle shimmer (for Job Details presence card while map loads).
- **Ledger:** `src/components/ui/skeleton/LedgerSkeleton.tsx` — Short row of “node” shapes + connecting line (for ledger flow section).

**Verification:** Render each skeleton on a page; shimmer animates (or pulse if you keep pulse for some).

**Acceptance:** Shimmer (or consistent) skeletons exist; at least one list/dashboard page uses them instead of spinner-only.

---

### 1.4 Apply Phase 1 to core surfaces

**Targets:**

- **Dashboard(s):** e.g. `src/app/client/dashboard/page.tsx`, `src/app/cleaner/dashboard/page.tsx`, `src/app/admin/dashboard/page.tsx`.
- **Job/booking list:** `src/app/client/bookings/page.tsx`.
- **Job detail:** `src/app/client/bookings/[id]/page.tsx`.

**What to do:**

- Wrap main content in `PageTransitionMotion` (or keep existing `PageTransition` and add Motion only where you want enter/exit).
- Where you show **loading:** use `JobRowSkeleton` / `CardSkeleton` / `ProfileSkeleton` (or `SkeletonList`) instead of only `LoadingSpinner`.
- For **lists of cards** (jobs, cleaners): wrap each card in `AnimatedCardMotion`; wrap list in `Stagger` and each item in `StaggerItem` so items reveal in sequence. For **job/cleaner cards** specifically: on hover add shadow deepen (e.g. transition box-shadow via motion or CSS) and reveal secondary actions (e.g. “Book again”, “View”, “Message”) that fade/slide in.
- **Dashboard extras:** Status pills (e.g. job/booking status): animate color/opacity transition when status changes (use `motionTokens` duration) instead of instant swap. Optional: Quick Action Panel — floating “Book Again” (or primary CTA) card with subtle pulse (scale or opacity loop).

**Verification:** Navigate between dashboard and bookings; loading shows skeletons; card hover has subtle lift; list items animate in.

**Acceptance:** No major “spinner only” loading on these pages; motion feels consistent.

---

### 1.5 Loading / empty / error pattern

**Rule:** For every primary data view:

- **Loading** → skeleton (not spinner alone).
- **Error** → error card / `ErrorDisplay` with retry.
- **Empty** → `EmptyState` (or domain variant like `EmptyBookings`) with soft icon, one line, primary CTA. Optional: add ambient animation (e.g. soft pulse on icon or subtle background motion) so empty state feels alive, not static.

**Verification:** Force loading (throttle) or empty list; confirm skeleton then empty state; force API error and see error UI.

**Acceptance:** All primary pages follow load → skeleton, empty → empty state, error → error state.

---

### 1.6 Landing page (optional)

- **Scroll-triggered reveals:** Each landing section (e.g. How it works, Trust strip) fades + slides in on scroll (intersection observer or Framer `whileInView`).
- **Trust Proof Strip:** Animated metrics (jobs completed, avg reliability, repeat customers %) with count-up on load; use Framer `animate` for numbers.
- **Hero:** Repo already has `AmbientHeroScene3D` + `HeroSection`; keep low motion and ambient feel.

---

### 1.7 Settings / account (optional)

- **Save feedback:** After save (profile, preferences): subtle green toast + optional checkmark draw animation (e.g. Lottie or SVG path).
- **Toggles:** Use spring transition for toggle snap (e.g. `motionTokens.spring.snappy`) so they don’t flip instantly.

---

### 1.8 Admin (optional)

- **Table row hover:** Highlight row + reveal action icons on hover (opacity/translate from motion tokens).
- **Bulk actions:** Animated selection counters (e.g. “3 selected” pill that scales in).

---

## PHASE 2 — Booking + Job Details Polish

### 2.0 Data / API check (before UI work)

**Confirm:**

- `getJobDetails(jobId)` → GET `/jobs/:jobId/details` (used in `useJobDetails`). ✅
- `getJobTracking(jobId)` → GET `/tracking/:jobId` (used in `useJobTrackingPoll`). ✅
- Booking flow uses existing APIs (e.g. `useCreateBooking`, `usePriceEstimate`, `useCleaner`). ✅

**Acceptance:** No new API surface required for Phase 2; only UI and animation.

---

### 2.1 Booking flow: Stepper + cards

**Location:** `src/app/booking/page.tsx` (and confirm step if present).

**Build (under `src/components/features/booking/` or extend existing):**

- **TaskBuilderShell** — Wraps steps; progress bar; optional summary pills.
- **TaskStepCard** — Single step content; slide-in from right (x: 40 → 0, opacity, blur).
- **TaskStepperHeader** — Step titles + progress indicator.
- **TaskSummaryPills** — Previous steps compressed to pills.
- **AvailabilityGrid / AvailabilitySlot** — Time slots; while loading show shimmer skeleton.
- **RecommendedTag** — “Recommended” tag that fades in with soft pulse when a default cleaner/time is suggested.
- **Smart defaults:** Optional glow or highlight around recommended cleaner card or time slot (e.g. ring or background pulse once).

**Motion:** Step enter: `x: 40 → 0`, opacity 0 → 1; exit: `x: 0 → -40`, opacity 1 → 0. Use `motionTokens` durations and ease.

**Verification:** Next/Back step feels directional; progress bar animates.

**Acceptance:** Booking feels like a guided flow, not a single long form.

---

### 2.2 Booking: Price preview + credits animation

**Build:**

- **CreditsCounter** — Displays credits; animate number when `price_credits` / options change (Framer `animate` or count-up).
- **PriceBreakdownCard** — Breakdown lines; optional “rush” highlight pulse when `is_rush` or `rush_fee_credits` present.

**Data:** `price_credits`, `rush_fee_credits`, `is_rush` from booking state / estimate.

**Verification:** Change service or time; credits count updates smoothly; rush adds subtle pulse.

**Acceptance:** Price changes feel premium.

---

### 2.3 Booking: Cleaner selection (Wallet-style)

**Build:**

- **CleanerSelectCard** — Expand on hover; show reliability, rating, jobs count; optional badges.
- **ReliabilityRingSmall** — Small ring (reuse or adapt `ReliabilityRing` from `src/components/trust/ReliabilityRing.tsx`).
- **BadgeRow** — “On Time”, “Photo compliant”, etc.

**Data:** `cleaner.reliability_score`, `avg_rating`, `jobs_completed`, `tier`, badges (from GET `/cleaners/:id` or details).

**Verification:** Hover expands card; selection state is clear.

**Acceptance:** Cleaner selection feels high-trust.

---

### 2.4 Booking confirmation (trust reinforcement)

**Location:** After create booking success (e.g. redirect to `src/app/booking/confirm/[id]/page.tsx` or in-booking success state).

**Build:**

- **BookingConfirmation** — Full-screen or large card: “Booked”, “Cleaner notified”, “Credits held in escrow”.
- **AnimatedCheckRow** — Each line with checkmark that draws or fades in sequentially.

**Data:** `job.id`, `job.status`; optionally ledger `job_escrow` from details.

**Verification:** After booking, confirmation shows with sequential checkmarks.

**Acceptance:** Confirmation feels like a clear handshake.

---

### 2.5 Job Details: Timeline rail refinement

**Current:** `JobStatusRail` + `mapBackendJobStatusToRail` in `src/components/trust/`.

**Enhance (or add V2):**

- Active node: gentle pulse (scale/opacity).
- Completed nodes: slightly faded.
- Status changes: animate transition instead of snap.
- **Optional:** Reliability Ring on Job Details: number counts up from 0 to current score; ring stroke animates (path length or dash offset) so it “draws itself” on load.

**Data:** `job.status`; optional `tracking?.status`; timestamps from `job_events` if you surface them.

**Verification:** Change status (or mock); rail updates with animation.

**Acceptance:** Timeline feels alive, not static.

---

### 2.6 Job Details: Proof gallery V2 (before/after)

**Current:** Photos in `JobDetailsTracking` via `PhotosBlock` (before/after grids).

**Build:**

- **ProofGalleryV2** — Before/after sections; optional **BeforeAfterCompare** slider to compare same frame.
- Data: `job_photos` grouped by `type`; order by `created_at`.

**Verification:** Slider works; loading shows skeleton.

**Acceptance:** Proof feels like strong evidence.

---

### 2.7 Job Details: Ledger flow V2

**Current:** `LedgerPhase` in `JobDetailsTracking` (Pending / Moving / Settled from ledger + payout).

**Build:**

- **LedgerFlowV2** — Same states; particles or segments use curved paths, ease-in/out, optional cluster at endpoints. Use Framer Motion for path/length animations.

**Data:** `ledgerEntries` (job_escrow, job_release), `payout?.status`.

**Verification:** States transition smoothly; no harsh jumps.

**Acceptance:** Ledger communicates trust-fintech feel.

---

### 2.8 Auth / onboarding (optional)

- **Progressive disclosure:** Don’t show all form fields at once; step cards or collapsible sections.
- **Step cards:** Horizontal slide between steps (same pattern as booking stepper).
- **Input validation:** On error: soft shake + red glow pulse; on success: green checkmark slide-in (use motion tokens).
- **Onboarding progress bar:** Thin bar at top; fill animates with spring when step advances.

---

### 2.9 Cleaner profiles (optional)

- **Card expand:** Apple Wallet–style expand on hover/tap (scale + elevate, optional background blur).
- **Stats reveal:** Fade in reliability, rating, jobs completed sequentially (stagger).
- **Recent jobs preview:** Mini gallery with swipe (e.g. last 3 jobs); skeleton while loading.

---

### 2.10 Payments / wallet (optional)

- **Balance animation:** Credits count up when wallet/credits page opens (Framer `animate` or count-up).
- **Transaction rows:** List items slide in one-by-one (Stagger + StaggerItem).
- **Payment success state:** Full-screen or large card with sequential checkmarks (e.g. “✔ Job secured”, “✔ Cleaner notified”, “✔ Credits held”) — same pattern as BookingConfirmation; reuse or adapt.

---

### 2.11 Psychological layer (optional)

- **Predictive UI:** Where relevant, show next likely action (e.g. “Cleaner arriving in ~7 min”, “You’ll probably want to book again next week”) — copy + placement in Job Details or dashboard.
- **Trust reinforcement:** Every primary page surfaces at least one of: reliability metric, proof image, or process indicator (audit pages and add one trust element where missing).

---

## PHASE 3 — Presence Map Upgrade

### 3.0 Map provider

**Choice:** Google Maps JS SDK (recommended if you already use Google for directions) or Mapbox. Obtain API key/token for frontend; ensure allowed referrers/domains.

**Acceptance:** Key/token available; no key in repo (env only).

---

### 3.1 PresenceMapCard container

**Build:** `src/components/features/tracking/PresenceMapCard.tsx`

- Wraps map canvas.
- Overlays: status pill (On route / Arrived / Working), “Open in Maps” link (reuse existing pattern if any), optional ETA.

**Wire:** Job Details page `src/app/client/bookings/[id]/page.tsx` — add or replace current presence section with `PresenceMapCard`.

**Verification:** Card appears on job detail; layout holds.

**Acceptance:** Single container ready for map + overlays.

---

### 3.2 Styled map wrapper

**Build:** `src/components/features/tracking/map/StyledMap.tsx` (or equivalent)

- Initialize map (Google or Mapbox).
- Apply custom style (reduce default UI chrome).
- Center/zoom: fit job location; when cleaner location exists, fit both or center on job.

**Verification:** Map renders with custom style.

**Acceptance:** Map is ambient, not noisy.

---

### 3.3 Job “home” marker

**Build:** `src/components/features/tracking/map/JobHomeMarker.tsx` (or inline in StyledMap)

- Marker at `job.latitude`, `job.longitude`; soft glow ring; slow pulse.

**Verification:** Home node visible and subtle.

**Acceptance:** Home reads as “job location”, not a giant pin.

---

### 3.4 Cleaner dot with smoothing

**Build:** `src/components/features/tracking/map/CleanerDot.tsx`

- Position from `tracking.currentLocation` (lat/lng).
- On update: animate from previous to new position (~1.2s); if new update mid-animation, blend.

**Data:** `getJobTracking` (poll 5–10s) returns `currentLocation`; backend from `job_events` (e.g. `cleaner.location_updated`).

**Verification:** Dot moves smoothly; no teleport.

**Acceptance:** Cleaner dot feels live.

---

### 3.5 Route polyline (optional)

**Build:** `src/components/features/tracking/map/RoutePolyline.tsx`

- **Simple:** line from cleaner → job.
- **Premium:** directions API → polyline; animate draw (path length 0 → 1).

**Verification:** Line appears when status is on_my_way; draws in smoothly.

**Acceptance:** Route supports “on the way” story.

---

### 3.6 Arrival radius / check-in glow

**Build:** `src/components/features/tracking/map/ArrivalRadiusGlow.tsx`

- Circle at job location; trigger when status is arrived / check_in / in_progress (per your status set).
- One pulse: scale 0.95 → 1.05 → 1; opacity 0.2 → 0.45 → 0.25; then soft ring.

**Verification:** Arrival or check-in triggers pulse.

**Acceptance:** Arrival moment is visible.

---

### 3.7 Wire map into Job Details page

**Edit:** `src/app/client/bookings/[id]/page.tsx` and/or `JobDetailsTracking`

- Pass `job` (lat/lng, address) and `tracking` into `PresenceMapCard`.
- Replace or augment any existing “Presence” / “Live location” block with the full map card.

**Verification:** Full flow: open job detail → see map, home marker, cleaner dot (if tracking returns location), optional route and arrival glow.

**Acceptance:** Job Details has timeline + map + proof + ledger; all loading/empty states handled.

---

## Integration order (sweep)

1. **Phase 1** — Tokens → Motion wrappers → Skeleton shimmer + blocks → Apply to dashboard + bookings list + job detail → Standardize load/empty/error.
2. **Phase 2** — Booking stepper + price + cleaner cards + confirmation; then Job Details timeline v2 + proof v2 + ledger v2.
3. **Phase 3** — Map provider → PresenceMapCard → StyledMap → Home marker → Cleaner dot → Route (optional) → Arrival glow → Wire into Job Details.

---

## Test plan

- **Functional:** Job Details loads from scratch; throttled network shows skeletons; missing photos/ledger show empty states.
- **Visual:** Card hover consistent; page transitions subtle; no jitter (especially map dot).
- **Data:** Timeline matches `job.status` (and `tracking?.status`); ledger matches `job_escrow` / `job_release`; dot uses latest `tracking.currentLocation`.

---

## Definition of done

- **Phase 1:** Motion tokens and wrappers in use; skeletons (shimmer or pulse) on primary pages; load/empty/error pattern everywhere; no spinner-only major views.
- **Phase 2:** Booking is a clear stepper with animated price and confirmation; Job Details has refined timeline, proof gallery, and ledger.
- **Phase 3:** Presence map shows real map, home marker, smoother cleaner dot, optional route, and arrival glow; integrated into Job Details.

---

## Deferrals (safe to do later)

- Standalone `/jobs/[jobId]` route (optional; currently job detail is under `/client/bookings/[id]`).
- WebSocket/SSE for tracking (Phase 3 can ship with polling).
- Full Google Maps directions API for polyline (simple line is acceptable first).
- Replacing every existing `PageTransition` / `AnimatedCard` with Motion versions (migrate incrementally).

---

## Full-app coverage reference

For a **per-area checklist** (Global, Landing, Auth, Dashboard, Booking, Job Details, Cleaner profiles, Payments, Settings, Admin, Psychological), see **[FULL_APP_REFINEMENT_CHECKLIST.md](./FULL_APP_REFINEMENT_CHECKLIST.md)**. It maps every item to this runbook (phase + section) and lists addenda above (e.g. Phase 1.6 Landing, 1.7 Settings, 1.8 Admin, 2.8 Auth, 2.9 Cleaner profiles, 2.10 Payments, 2.11 Psychological) so the entire app and each page are covered.
