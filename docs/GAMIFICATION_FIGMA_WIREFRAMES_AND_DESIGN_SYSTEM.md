# Gamification — Figma Wireframes & Design System

This doc combines: **concrete sitemap**, **shared component inventory**, **wireframe-level layouts** for every gamification screen, **Figma-ready specs** (frames, auto-layout, spacing, variants), and a **step-by-step Figma how-to**. Use it for design (Figma) and to align implementation (Next.js + Tailwind).

**Related:** [GAMIFICATION_UI_SPEC.md](./GAMIFICATION_UI_SPEC.md) (UI spec), [GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md](./GAMIFICATION_BACKEND_IMPLEMENTATION_GUIDE.md) (backend API).

---

## 1) Concrete Sitemap

Assume role-gated screens; show/hide nav by role (client, cleaner, admin).

### Global

| Path | Description |
|------|-------------|
| `/` | Landing / role router (auto-redirect by auth + role) |
| `/auth/login` | Login |
| `/auth/signup` | Sign up |
| `/auth/forgot-password` | Forgot password |
| `/settings` | Settings |
| `/notifications` | Notifications |
| `/support` | Support |
| `/legal/terms` | Terms |
| `/legal/privacy` | Privacy |

### Client (Customer)

| Path | Description |
|------|-------------|
| `/client/home` | Client home |
| `/client/search` | Browse cleaners |
| `/client/cleaner/:cleanerId` | Cleaner profile (include Level + badges trust signals) |
| `/client/booking/new` | New booking |
| `/client/bookings` | Bookings list |
| `/client/bookings/:bookingId` | Booking detail |
| `/client/reviews` | Your submitted reviews |
| `/client/payments` | Methods, invoices/receipts |
| `/client/messages` | Messages |
| `/client/messages/:threadId` | Thread |

### Cleaner

| Path | Description |
|------|-------------|
| `/cleaner/home` | Cleaner home |
| `/cleaner/jobs` | Jobs list |
| `/cleaner/jobs/:jobId` | Job detail (with gamification hooks) |
| `/cleaner/messages` | Messages |
| `/cleaner/messages/:threadId` | Thread |
| `/cleaner/availability` | Availability |
| `/cleaner/progress` | **Gamification Hub** |
| `/cleaner/progress/level/:levelNumber` | Level detail |
| `/cleaner/goals` | Goals list |
| `/cleaner/goals/:goalId` | Goal detail |
| `/cleaner/rewards` | Rewards center |
| `/cleaner/rewards/:rewardId` | Reward detail (optional) |
| `/cleaner/badges` | Badges |
| `/cleaner/maintenance` | Maintenance + paused progress |
| `/cleaner/stats` | My Stats |
| `/cleaner/profile` | Profile |
| `/cleaner/payouts` | Earnings, payout history |

### Admin

| Path | Description |
|------|-------------|
| `/admin/home` | Admin home |
| `/admin/gamification` | **Gamification overview** |
| `/admin/gamification/goals` | Goals library |
| `/admin/gamification/goals/:goalId` | Edit/preview goal |
| `/admin/gamification/rewards` | Rewards manager |
| `/admin/gamification/rewards/:rewardId` | Edit reward |
| `/admin/gamification/choices` | Choice groups |
| `/admin/gamification/flags` | Feature flags / kill switches |
| `/admin/gamification/governor` | Governor console |
| `/admin/gamification/abuse` | Fraud/abuse monitor |
| `/admin/support/cleaner/:cleanerId/gamification` | Support debug view |
| `/admin/audit` | Global audit log |
| `/admin/users` | Manage accounts |

---

## 2) Shared Component List (Build Once, Use Everywhere)

### Layout & Navigation

- **AppShell** — Top bar + left nav + content.
- **RoleAwareNav** — Shows Client / Cleaner / Admin sections by role.
- **Breadcrumbs**
- **PageHeader** — Title + subtitle + actions.
- **Tabs**
- **SidePanel / Drawer**
- **Modal**

