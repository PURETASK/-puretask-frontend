# PureTask Animation & Polish Audit

This document answers: **Is everything wired correctly?** **Are animations/transitions fully covered?** **Where should we add more?** **Which areas don’t feel polished?** **Are gamification assets animated?**

**Reference:** [MOTION_INTERACTIVITY_RUNBOOK.md](./MOTION_INTERACTIVITY_RUNBOOK.md) (Phases 1–3) and [FULL_APP_REFINEMENT_CHECKLIST.md](./FULL_APP_REFINEMENT_CHECKLIST.md).

---

## Implementation status (Phases 1–3 + Gamification)

The following has been **implemented** in the repo:

- **Phase 1:** Motion tokens (`src/components/motion/tokens.ts`), `PageTransitionMotion`, `AnimatedCardMotion`, `Stagger`/`StaggerItem`; app template uses `PageTransitionMotion` for route transitions; Skeleton has `animation="shimmer"`; `JobRowSkeleton`, `CardSkeleton`, `ProfileSkeleton`, `MapPlaceholderSkeleton`, `LedgerSkeleton` in `src/components/ui/skeleton/`; client dashboard and client bookings (list + detail) use `JobRowSkeleton`, `Stagger`/`StaggerItem`, `AnimatedCardMotion` on cards.
- **Phase 2:** `CreditsCounter`, `BookingConfirmation`, `AnimatedCheckRow` in `src/components/features/booking/`; `BeforeAfterCompare` and its use in `JobDetailsTracking` for before/after photos; `PresenceMapCard` with map placeholder in `JobDetailsTracking`.
- **Phase 3:** `PresenceMapCard` container with placeholder map (real map can be wired later via `useRealMap` and a map provider).
- **Gamification:** `AchievementToast` slide-in/scale; `BadgeCard` entrance + `StaggerItem`; `BadgeGrid` uses `Stagger`; `LevelProgressRing` ring-draw and count-up on mount.

Remaining optional polish (auth steps, settings toggles, payments balance animation, etc.) can be added incrementally per runbook.

---

## 1. Is everything wired together correctly?

### ✅ Wired correctly

| Area | Status | Notes |
|------|--------|--------|
| **Job details** | ✅ | `useJobDetails` → `getJobDetails` / GET `/jobs/:id/details` (with fallback). Types and `unwrapData` in `jobDetails.service.ts`. |
| **Job tracking** | ✅ | `useJobTrackingPoll` → GET `/tracking/:jobId`. Passed as `tracking` into `JobDetailsTracking`. |
| **Booking details page** | ✅ | `src/app/client/bookings/[id]/page.tsx` uses `useBooking`, `useJobDetails`, `useJobTrackingPoll`, and renders `JobDetailsTracking` with `details` + `tracking`. |
| **Trust components** | ✅ | `JobStatusRail`, `ReliabilityRing`, `JobDetailsTracking` use Framer Motion / SVG and are used on the booking detail page. |
| **Loading states** | ✅ | Many pages use `SkeletonList` (and some `SkeletonCard` / `SkeletonTable`) while loading; not spinner-only. |
| **Error / empty** | ✅ | `ErrorDisplay` and `EmptyBookings` (and other empty states) are used where appropriate. |

### ⚠️ Partially wired or not applied

| Area | Status | Notes |
|------|--------|--------|
| **Page transitions** | ⚠️ | `PageTransition` exists (CSS opacity on pathname) but **no page uses it** in `src/app/`. No Framer-based enter/exit (e.g. y + blur) as in runbook. |
| **Motion tokens** | ❌ | **Not created.** Runbook specifies `src/components/motion/tokens.ts`; only `MotionFadeIn.tsx` exists under `motion/`. |
| **Framer wrappers** | ⚠️ | `PageTransitionMotion`, `AnimatedCardMotion`, `Stagger` / `StaggerItem` from runbook **do not exist**. Existing `AnimatedCard` uses CSS classes (`animate-fade-in-up` etc.), not Framer `whileHover`/`whileTap`. |
| **Layout** | ⚠️ | Root layout does not wrap `children` in any page transition. |

So: **data and job-details/tracking UI are wired correctly.** **Global motion system (tokens + Framer wrappers + page transitions) is documented but not implemented.**

---

## 2. Have we covered all animations and transitions for PureTask?

**No.** The runbook and checklist define the desired state; current code only implements part of it.

### Implemented today

