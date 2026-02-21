# Documented TODOs

TODOs in the codebase, tracked for launch and post-launch work.

| Location | TODO | Priority |
|----------|------|----------|
| `src/app/cleaner/jobs/[id]/page.tsx` | Send check-in to backend | P1 |
| `src/app/cleaner/jobs/[id]/page.tsx` | Upload photos to backend | P1 |
| `src/app/cleaner/calendar/page.tsx` | Derive bookings from useAssignedJobs or useCleanerSchedule | P2 |
| `src/app/cleaner/availability/page.tsx` | Show success toast after action | P2 |
| `src/components/features/search/CleanerCard.tsx` | Add to favorites | P2 |
| `src/app/admin/disputes/page.tsx` | Create /admin/disputes/:id/resolve endpoint (backend) | P1 |
| `src/lib/errorHandler.ts` | Send to Sentry or other error tracking service | P2 |
| `src/components/error/ErrorBoundary.tsx` | Send to error reporting service (e.g., Sentry) | P2 |
| `src/app/referral/page.tsx` | Call referral email API when backend is ready | P2 |

**Legend:** P1 = needed for core flows; P2 = polish / post-launch.

---

## Formatting (Phase 1)

- **Prettier:** Installed with `eslint-config-prettier`. Use `npm run format` to format `src/`, `npm run format:check` to verify.
- **Bundle:** Run `npm run analyze:bundle` after build; static assets ~1.3 MB, server chunks ~5.9 MB (incl. source maps).

---

## Test suite (Phase 5)

- **Jest:** Tests use Jest (not Vitest). All `vi.*` in `src` tests were replaced with `jest.*`.
- **AuthContext:** Exported `AuthContext` from `AuthContext.tsx` for tests that use `AuthContext.Provider`.
- **MobileNav test:** Fixed “closes menu when link is clicked” assertion (use `not.toBeInTheDocument()` after close).
- **Remaining failures:** Some suites still fail (ToastContext, ErrorBoundary, Header, onboarding steps, useBookings, WebSocketContext, AuthContext integration, NotificationContext, frontend.test InsightsDashboard). Fix incrementally (mocks, async timing, or skip with `it.skip` and a TODO).
