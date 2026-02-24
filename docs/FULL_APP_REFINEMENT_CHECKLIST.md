# Full-App Refinement Checklist (Experience-Layer Upgrades)

This document maps the **entire app** refinement list (Global → Landing → Auth → … → Psychological) to what is already in the [MOTION_INTERACTIVITY_RUNBOOK.md](./MOTION_INTERACTIVITY_RUNBOOK.md) and what was missing. Gaps have been added to the runbook so everything is covered.

**Goal:** Turn PureTask from "working startup app" into "premium trust platform" (Apple + Stripe + modern logistics).

---

## GLOBAL (entire app)

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Motion system (tokens: fast/normal/slow, ease, hoverLift) | ✅ | Phase 1.1 `motionTokens` | — |
| Global loading skeletons (not spinners): Profile, Job row, Card | ✅ | Phase 1.3 JobRowSkeleton, CardSkeleton, ProfileSkeleton | — |
| Map placeholder skeleton | ✅ | Phase 1.3 add **MapPlaceholderSkeleton** (see Runbook addendum) | Added |
| Ledger skeleton | ✅ | Phase 1.3 add **LedgerSkeleton** (see Runbook addendum) | Added |
| Page transitions (fade + vertical shift on route change) | ✅ | Phase 1.2 PageTransitionMotion with `page.initial` / `enter` / `exit` | — |
| Empty state design system (soft icon, 1-line explanation, primary CTA, ambient animation) | ✅ | Phase 1.5 EmptyState; optional ambient animation (e.g. soft pulse on icon) in runbook 1.5 | — |

---

## LANDING / MARKETING

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Hero ambient scene (floating home nodes, service paths, soft city grid, low motion) | ✅ | Repo has `AmbientHeroScene3D` + `HeroSection`; Phase 1.6 notes keep low motion | — |
| Scroll-triggered reveal sections (each section fades + slides in) | ✅ | Phase 1.6 Landing | — |
| Trust Proof Strip (animated metrics: jobs completed, avg reliability, repeat customers %; count-up on load) | ✅ | Phase 1.6 Landing | — |

---