- **Trust:** `JobStatusRail` and `ReliabilityRing` use Framer Motion (variants, `motion.div`/`motion.circle`).
- **Hero:** `HeroSection` uses Framer Motion for title, subtitle, and CTA.
- **Motion:** `MotionFadeIn` (simple fade-in).
- **CSS:** `animations.css` has fade, slide, scale, pulse, shimmer keyframes; `AnimatedCard` uses CSS animation classes; `.hover-lift` / `.hover-scale` exist but are not consistently applied to cards.

### Not implemented (from runbook)

- **Phase 1:** Motion tokens, `PageTransitionMotion`, `AnimatedCardMotion`, `Stagger`/`StaggerItem`. Shimmer variant on `Skeleton` (currently pulse only). App-specific skeletons: `JobRowSkeleton`, `CardSkeleton`, `ProfileSkeleton`, `MapPlaceholderSkeleton`, `LedgerSkeleton`. Page-level transitions and list stagger on dashboards/bookings. Status pill transitions, Quick Action Panel, shadow deepen + secondary actions on cards.
- **Phase 2:** Booking stepper (slide left/right), price count-up, cleaner cards (Wallet-style expand), confirmation checkmarks. Job Details: timeline rail v2 (pulse on active), reliability ring count-up + draw, ledger v2 (curved particles), proof before/after slider. Auth/onboarding progressive disclosure and validation animation. Cleaner profiles card expand and stats reveal. Payments balance count-up and transaction stagger.
- **Phase 3:** Presence map (styled map, home marker, cleaner dot, route polyline, arrival glow).

So: **we have not covered all animations and transitions**; the runbook is the backlog.

---

## 3. Where should we add (more) animations and transitions?

### High impact (do first)

1. **Global**
   - Add `src/components/motion/tokens.ts` and use it everywhere motion is used.
   - Add `PageTransitionMotion`, `AnimatedCardMotion`, `Stagger`/`StaggerItem` and use on:
     - All main dashboards (client, cleaner, admin).
     - Client bookings list and booking detail.
     - Booking flow (step container and list of options/cards).
   - Give `Skeleton` a shimmer variant and use it (or keep pulse where appropriate); add `JobRowSkeleton` (and optionally Card/Profile/Map/Ledger skeletons) where they fit.

2. **Dashboard**
   - Wrap each booking/cleaner/job card in `AnimatedCardMotion` (or apply hover lift + shadow via CSS/motion).
   - Use `Stagger` + `StaggerItem` for lists of cards so items reveal in sequence.
   - Status pills: animate color/opacity when status changes (use tokens).
   - Optional: Quick Action “Book again” card with subtle pulse.

3. **Gamification**
   - **AchievementToast:** Slide-in (e.g. from top-right), optional scale; dismiss with slide-out.
   - **BadgeCard:** Entrance (fade + slight scale or y); on “earned” a short celebration (e.g. ring pulse or scale bounce).
   - **BadgeGrid:** Stagger children so badges appear one-by-one.
   - **LevelProgressRing:** Animate ring draw (e.g. `pathLength` or `strokeDashoffset` from 0) and optional count-up for percentage.
   - **LevelBadge:** Optional subtle scale on appear.
   - **GoalCard / GoalChecklist:** Stagger list items; progress bar fill with transition (already partial via `Progress`).
   - **StretchGoalPicker:** Selection state with a clear transition (e.g. border/background spring).

4. **Booking flow**
   - Step container: slide (x) + opacity on step change.
   - Price/credits: count-up when options change.
   - Cleaner cards: hover expand (Wallet-style), stagger on load.

5. **Job details**
   - Timeline: active node pulse, completed nodes slightly muted; status change animated.
   - Reliability ring: count-up + ring draw on mount.
   - Ledger: simple transition between pending/moving/settled (and later v2 particles if desired).
   - Photos: before/after slider; optional hover zoom.

### Medium impact

- **Landing:** Scroll-triggered reveal per section; Trust Proof Strip with count-up.
- **Auth/onboarding:** Step cards with horizontal slide; validation shake/glow and success checkmark; progress bar with spring.
- **Cleaner profiles:** Card expand (scale + blur), stats reveal in sequence, recent jobs gallery with swipe.
- **Payments/wallet:** Balance count-up on open; transaction rows stagger; payment success screen with sequential checkmarks.
- **Settings:** Save feedback (toast + checkmark); toggles with spring snap.
- **Admin:** Table row hover + action icons; bulk selection counter animation.

### Lower priority (Phase 3)

- Presence map: styled map, job marker, cleaner dot with smoothing, optional route line and arrival glow.

---

## 4. Areas that don’t feel polished

