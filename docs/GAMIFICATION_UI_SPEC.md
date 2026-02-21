# Gamification UI – Full Spec

**Purpose:** Single source of truth for Cleaner gamification hub, Admin gamification tools, shared components, sitemap, and wireframes.

---

## A) Cleaner App UI (what cleaners see)

### 1) Cleaner "Progress" Home (Gamification Hub)

- **Route:** `/cleaner/progress` (or tab in Cleaner profile)
- **Shows:** Current Level (1–10) + label, progress to next level, Core completion %, Stretch selected, Maintenance status, Active rewards, Next Best Action (1–2), Earnings impact preview
- **Buttons:** View Goals, View Rewards, View Badges, View Maintenance Status, Take Next Action, See How Visibility Works (modal)

### 2) Level Detail Page

- **Route:** `/cleaner/progress/level/:levelNumber`
- **Shows:** Core goals checklist, Stretch goals (choose ≥1), Maintenance rules, Locked next-level preview
- **Buttons:** Select Stretch Goal, View Reward Preview, Learn How This Is Measured

### 3) Goals List

- **Route:** `/cleaner/goals`
- **Filters:** Core / Stretch / Maintenance, Level, "Almost complete", "Highest reward"
- **Goal Card:** Title, progress bar, "Counts when…", Reward preview
- **Buttons:** View Details, Take Action, Select Reward (if choice)

### 4) Goal Detail Page

- **Route:** `/cleaner/goals/:goalId`
- **Shows:** Exact requirement, current progress, time window, what counts / doesn’t count, reward explanation
- **Buttons:** Do Next Step, Message a Client, Update Availability, See Examples

### 5) Rewards Center

- **Route:** `/cleaner/rewards`
- **Tabs:** Active, Earned, Locked, Choice rewards (pending selection)
- **Reward Card:** Name, effect, where it applies, start/end date, usage count
- **Buttons:** Use Now, Select This Reward, View How It Works, See Eligible Jobs

### 6) Badges & Achievements

- **Route:** `/cleaner/badges`
- **Shows:** Core badges (profile-visible), Fun/personality badges, Recently earned
- **Buttons:** Share Badge, Pin to Profile, See How To Earn

### 7) Maintenance Status

- **Route:** `/cleaner/maintenance`
- **Shows:** Maintenance checklist (on-time %, disputes, acceptance fairness), "Progress paused because X", Recovery steps
- **Buttons:** See What Counts, Contact Support, View Dispute History, View My Stats

### 8) "My Stats" Dashboard

- **Route:** `/cleaner/stats`
- **Shows:** On-time rate, Acceptance rate, Photo compliance, Avg rating, Disputes (opened/lost), Add-on completion count
- **Buttons:** How is this calculated?, Improve this metric

### 9) Messaging Templates (Quick Actions)

- **Where:** Chat composer, job screen "Send update"
- **Templates:** Thank you, Reschedule?, Request review, On my way / Arrived / Starting / Finished, etc.
- **Buttons:** Insert Template, Customize, Send

### 10) Job Screen Gamification Hooks

- **Where:** Job details screen
- **Shows:** "This job helps your goals" tag, before/after photo checklist, "Clock-in window starts in 15 min" banner
- **Buttons:** Clock In, Upload Photos, Send Update, Report Safety Concern

---

## B) Admin App UI

### 1) Gamification Overview Dashboard — `/admin/gamification`

- **Widgets:** Level distribution, Time-to-level, Reward burn + caps, Disputes by level, Governor status, Flag status
- **Buttons:** Disable cash rewards, Disable reward type, Export audit log, Open Governor Console

### 2) Goals Library — `/admin/gamification/goals`

- **Actions:** Create/edit goals, Enable/disable, Move levels (versioned), Adjust targets/windows, Bind reward(s)
- **Fields:** id, title, description, level, type, metricKey, operator, target, window, filters JSON, enabled, effective_at, version
- **Buttons:** Create, Duplicate, Publish version, Rollback, Preview as Cleaner

### 3) Rewards Manager — `/admin/gamification/rewards`

- **Actions:** Edit definitions, Set durations/uses, Stacking rules, Permanent vs temporary, Assign to levels/goals, Budget classification
- **Buttons:** Create reward, Attach to goal, Set budget cap, Disable reward

### 4) Choice Reward Groups — `/admin/gamification/choices`

- **Actions:** Define "choose 1 of these", Eligibility window, Expiration rules
- **Buttons:** Create choice group, Add option, Set expiry, View selections

### 5) Feature Flags & Kill Switches — `/admin/gamification/flags`

- **Toggles:** gamification_enabled, rewards_enabled, cash_rewards_enabled, seasonal_enabled, governor_enabled
- **Buttons:** Enable in region, Disable globally, Schedule enable window

### 6) Marketplace Health Governor — `/admin/gamification/governor`

- **Shows:** Supply/demand per region, Fill time, cancellations, disputes, Multipliers and caps
- **Buttons:** Apply recommended, Manual override, Lock region, Reset overrides, History

### 7) Fraud / Abuse Monitor — `/admin/gamification/abuse`

- **Shows:** Spam patterns, login farming, photo timestamp violations, decline abuse
- **Buttons:** Pause rewards for cleaner, Require review, Disable templates, Open case

