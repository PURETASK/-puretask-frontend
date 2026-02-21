# Gamification UI/UX — Status vs Docs

This document answers: **Have we built UI/UX to fit the gamification docs?**  
Reference: [GAMIFICATION_UI_SPEC.md](./GAMIFICATION_UI_SPEC.md), [GAMIFICATION_FIGMA_WIREFRAMES_AND_DESIGN_SYSTEM.md](./GAMIFICATION_FIGMA_WIREFRAMES_AND_DESIGN_SYSTEM.md).

---

## Summary

**Yes, in large part.** Routes exist, core shared components exist, and key screens (Progress Hub, goals list, rewards, maintenance, job hooks, admin goals/rewards/governor/abuse/flags, client profile badges) match the wireframe intent. **Gaps:** some shared components are still missing, several pages use placeholder/stub content until the backend is wired, and layout/spacing is Tailwind-based (not the exact 8pt/80px Figma spec).

---

## 1. Routes (sitemap)

| Route | Implemented | Notes |
|-------|-------------|--------|
| **Cleaner** | | |
| `/cleaner/progress` | ✅ | Full hub: LevelBadge, ring, core/stretch/maintenance, Next Best Actions, Active Rewards, CTAs |
| `/cleaner/progress/level/:levelNumber` | ✅ | Page exists; content is placeholder (core/stretch/maintenance sections) |
| `/cleaner/goals` | ✅ | List with GoalCard; filters placeholder |
| `/cleaner/goals/:goalId` | ✅ | Detail page; structure in place, data placeholder |
| `/cleaner/rewards` | ✅ | Tabs Active/Earned/Locked/Choice, RewardCard |
| `/cleaner/rewards/:rewardId` | ❌ | Optional; not added |
| `/cleaner/badges` | ✅ | Tabs Core/Fun/All, grid of cards; placeholder badges |
| `/cleaner/maintenance` | ✅ | Status + metric cards; PausedProgressBanner when paused |
| `/cleaner/stats` | ✅ | Metric tiles + “How it’s calculated”; values placeholder |
| `/cleaner/jobs/:jobId` | ✅ | Clock-in banner, “This job helps” tags, checklist, CTAs |
| **Client** | | |
| `/cleaner/[id]` (public profile) | ✅ | Level + badges block when API returns them; “What this means” |
| **Admin** | | |
| `/admin/gamification` | ✅ | Overview with links to sub-pages |
| `/admin/gamification/goals` | ✅ | DataTable, Create/Duplicate/Rollback, row click → preview |
| `/admin/gamification/goals/:goalId` | ✅ | Edit form + Preview as cleaner, Rollback |
| `/admin/gamification/rewards` | ✅ | DataTable + placeholder/API data |
| `/admin/gamification/rewards/:rewardId` | ✅ | Edit form (name, kind, duration, usage, stacking, permanent, enabled) |
| `/admin/gamification/choices` | ✅ | Stub page (list + CTAs) |
| `/admin/gamification/flags` | ✅ | Toggles + Save, Enable region, Disable globally, Schedule |
| `/admin/gamification/governor` | ✅ | DataTable of regions + actions |
| `/admin/gamification/abuse` | ✅ | Tabs, DataTable, row actions (Pause rewards, etc.) |
| `/admin/support/cleaner/:cleanerId/gamification` | ✅ | Stub page; copy describes intended content |

---

## 2. Shared components (build once, use everywhere)

| Component | Implemented | Location / notes |
|-----------|-------------|------------------|
| LevelBadge | ✅ | `@/components/gamification/LevelBadge` |
| LevelProgressRing | ✅ | `@/components/gamification/LevelProgressRing` |
| ProgressBar | ✅ | `@/components/ui/Progress` (existing) |
| GoalCard | ✅ | `@/components/gamification/GoalCard` |
| RewardCard | ✅ | `@/components/gamification/RewardCard` |
| CountdownPill | ✅ | `@/components/gamification/CountdownPill` |
| PausedProgressBanner | ✅ | `@/components/gamification/PausedProgressBanner` |
| NextBestActionCard | ✅ | `@/components/gamification/NextBestActionCard` |
| MetricExplainerModal | ✅ | `@/components/gamification/MetricExplainerModal` |
| QuickTemplatePicker | ✅ | `@/components/gamification/QuickTemplatePicker` (chat + job flow) |
| **GoalChecklist** | ✅ | `@/components/gamification/GoalChecklist` (cards or compact) |
| **StretchGoalPicker** | ✅ | `@/components/gamification/StretchGoalPicker` |
| **RewardEffectPill** | ✅ | `@/components/gamification/RewardEffectPill` |
| **ChoiceRewardModal** | ✅ | `@/components/gamification/ChoiceRewardModal` |
| **BadgeGrid** | ✅ | `@/components/gamification/BadgeGrid` |
| **BadgeCard** | ✅ | `@/components/gamification/BadgeCard` |
| **AchievementToast** | ✅ | `@/components/gamification/AchievementToast` (use with toast context) |
| **MaintenanceStatusCard** | ⚠️ | PausedProgressBanner covers “paused”; no separate card component |
| **DataTable** | ✅ | `@/components/ui/DataTable` (admin) |
| **Toggle** | ✅ | `@/components/ui/Toggle` (admin flags) |