### Gamification UI

- **LevelBadge** — Level # + label.
- **LevelProgressRing** — Big circular progress.
- **ProgressBar**
- **GoalCard**
- **GoalChecklist** — Core goals list UI.
- **StretchGoalPicker** — Choose-one selector.
- **MaintenanceStatusCard**
- **RewardCard**
- **RewardEffectPill** — e.g. “Visibility +15%”.
- **CountdownPill** — Time remaining.
- **ChoiceRewardModal** — Pick 1 reward.
- **MetricExplainerModal** — “What counts”.
- **PausedProgressBanner** — “Paused because X” + fix steps.
- **NextBestActionCard** — Deep link CTA.
- **BadgeGrid**
- **BadgeCard**
- **AchievementToast** — Earned reward/badge.

### Admin Controls

- **DataTable** — Sortable/filterable.
- **ConfigVersionPicker** — Active version + rollback.
- **EditForm** — JSON-backed schema form.
- **DiffViewer** — Before/after config.
- **ToggleSwitch**
- **BudgetMeter** — Cash burn cap.
- **RegionSelector**
- **GovernorTuningPanel**
- **AuditLogViewer**

### Job + Messaging Hooks

- **QuickTemplatePicker**
- **JobChecklist** — Clock-in, photos, message.
- **PhotoUploader**
- **ClockInBanner** — ±15 min.
- **SafetyReportModal** — Optional photo.

---

## 3) Wireframe-Level Layouts (Header / Main / Sidebar / CTAs)

### CLEANER SCREENS

**A) /cleaner/progress — Progress Hub**

- **Header:** “Your Progress” | LevelBadge + “Level X — Label” | “How visibility works” link.
- **Main (top):** Progress ring “X% to Level Y”, Core completion meter, Stretch selected/not, Maintenance ✅/⚠️.
- **Main (middle):** Next Best Actions (1–2 cards), “Do this next → unlock X”.
- **Main (bottom):** Active Rewards carousel, Recent Achievements (badges).
- **CTAs:** View Level Details, View Goals, View Rewards.

**B) /cleaner/progress/level/:levelNumber — Level Detail**

- **Header:** “Level 4”, Reward summary.
- **Main:** Section 1 Core goals checklist | Section 2 Stretch (choose ≥1) | Section 3 Maintenance. **Right panel:** Reward preview, “Counts when…”.
- **CTAs:** Select Stretch Goal, View Rewards, Take Next Action.

**C) /cleaner/goals — Goals List**

- **Header:** Filters (Level, Type: Core/Stretch/Maintenance, “Almost complete”).
- **Main:** List of GoalCards (title, progress e.g. 12/30, reward preview, “Counts when…”).
- **CTAs per card:** View Details, Take Action.

**D) /cleaner/goals/:goalId — Goal Detail**

- **Header:** Goal title + progress.
- **Main:** Requirements block, Progress block (bar + numbers), Window (if any), What counts / doesn’t, Reward details.
- **CTAs:** Do Next Step (contextual), View Reward Preview.

**E) /cleaner/rewards — Rewards Center**

- **Header:** Tabs: Active / Earned / Locked / Choice.
- **Main (Active):** RewardCards with countdown + “applies to”. **Choice tab:** If pending, ChoiceRewardModal inline (“you must choose one”).
- **CTAs:** Select Reward (if choice pending), See Eligible Jobs.

**F) /cleaner/badges — Badges**

- **Header:** Tabs: Core / Fun / All.
- **Main:** BadgeGrid: icon, name, earned/unearned, “how to earn”.
- **CTAs:** Pin to profile (core), Share (optional).

**G) /cleaner/maintenance — Maintenance**

- **Header:** “Maintenance”, Status: ✅ All good or ⚠️ Progress paused.
- **Main:** Cards: On-time rate, Disputes (window), Acceptance rate (good faith), Photo compliance. If paused: reason + “how to fix”.
- **CTAs:** View my stats, Contact support, See calculation.

**H) /cleaner/stats — My Stats**