| Area | Issue | Recommendation |
|------|--------|----------------|
| **Page changes** | No shared enter/exit motion; content can feel like a hard cut. | Use `PageTransitionMotion` (or layout wrapper) on every main route. |
| **Dashboard cards** | `BookingCard` and similar are plain `Card`; no hover lift, shadow deepen, or reveal of secondary actions. | Wrap in `AnimatedCardMotion`; add hover shadow + secondary actions (e.g. “Book again”, “View”) that appear on hover. |
| **Lists** | Cards/lists appear in one block. | Use `Stagger` + `StaggerItem` for list/card grids. |
| **Status pills** | Color changes are instant. | Animate color/opacity with a short duration from motion tokens. |
| **Skeletons** | Only pulse; no shimmer. | Add shimmer variant and use where it fits (e.g. lists); keep pulse for small elements if desired. |
| **Booking flow** | Steps feel like a form, not a flow. | Stepper with slide transitions; price preview with count-up; cleaner cards with hover expand and stagger. |
| **Job details** | Timeline and ledger are static; no “proof” slider. | Add timeline pulse/dimming, ledger phase transition, before/after slider. |
| **Gamification** | Badges, level, goals feel static. | Add entrance + celebration for badges/level; stagger grids and lists; animate progress and selection. |
| **Empty states** | Mostly static. | Optional ambient motion (e.g. soft pulse on icon) per runbook. |
| **Landing** | Sections appear without scroll reveal; no Trust Proof Strip motion. | Scroll-triggered reveal; count-up metrics. |
| **Settings / Admin** | No save feedback or table/bulk motion. | Green toast + checkmark on save; spring toggles; row hover and bulk counter. |

---

## 5. Did we animate all the gamification assets?

**No.** Current state:

| Asset | Current behavior | Recommended addition |
|-------|------------------|----------------------|
| **AchievementToast** | Static div; no motion. | Slide-in (e.g. from top-right), optional scale; slide-out on dismiss. |
| **BadgeCard** | `transition-shadow hover:shadow-md`; no entrance. | Entrance: fade + slight scale/y; earned: short celebration (e.g. ring pulse or bounce). |
| **BadgeGrid** | Static grid. | Stagger children so each badge animates in with a small delay. |
| **LevelProgressRing** | CSS `transition-all duration-500` on stroke only. | Ring “draw” on mount (e.g. animate `strokeDashoffset` or pathLength); optional count-up for % text. |
| **LevelBadge** | Static span. | Optional: light scale or fade on appear. |
| **GoalCard** | Static card. | Use inside `StaggerItem`; ensure `Progress` has smooth fill transition. |
| **GoalChecklist** | Static list/cards. | Stagger items; optional checkmark draw when completed. |
| **StretchGoalPicker** | `transition-colors` on selection. | Add spring/smooth transition for border and background; optional scale on select. |

So: **gamification assets are not fully animated;** the table above is the checklist to make them feel polished.

---

## 6. Summary and next steps

- **Wiring:** Job details and tracking (API, hooks, `JobDetailsTracking`) are correct. Global motion system (tokens, Framer wrappers, page transitions) is **not** in place and **no page** uses `PageTransition` or Framer-based list/card motion.
- **Coverage:** Animations and transitions are **not** fully covered; the runbook (Phases 1–3) and full-app checklist are the spec.
- **Add more:** Prioritize global tokens + wrappers + page transitions, then dashboard cards + lists, then gamification (toast, badges, level ring, goals), then booking and job details polish.
- **Polish gaps:** Page transitions, dashboard cards/lists, status pills, skeletons (shimmer), booking stepper/price/cleaner cards, job details timeline/ledger/proof, gamification, empty/landing/settings/admin.
- **Gamification:** None of the gamification assets are fully animated; add entrance, celebration, stagger, and progress/selection transitions as in the table above.

**Suggested order of work**

1. **Phase 1 (foundation):** Create motion tokens; add `PageTransitionMotion`, `AnimatedCardMotion`, `Stagger`/`StaggerItem`; add Skeleton shimmer and app-specific skeletons; apply to dashboards and bookings (page transition + card wrap + list stagger).
2. **Gamification pass:** Animate AchievementToast, BadgeCard, BadgeGrid, LevelProgressRing, LevelBadge, GoalCard/GoalChecklist, StretchGoalPicker as above.
3. **Phase 2:** Booking stepper/price/cleaner cards/confirmation; Job Details timeline/ledger/proof; auth/onboarding; cleaner profiles; payments; settings/admin.
4. **Phase 3:** Presence map when ready.

This keeps wiring correct, aligns the app with the runbook and checklist, and makes gamification and key flows feel polished.
