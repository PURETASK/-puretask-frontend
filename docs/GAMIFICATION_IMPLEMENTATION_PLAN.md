# Gamification – Implementation Plan

**Reference:** [GAMIFICATION_UI_SPEC.md](./GAMIFICATION_UI_SPEC.md)

---

## Current state vs spec

### Cleaner routes

| Route (spec) | Exists | Notes |
|--------------|--------|------|
| `/cleaner/progress` | ✅ | Page exists; content is achievements/XP style, not full Gamification Hub (level, core/stretch/maintenance, next best action, rewards carousel) |
| `/cleaner/progress/level/:levelNumber` | ❌ | Not implemented |
| `/cleaner/goals` | ❌ | Not implemented |
| `/cleaner/goals/:goalId` | ❌ | Not implemented |
| `/cleaner/rewards` | ❌ | Not implemented |
| `/cleaner/rewards/:rewardId` | ❌ | Not implemented |
| `/cleaner/badges` | ❌ | Not implemented |
| `/cleaner/maintenance` | ❌ | Not implemented |
| `/cleaner/stats` | ❌ | Not implemented |
| `/cleaner/jobs/:jobId` | ✅ | Exists; add gamification hooks (goals tag, photo checklist, clock-in banner) |

### Admin routes

| Route (spec) | Exists | Notes |
|--------------|--------|------|
| `/admin/gamification` | ❌ | Not implemented |
| `/admin/gamification/goals` | ❌ | Not implemented |
| `/admin/gamification/goals/:goalId` | ❌ | Not implemented |
| `/admin/gamification/rewards` | ❌ | Not implemented |
| `/admin/gamification/rewards/:rewardId` | ❌ | Not implemented |
| `/admin/gamification/choices` | ❌ | Not implemented |
| `/admin/gamification/flags` | ❌ | Not implemented |
| `/admin/gamification/governor` | ❌ | Not implemented |
| `/admin/gamification/abuse` | ❌ | Not implemented |
| `/admin/support/cleaner/:cleanerId/gamification` | ❌ | Not implemented |

### Shared gamification components

| Component | Exists | Notes |
|------------|--------|-------|
| ProgressBar | ✅ | `@/components/ui/Progress` |
| LevelBadge | ❌ | New |
| LevelProgressRing | ❌ | New |
| GoalCard | ❌ | New |
| GoalChecklist | ❌ | New |
| StretchGoalPicker | ❌ | New |
| MaintenanceStatusCard / PausedProgressBanner | ❌ | New |
| RewardCard | ❌ | New |
| RewardEffectPill | ❌ | New |
| CountdownPill | ❌ | New |
| ChoiceRewardModal | ❌ | New |
| MetricExplainerModal | ❌ | New |
| NextBestActionCard | ❌ | New |
| BadgeGrid / BadgeCard | ❌ | New (legacy AchievementDisplay exists) |
| AchievementToast | ❌ | New |

### Client

| Item | Exists | Notes |
|------|--------|-------|
| Cleaner profile "Level X" + badges | ❌ | Add to `/client/cleaner/:cleanerId` or `/cleaner/[id]` public profile |

---

## Recommended build order

1. **Shared gamification components** (in `src/components/gamification/`)
   - LevelBadge, LevelProgressRing, CountdownPill
   - GoalCard, GoalChecklist, StretchGoalPicker
   - RewardCard, RewardEffectPill, ChoiceRewardModal
   - MaintenanceStatusCard, PausedProgressBanner
   - MetricExplainerModal, NextBestActionCard
   - BadgeCard, BadgeGrid, AchievementToast

2. **Cleaner gamification pages**
   - Enhance `/cleaner/progress` to match spec (hub: level, progress ring, core/stretch/maintenance, next actions, active rewards).
   - Add `/cleaner/progress/level/[levelNumber]/page.tsx`.
   - Add `/cleaner/goals/page.tsx`, `/cleaner/goals/[goalId]/page.tsx`.
   - Add `/cleaner/rewards/page.tsx`, optionally `/cleaner/rewards/[rewardId]/page.tsx`.
   - Add `/cleaner/badges/page.tsx`.
   - Add `/cleaner/maintenance/page.tsx`.
   - Add `/cleaner/stats/page.tsx`.