- **Header:** “Your Stats”, date range (14/30/60 days).
- **Main:** Metric tiles (on-time, rating, acceptance, disputes, add-ons), trend, “How it’s calculated” per tile.

**I) /cleaner/jobs/:jobId — Job hooks**

- **Top banner:** “Clock-in window opens in X minutes”, “This job helps: [Goal A] [Goal B]”.
- **Checklist card:** Clock in/out, Send update (template), Upload before + after (1 each).
- **CTAs:** Clock In, Upload Photos, Send Update, Report Safety Concern.

### ADMIN SCREENS

**J) /admin/gamification — Overview**

- **Header:** “Gamification Overview”, optional region filter.
- **Main:** Level distribution chart, Time-to-level, Disputes by level, Cash burn + cap, Governor status.
- **CTAs:** Disable cash rewards, Open governor, View audit.

**K) /admin/gamification/goals — Goals Library**

- **Header:** Search + filters (level/type/enabled).
- **Main:** DataTable: goalId, title, level, type, target, enabled, updated_at; row click → edit. **Side panel:** Preview as cleaner, Versions.
- **CTAs:** Create goal, Duplicate, Publish version, Rollback.

**L) /admin/gamification/rewards — Rewards Manager**

- **Main:** DataTable: rewardId, kind, duration, stacking, permanent/temporary, enabled.
- **CTAs:** Create reward, Disable, Set budget rules.

**M) /admin/gamification/choices — Choice Groups**

- **Main:** List of choice groups; open detail: options + eligibility + expiry.
- **CTAs:** Create group, Add option.

**N) /admin/gamification/flags — Feature Flags**

- **Main:** Toggle list (gamification_enabled, cash_enabled, governor_enabled, etc.), per-region overrides.
- **CTAs:** Enable for region, Disable globally, Schedule window.

**O) /admin/gamification/governor — Governor Console**

- **Header:** Region selector.
- **Main:** Inputs (supply/demand, fill time, cancel, dispute); outputs (multipliers, early exposure, caps); recommended changes panel.
- **CTAs:** Apply recommended, Manual override, Reset overrides, Lock region.

**P) /admin/gamification/abuse — Abuse Monitor**

- **Main:** Tabs (logins/messages/photos/declines), suspicious patterns table, “open case” drawer.
- **CTAs:** Pause rewards, Require review, Disable templates for cleaner (optional).

**Q) /admin/support/cleaner/:id/gamification — Support Debug**

- **Main:** Current level, goal progress raw metrics, reward grants history, why paused, recompute button.
- **CTAs:** Recompute now, Grant reward manually (guarded), Remove reward (guarded), Copy support explanation.

### CLIENT

**R) /client/cleaner/:cleanerId — Cleaner profile**

- Add badge area: “Level X” + “Top badges” + “What this means” (trust signals only; no internal scoring).

---

## 4) Figma-Ready Specs

### Global Design System (set up first in Figma)

**Frame sizes**

- Desktop: **1440 × 1024**
- Tablet (optional): 1024 × 900
- Mobile (optional): 390 × 844

**Grid**

- 12-column layout
- 80px side margins
- 24px gutters
- **8pt spacing system:** 4, 8, 12, 16, 24, 32, 48, 64

**Color tokens (Figma styles)**

- Primary / 600, Primary / 500
- Success / 500, Warning / 500, Error / 500
- Neutral / 900, 700, 500, 300, 100
- Surface / Card, Surface / App

**Typography**

- H1 — 32px / 600  
- H2 — 24px / 600  
- H3 — 18px / 600  
- Body — 16px / 400  
- Small — 14px / 400  
- Caption — 12px / 400  

### App Shell (reusable layout)