Layout/nav (AppShell, RoleAwareNav, Breadcrumbs, PageHeader, Tabs, Modal) use existing layout and UI; not gamification-specific.

---

## 3. Wireframe layout alignment

| Screen | Header / Main / CTAs | Match |
|--------|----------------------|--------|
| **Progress Hub** | Your Progress, LevelBadge, “How visibility works” \| Ring, core/stretch/maintenance \| Next Best Actions, Active Rewards \| View Level Details, Goals, Rewards | ✅ Yes |
| **Level detail** | Level N, reward summary \| Core checklist, Stretch, Maintenance \| Select Stretch, View Rewards, Take Action | ⚠️ Structure yes; copy/API placeholder |
| **Goals list** | Filters \| GoalCards with progress, “Counts when” \| View Details, Take Action | ✅ Yes |
| **Goal detail** | Title + progress \| Requirement, progress bar, window, what counts, reward \| Do Next Step, View Reward Preview | ⚠️ Structure yes; data placeholder |
| **Rewards** | Tabs Active/Earned/Locked/Choice \| RewardCards \| Select Reward, See Eligible Jobs | ✅ Yes |
| **Badges** | Tabs Core/Fun/All \| Grid of badge cards \| Pin, Share | ✅ Uses BadgeGrid + BadgeCard |
| **Maintenance** | Status \| Metric cards, paused reason + fix \| View stats, Contact support | ✅ Yes |
| **Stats** | Your Stats, date range \| Metric tiles, “How calculated” | ✅ Yes |
| **Job hooks** | Clock-in banner, “This job helps” \| Checklist \| Clock In, Upload Photos, Send Update, Report Safety | ✅ Yes |
| **Admin goals** | Search + filters \| DataTable \| Create, Duplicate, Rollback | ✅ Yes |
| **Admin rewards** | \| DataTable \| Create, Attach, Budget cap | ✅ Yes |
| **Admin governor** | Region \| Table (inputs/outputs) \| Apply, Override, Reset, Lock | ✅ Yes |
| **Admin abuse** | Tabs \| DataTable \| Pause, Require review, Open case | ✅ Yes |
| **Admin flags** | \| Toggles \| Save, Enable region, Disable globally, Schedule | ✅ Yes |
| **Support debug** | \| Level, progress, history, why paused \| Recompute, Grant, Remove, Copy | ✅ Full UI (uses API or placeholder data) |
| **Client profile** | Level + top badges + “What this means” | ✅ Yes |

---

## 4. Design system (Figma doc vs code)

| Doc spec | In code |
|----------|--------|
| Frame 1440×1024, 12-col, 80px margin, 24px gutter | Max-width containers (e.g. `max-w-7xl`), Tailwind grid; no explicit 80px/24px |
| 8pt spacing (4,8,12,16,24,32,48,64) | Tailwind spacing (p-2, p-4, gap-4, etc.) — similar but not identical |
| Color tokens (Primary 600/500, Success, Warning, Error, Neutral, Surface) | Tailwind/shadcn-style classes (e.g. `blue-600`, `green-600`, `gray-50`) |
| H1 32px/600, H2 24px/600, etc. | `text-3xl font-bold`, `text-2xl font-semibold`, etc. |
| App shell: 240px sidebar + main | Current app uses Header + main; no 240px sidebar in gamification pages |
| Component variants (Button Primary/Secondary/Danger, GoalCard Core/Stretch/Maintenance) | Some (e.g. LevelBadge level colors); GoalCard/RewardCard not split into Figma-style variants everywhere |

So: **layout and structure match the wireframes; exact Figma dimensions and tokens are not implemented** — we use standard Tailwind/conventions instead.

---

## 5. What’s still missing to “fully” fit the docs

1. ~~**Components:** GoalChecklist, StretchGoalPicker, ChoiceRewardModal, RewardEffectPill, BadgeGrid, BadgeCard, AchievementToast.~~ **Done.**
2. ~~**Pages:** Admin goal/reward edit routes.~~ **Done.** Optional `/cleaner/rewards/:rewardId` not added.
3. ~~**Support debug:** Full UI.~~ **Done.** (Uses API or placeholder.)
4. **Data:** Many screens use placeholder or local state; they’ll fully match the docs when backend endpoints (from [GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md](./GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md)) are implemented and wired.
5. **Empty / edge states:** Empty goals list, no active rewards, first-time user — designed in wireframes but not all implemented.
6. **Strict design system:** Optional: align Tailwind with 8pt scale and Figma tokens if you want pixel-perfect match.

---

## 6. Conclusion

We **have** created UI and UX that fit the documents: all main routes exist, core gamification components are in place, and the main screens follow the wireframe layouts. To fully match the docs, wire real data from the backend and optionally refine empty states and design tokens. Components and admin edit routes and support debug UI are implemented.