## AUTH / ONBOARDING

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Progressive disclosure (don't show all fields at once) | ✅ | Phase 2.8 Auth/Onboarding | — |
| Step cards with horizontal slide | ✅ | Phase 2.8 Auth/Onboarding | — |
| Input validation animation (error: soft shake, red glow; success: green checkmark slide-in) | ✅ | Phase 2.8 Auth/Onboarding | — |
| Onboarding progress bar (top thin bar, spring animation) | ✅ | Phase 2.8 Auth/Onboarding | — |

---

## DASHBOARD

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Job cards: hover lift, shadow deepen, reveal secondary actions | ✅ | Phase 1.2 AnimatedCardMotion (lift/press); Phase 1.4: also shadow deepen on hover, reveal secondary actions (e.g. "Book again", "View") on hover | — |
| Status pills: animate color transitions instead of snapping | ✅ | Phase 1.4 Dashboard | — |
| Quick Action Panel (floating "Book Again" card with subtle pulse) | ✅ | Phase 1.4 Dashboard | — |

---

## BOOKING / TASK BUILDER

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Horizontal stepper animation (steps slide left/right, progress bar spring) | ✅ | Phase 2.1 TaskBuilderShell, TaskStepCard, TaskStepperHeader, TaskSummaryPills | — |
| Price preview animation (credits count up/down when options change) | ✅ | Phase 2.2 CreditsCounter, PriceBreakdownCard | — |
| Availability shimmer while loading cleaners | ✅ | Phase 2.1 AvailabilityGrid, AvailabilitySlot, RecommendedTag | — |
| Smart defaults highlight (glow around recommended cleaner/time) | ✅ | Phase 2.1 Booking | — |
| Cleaner selection Wallet-style (expand on hover, reliability + badges) | ✅ | Phase 2.3 CleanerSelectCard, ReliabilityRingSmall, BadgeRow | — |
| Confirmation screen (Booked, Cleaner notified, Credits held; sequential checkmarks) | ✅ | Phase 2.4 BookingConfirmation, AnimatedCheckRow | — |

---

## JOB DETAILS / TRACKING

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Timeline rail: active node pulses, completed nodes fade, status changes animate | ✅ | Phase 2.5 Job Details timeline rail refinement | — |
| Reliability ring: number counts up from 0, ring draws itself | ✅ | Phase 2.5 addendum (optional count-up + ring draw) | — |
| Ledger flow: curved particles, ease-in/out, cluster at endpoints | ✅ | Phase 2.7 LedgerFlowV2 | — |
| Presence: en-route motion path, arrived radius glow, checked-in perimeter | ✅ | Phase 3 RoutePolyline, ArrivalRadiusGlow; PresenceMapCard | — |
| Photo proof: before/after slider (not just static grid) | ✅ | Phase 2.6 ProofGalleryV2, BeforeAfterCompare | — |
| GET /jobs/:jobId/details bundling | ✅ | Already used; runbook 2.0 | — |

---

## CLEANER PROFILES

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Card expand motion (Apple Wallet: scale + elevate, background blur) | ✅ | Phase 2.9 Cleaner profiles | — |
| Stats reveal (reliability, rating, jobs completed fade in sequentially) | ✅ | Phase 2.9 Cleaner profiles | — |
| Recent jobs preview (mini gallery with swipe) | ✅ | Phase 2.9 Cleaner profiles | — |

---

## PAYMENTS / WALLET

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Balance animation (credits count up when page opens) | ✅ | Phase 2.10 Payments / wallet | — |
| Transaction rows (slide in one-by-one) | ✅ | Phase 2.10 Payments / wallet | — |
| Payment success state (full-screen: ✔ Job secured, ✔ Cleaner notified, ✔ Credits held) | ✅ | Phase 2.4 BookingConfirmation; Phase 2.10 for payment-specific success screen | — |

---

## SETTINGS / ACCOUNT

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Save feedback (subtle green toast, checkmark draw animation) | ✅ | Phase 1.7 Settings | — |
| Toggles (spring snap, not instant) | ✅ | Phase 1.7 Settings | — |

---

## ADMIN (if applicable)

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Table row hover states (highlight row + action icons appear) | ✅ | Phase 1.8 Admin | — |
| Bulk actions (animated selection counters) | ✅ | Phase 1.8 Admin | — |

---

## PSYCHOLOGICAL LAYER (UX, not only visual)

| Item | In runbook? | Where | Gap? |
|------|-------------|--------|------|
| Predictive UI (e.g. "Cleaner arriving in ~7 min", "You'll probably want to book again next week") | ✅ | Phase 2.11 Psychological | — |
| Trust reinforcement (every page: at least one reliability metric, proof image, or process indicator) | ✅ | Phase 2.11; audit every primary page and add one trust element where missing | — |
| Calm pacing (no sudden jumps; everything flows) | ✅ | Implicit in motion tokens, page transition, stagger | — |

---

## Summary: what was missing and where it's now documented

- **Runbook addenda** (below) add:
  - **Phase 1.3** — MapPlaceholderSkeleton, LedgerSkeleton.
  - **Phase 1.4** — Dashboard: status pill color transition, Quick Action Panel; job/cleaner cards: shadow deepen on hover, reveal secondary actions.
  - **Phase 1.6** — Landing: scroll-triggered reveals, Trust Proof Strip (optional).
  - **Phase 1.7** — Settings: save feedback, spring toggles.
  - **Phase 1.8** — Admin: table row hover, bulk action counters.
  - **Phase 2.1** — Booking: AvailabilityGrid/shimmer, RecommendedTag, smart-defaults glow.
  - **Phase 2.5** — Job Details: Reliability Ring count-up + ring draw (optional).
  - **Phase 2.8** — Auth/Onboarding: progressive disclosure, step cards, input validation animation, progress bar.
  - **Phase 2.9** — Cleaner profiles: card expand, stats reveal, recent jobs mini gallery.
  - **Phase 2.10** — Payments/wallet: balance count-up, transaction row stagger, payment success state.
  - **Phase 2.11** — Psychological: predictive UI hints, trust reinforcement on every page.

All of the above are now referenced in this checklist and added as runbook addenda so the **entire app** and **each page** are covered.