- **Frame:** AppShell / Desktop — 1440 × 1024, Auto-layout: Horizontal.
- **Left Sidebar:** 240px fixed; Vertical auto-layout; Padding 24, Spacing 16.  
  - Logo (32px height).  
  - Nav (role-aware): Cleaner → Home, Jobs, Messages, Availability, Progress, Rewards, Badges, Stats, Maintenance, Payouts. Admin → Dashboard, Gamification, Goals, Rewards, Governor, Flags, Abuse, Audit.  
  - Each nav item: 40px height, left icon 20px, label; states: default, hover, active (primary tint).
- **Main content:** Auto-layout Vertical; Padding 48; Spacing 32; Background Surface/App.

### Cleaner — Progress Hub (/cleaner/progress)

- **LevelSummaryCard:** Fill container, padding 32, radius 16, soft shadow.  
  - Left: LevelBadge (large), “Level 4 — Trusted Pro”, “63% to Level 5”.  
  - Right: Circular progress 160×160, “63%” inside.
- **Next Best Actions:** H2 “Next Best Actions”. Horizontal auto-layout, spacing 24.  
  - **NextActionCard:** 360px wide, padding 24; title, short body, primary button. Example: “Complete 3 more add-ons” / “Unlock Priority Visibility for 7 days” / “See Eligible Jobs”.
- **Active Rewards:** H2 “Active Rewards”. Horizontal scroll.  
  - **RewardCard:** 300px wide, padding 24; title, effect line, countdown pill, “View Details”.
- **Recent Achievements:** Grid of BadgeCard (e.g. 100×120).

### Goals List (/cleaner/goals)

- Top: Page title, filters (Level dropdown, Type, “Almost complete”), search.
- **GoalCard:** Fill width, padding 24, radius 16.  
  - Row 1: Title, reward preview pill (right).  
  - Row 2: ProgressBar 8px, “27 / 45”.  
  - Row 3: “Counts when…” caption.  
  - Row 4: View Details (secondary), Take Action (primary).  
  - **Variants:** Complete, Locked, Almost complete, Maintenance.

### Rewards Center (/cleaner/rewards)

- **Tabs:** Active | Earned | Locked | Choice.
- **Active:** 2-column grid, gap 24. RewardCard expanded: title, description, applies to, time left, usage (if any), “Use Now” (if type=uses).
- **Choice (pending):** Centered card: “Choose Your Reward”, list of options (radio), “Confirm Selection”.

### Badges (/cleaner/badges)

- Grid 4 columns, gap 24.
- **BadgeCard:** 80×80 icon, title, earned date, “how to earn”. **Variants:** Earned, Locked, Featured.

### Maintenance (/cleaner/maintenance)

- **Banner:** Variant Healthy (green) or Paused (warning). Paused: “Progress Paused”, “On-time rate below 85%”, “See How to Fix”.
- **Metric cards grid:** Title, big stat, trend arrow, mini explanation, “How calculated” link.

### Stats (/cleaner/stats)

- Grid 3 columns. Metric tiles: large number, subtext, trend. (On-time %, Acceptance %, Disputes, Add-ons, Rating, Photo compliance.)

### Admin — Gamification Overview (/admin/gamification)

- H1 “Gamification Overview”. Row 1: 3 KPI cards (Level distribution, Median time to level, Reward burn). Row 2: Chart (e.g. supply vs demand). Row 3: Governor status card. Right: Kill switch panel (Disable cash rewards, Disable globally).

### Admin — Goals Library (/admin/gamification/goals)

- DataTable columns: ID, Title, Level, Type, Target, Enabled, Updated. Row click → side drawer: Edit panel (title, metric key, operator, target, window, filters JSON, reward binding). Buttons: Save Draft, Publish, Rollback.

### Admin — Governor (/admin/gamification/governor)

- Two columns: Left — inputs (fill time, supply ratio, disputes, cancellations). Right — outputs (visibility multiplier, early exposure, caps, overrides). Buttons: Apply recommended, Manual override, Reset region.

### Admin — Abuse (/admin/gamification/abuse)

- Tabs: Messages, Login sessions, Declines, Photos. Data table: Cleaner ID, Pattern, Risk score, Action. Side panel: Pause rewards, Require review.

### Component variants to create in Figma