### 8) Support Tools — `/admin/support/cleaner/:id/gamification`

- **Shows:** Goal progress values, why progress paused, reward grant history, computed metrics debug
- **Buttons:** Recompute now, Grant reward manually (guarded), Remove reward (guarded), Copy explanation

---

## C) Shared UI Components (build once, reuse)

| Component | Purpose |
|-----------|--------|
| LevelBadge | Level number + label + color |
| ProgressBar | numerator/denominator (exists) |
| GoalCard | Title, progress, "counts when", reward preview |
| RewardCard | Effect, duration, applies-to |
| CountdownPill | Days remaining |
| MaintenanceBanner | "Paused because X" |
| MetricExplainerModal | Plain-English metric definitions |
| ChoiceSelectorModal | Choose 1 reward |
| Toast/Confetti | Reward earned / badge micro-animation |

---

## Sitemap (concrete routes)

### Global

- `/` — Landing / role router
- `/auth/login`, `/auth/signup`, `/auth/forgot-password`
- `/settings`, `/notifications`, `/support`
- `/legal/terms`, `/legal/privacy`

### Client

- `/client/home`, `/client/search`, `/client/cleaner/:cleanerId`, `/client/booking/new`
- `/client/bookings`, `/client/bookings/:bookingId`, `/client/reviews`, `/client/payments`, `/client/messages`, `/client/messages/:threadId`

### Cleaner

- `/cleaner/home`, `/cleaner/jobs`, `/cleaner/jobs/:jobId`, `/cleaner/messages`, `/cleaner/messages/:threadId`
- `/cleaner/availability`, `/cleaner/progress`, `/cleaner/progress/level/:levelNumber`
- `/cleaner/goals`, `/cleaner/goals/:goalId`, `/cleaner/rewards`, `/cleaner/rewards/:rewardId`
- `/cleaner/badges`, `/cleaner/maintenance`, `/cleaner/stats`, `/cleaner/profile`, `/cleaner/payouts`

### Admin

- `/admin/home`
- `/admin/gamification` (overview)
- `/admin/gamification/goals`, `/admin/gamification/goals/:goalId`
- `/admin/gamification/rewards`, `/admin/gamification/rewards/:rewardId`
- `/admin/gamification/choices`, `/admin/gamification/flags`, `/admin/gamification/governor`, `/admin/gamification/abuse`
- `/admin/support/cleaner/:cleanerId/gamification`
- `/admin/audit`, `/admin/users`

### Client cleaner profile tie-in

- `/client/cleaner/:cleanerId` — Add: "Level X", "Top badges", "What this means" (trust signals only).

---

## Shared Component List (full)

**Layout & nav:** AppShell, RoleAwareNav, Breadcrumbs, PageHeader, Tabs, SidePanel/Drawer, Modal.

**Gamification UI:** LevelBadge, LevelProgressRing, ProgressBar, GoalCard, GoalChecklist, StretchGoalPicker, MaintenanceStatusCard, RewardCard, RewardEffectPill, CountdownPill, ChoiceRewardModal, MetricExplainerModal, PausedProgressBanner, NextBestActionCard, BadgeGrid, BadgeCard, AchievementToast.

**Admin:** DataTable, ConfigVersionPicker, EditForm, DiffViewer, ToggleSwitch, BudgetMeter, RegionSelector, GovernorTuningPanel, AuditLogViewer.

**Job + messaging:** QuickTemplatePicker, JobChecklist, PhotoUploader, ClockInBanner, SafetyReportModal.

---

## Wireframe summaries (per screen)

- **Progress Hub:** Header (Your Progress + LevelBadge), Main: progress ring, core/stretch/maintenance, Next Best Actions, Active rewards, CTAs: View Level Details, View Goals, View Rewards.
- **Level Detail:** Header (Level N), Main: Core checklist, Stretch (choose 1), Maintenance; Right: Reward preview, "Counts when…"; CTAs: Select Stretch, View Rewards, Take Next Action.
- **Goals List:** Filters (level, type, almost complete); GoalCards; CTAs: View Details, Take Action.
- **Goal Detail:** Requirement, progress bar, window, what counts / doesn’t, reward; CTAs: Do Next Step, View Reward Preview.
- **Rewards Center:** Tabs Active/Earned/Locked/Choice; RewardCards; CTAs: Select Reward, See Eligible Jobs.
- **Badges:** Tabs Core/Fun/All; BadgeGrid; CTAs: Pin to profile, Share.
- **Maintenance:** Status (good/paused); metric cards; if paused: reason + fix steps; CTAs: View stats, Contact support.
- **My Stats:** Date range; metric tiles + trend; "How it’s calculated" per tile.
- **Job hooks:** Banner (clock-in window, "This job helps: [goals]"); Checklist (clock in, photos, send update); CTAs: Clock In, Upload Photos, Send Update, Report Safety.
- **Admin:** Overview (charts, governor, flags); Goals library (DataTable, create/duplicate/publish/rollback); Rewards manager; Choices; Flags (toggles, region); Governor (inputs/outputs, apply/override); Abuse (tabs, table, actions); Support (progress, recompute, grant/remove, copy).

---

*See GAMIFICATION_IMPLEMENTATION_PLAN.md for current vs target state and build order.*