3. **Job screen hooks**
   - In `/cleaner/jobs/[id]/page.tsx`: add "This job helps your goals", photo checklist, clock-in window banner, CTAs.

4. **Admin gamification**
   - Add `/admin/gamification/page.tsx` (overview).
   - Add `/admin/gamification/goals/`, `rewards/`, `choices/`, `flags/`, `governor/`, `abuse/`.
   - Add `/admin/support/cleaner/[cleanerId]/gamification/` (support debug).

5. **Client cleaner profile**
   - Add Level + top badges + "What this means" to cleaner profile view.

6. **APIs / data**
   - Backend endpoints for goals, rewards, levels, maintenance, stats (see BACKEND_ENDPOINTS.md or API spec). Frontend hooks and services to call them.

---

## File structure to add

```
src/
  components/
    gamification/
      LevelBadge.tsx
      LevelProgressRing.tsx
      GoalCard.tsx
      GoalChecklist.tsx
      StretchGoalPicker.tsx
      RewardCard.tsx
      RewardEffectPill.tsx
      CountdownPill.tsx
      MaintenanceStatusCard.tsx
      PausedProgressBanner.tsx
      NextBestActionCard.tsx
      BadgeCard.tsx
      BadgeGrid.tsx
      ChoiceRewardModal.tsx
      MetricExplainerModal.tsx
      AchievementToast.tsx
  app/
    cleaner/
      progress/
        level/
          [levelNumber]/
            page.tsx
      goals/
        page.tsx
        [goalId]/
          page.tsx
      rewards/
        page.tsx
        [rewardId]/
          page.tsx  (optional)
      badges/
        page.tsx
      maintenance/
        page.tsx
      stats/
        page.tsx
    admin/
      gamification/
        page.tsx
        goals/
          page.tsx
          [goalId]/
            page.tsx
        rewards/
          page.tsx
          [rewardId]/
            page.tsx
        choices/
          page.tsx
        flags/
          page.tsx
        governor/
          page.tsx
        abuse/
          page.tsx
      support/
        cleaner/
          [cleanerId]/
            gamification/
              page.tsx
```

---

## Wiring complete / Suggested next steps and other problems

- **Backend:** All gamification admin and cleaner progress endpoints are documented in [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md) (Admin – Gamification, Cleaner – Gamification). Implement these so the frontend can persist flags, goals, rewards, governor, and abuse actions.
- **Admin flags:** Wired to `gamificationAdminService.getFlags()` / `updateFlags()`. If backend returns 404, UI keeps local state and Save still triggers the PATCH (callers can show toast on failure).
- **Admin goals:** Wired to `gamificationAdminService.getGoals()`; empty response falls back to placeholder rows. Create/Update/Duplicate/Rollback are UI-only until backend exists.
- **QuickTemplatePicker:** Implemented in chat composer (`ChatWindow`). Templates satisfy “meaningful message” use cases (Thank you, Reschedule?, Request review, On my way, Arrived, Starting, Finished). Job screen “Send Update” links to messages where the picker is available; optional: pre-fill template via `?template=...` when opening messages from job.
- **Cleaner profile level/badges:** Client profile at `/cleaner/[id]` shows level and top badges when `cleaner.level` and `cleaner.badges` are returned from `GET /cleaners/:id`. Backend should include these for client trust signals.
- **Support debug view:** `/admin/support/cleaner/[cleanerId]/gamification` is a stub. When backend exposes `GET /admin/support/cleaner/:id/gamification` (goal progress, why paused, reward history), add DataTable or read-only cards and Recompute / Grant reward / Remove reward / Copy explanation actions (guarded).
- **Other suggestions:** Add error toasts when admin save (flags/goals) fails; add loading skeletons on admin gamification pages while fetching; consider rate-limiting or confirmation for “Pause rewards” and “Disable globally” to avoid accidental kills.
- **Choices page:** Admin choice reward groups (`/admin/gamification/choices`) is still a stub; add list + create/edit when backend supports choice groups.

---

*Implement in the order above; stub pages with "Coming soon" or minimal UI until APIs and components are ready.*