- **Button:** Primary | Secondary | Danger | Disabled  
- **Badge:** Earned | Locked  
- **LevelBadge:** Level 1–10 color variants  
- **RewardCard:** Active | Locked | Choice  
- **GoalCard:** Core | Stretch | Maintenance | Complete  
- **MetricCard:** Healthy | Warning | Critical  
- **Banner:** Healthy | Paused  
- **Toggle:** On | Off  
- **NavItem:** Default | Hover | Active  

### Responsive rules

- Sidebar → icon-only when narrow.
- Goal cards → single column.
- Level summary → stack vertically.
- Reward cards → vertical scroll.

---

## 5) Step-by-Step Figma How-To

### 1) Base layout (App Shell)

1. **Frame:** Press **F** → choose Desktop 1440px. Name: **AppShell / Desktop**.
2. **Grid:** Select frame → Right panel → **Layout Grid** → **+** → Type **Columns** → Count **12**, Margin **80**, Gutter **24**.
3. **Sidebar + main:** Select frame → **Shift + A** (Auto Layout) → Direction **Horizontal**.
4. **Sidebar:** **R** (rectangle) 240px wide → name **Sidebar** → width 240, height **Fill container** → **Shift + A** → Vertical, Padding 24, Spacing 16. Add logo + nav items.
5. **Main:** Another rectangle → **Fill container** → Auto Layout Vertical, Padding 48, Spacing 32. Background: Surface/App.

### 2) Reusable components

1. Draw button (e.g. height 44px) + text.
2. Select both → **Shift + A** → Padding 16 L/R, corner radius 8, background.
3. **Cmd/Ctrl + Alt + K** → turn into Component. Name: **Button / Primary**.
4. Add **Variants:** Primary, Secondary, Danger, Disabled (use **+ Variant** and property panel).

### 3) GoalCard

1. Frame ~600px wide. Add: title, progress bar, description, button row.
2. Select all → **Shift + A** → Vertical, Padding 24, Spacing 16, Radius 16, Fill white, shadow.
3. **Cmd/Ctrl + Alt + K** → **GoalCard**. Add variants: Core, Stretch, Maintenance, Completed, Locked.

### 4) Tabs

1. Horizontal frame with 4 text labels → **Shift + A** → Spacing 32. Add underline under active tab.
2. Component **Tabs / Default** with variants for active tab index 1, 2, etc.

### 5) Circular progress (LevelProgressRing)

1. Draw circle → duplicate → change stroke; use **Arc** in right panel to set angle for %.
2. Inside: text “63%”, “To Level 5”. Group → Component **LevelProgressRing**.

### 6) Spacing rules

- Always Auto Layout; padding/spacing in multiples of 8; radius 8 or 16; avoid manual positioning.

### 7) Admin table

1. Frame with header row (Auto Layout horizontal) + data rows.
2. Make **DataTable / Row** component with variants: Normal, Hover, Selected.

### 8) Design system page

- New page **Design System**. Sections: Buttons, Cards, Typography, Colors, Badges, GoalCard, RewardCard, NavItem, MetricCard.

### 9) Prototype (clickable)

- **Prototype** tab → select button → drag blue node to target frame → On Click → Navigate to → Smart Animate.

### Concepts

- **Auto Layout** = Flexbox.
- **Variants** = Component states.
- **Frame** = Page container.
- **Hug contents** = dynamic size; **Fill container** = flexible size.

---

## Pipeline options

- **Figma only:** Use this doc + frames above to build screens and components.
- **Figma → Dev handoff:** Export specs; map components to `src/components/` (see [GAMIFICATION_UI_SPEC.md](./GAMIFICATION_UI_SPEC.md)).
- **Figma → Tailwind / shadcn:** Map spacing to Tailwind (4, 8, 12 → p-1, p-2, p-3); use design tokens for colors; map components to shadcn + custom gamification components.

If you want **Tailwind class mapping** or **component JSON spec** for tokens, that can be added as a follow-up section to this doc.
