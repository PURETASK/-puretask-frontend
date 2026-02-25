# UI/UX Changes & Frontend Review

Short log of recent UI/UX work, a **design vs build** checklist, and **suggestions/improvements** for the whole frontend.

---

## 1. UI/UX changes implemented

| Area | Change | Where |
|------|--------|--------|
| **Landing** | Hero role selector: “I am a…” with **Client — Find a cleaner** and **Cleaner — Join & earn** (primary CTAs). | `src/components/hero/HeroSection.tsx` |
| **Search** | CleanerCard shows **tier** badge and **reliability score** (“X% reliable”) when API provides them. | `src/components/features/search/CleanerCard.tsx`, `src/app/search/page.tsx` |
| **Client booking detail** | When status is `in_progress` or `on_my_way`: card with “Job in progress”, start time (if available), and “X credits held for this job”. | `src/app/client/bookings/[id]/page.tsx` |
| **Photo upload** | Progress bar (current/total) during upload; error message + **Retry** button on failure. | `src/components/upload/PhotoUploader.tsx` |
| **Dispute page** | Intro copy + **“What happens next?”** (24–48h response, possible contact, outcomes). | `src/app/(client)/client/job/[jobId]/dispute/page.tsx` |
| **Cleaner earnings** | **Next payout** banner: estimated amount and date + “Request payout” when applicable. | `src/app/cleaner/earnings/page.tsx` |
| **Booking confirmation** | **“Credits held for this booking”** callout: reserved credits + buffer explanation. | `src/app/booking/confirm/[id]/page.tsx` |
| **PWA** | Web app manifest (name, theme_color, icons). Layout links `manifest: "/manifest.json"`. Icon paths are placeholders until real assets exist. | `public/manifest.json`, `src/app/layout.tsx` |

Other frontend work already in place (from earlier passes): approve/dispute block and escrow on client booking detail, canonical job status constants, safe handling for search/cleaner goals data, Button `asChild` fix, `.env.local` fix.

---

## 2. Design vs build checklist

Items from **FRONTEND_QA_COMPLETE_REFERENCE** and **DELIVERABLE_B** that were designed and either built or deferred:

| Designed | Built? | Notes |
|----------|--------|--------|
| Hero role selector (Client / Cleaner) | ✅ | HeroSection primary CTAs. |
| Tier & reliability on CleanerCard | ✅ | Tier badge + “X% reliable”; no visual ring yet. |
| Client approval flow (Approve / Dispute primary) | ✅ | Already on booking detail + dispute page. |
| Shared job timeline / status rail | ✅ | JobTimeline / JobDetailsTracking in use. |
| Job in progress: timer + held credits | ✅ | Card on booking detail when in progress. |
| Next payout banner (cleaner earnings) | ✅ | Banner with date + amount + Request payout. |
| Dispute “what happens next” | ✅ | Blurb with 24–48h and outcomes. |
| Booking confirm: held credits + buffer | ✅ | Callout on confirmation page. |
| Photo uploader: progress + retry | ✅ | Progress bar and Retry on error. |
| PWA / installability | 🟡 | Manifest + metadata; add `icon-192.png` / `icon-512.png` when ready. |
| Cleaner guardrails (Check in / Start / Complete + GPS/photo copy) | 🟡 | Workflow/upload pages exist; validation copy can be tightened. |
| Wallet animation on balance update | ❌ | Not implemented. |
| Places Autocomplete (booking address) | ❌ | Not implemented. |
| Reschedule flow | ❌ | Not implemented (backend-dependent). |
| Reliability ring (visual) on CleanerCard | ❌ | Text only (“X% reliable”). |
| Cleaner public profile: tier + reliability prominent | 🟡 | CleanerCard has it; profile page could mirror. |
| Admin resolve dispute: partial refund amount input | 🟡 | Admin disputes UI exists; confirm field matches backend. |
| Stripe Connect gating before job accept | 🟡 | Backend-dependent; frontend can show block + CTA when not onboarded. |

---

## 3. Gaps and follow-ups

- **PWA icons:** Add `public/icon-192.png` and `public/icon-512.png` (or generate via `app/icon.tsx`) so manifest icons resolve.
- **Backend for tier/reliability:** Ensure `GET /cleaners/search` (and profile) return `tier` and `reliability_score` so cards and profile stay consistent.
- **Earnings next payout:** Banner uses `earnings.nextPayout`; confirm backend shape (e.g. `date`, `estimatedUsd`, `estimatedCredits`) matches.

---

## 4. Suggestions and improvements (entire frontend)

### Consistency & design system

- **Tokens:** Use `BRAND` and `gradientPrimary` from `src/lib/brand.ts` (and any global spacing/radius tokens) everywhere for CTAs and key surfaces so the app feels consistent.
- **Status and badges:** Prefer `getJobStatusLabel` / `getJobStatusBadgeClass` from `src/constants/jobStatus.ts` for all job/booking status so copy and colors stay aligned.
- **Empty and error states:** Reuse `EmptyState`, `EmptyCleaners`, `ErrorDisplay`; add a small set of illustrations or icons for “no results”, “no bookings”, “error” for a more polished feel.

### Performance & resilience

- **Lists:** Use virtualization (e.g. `react-window` or TanStack Virtual) for long lists (search results, bookings, admin tables) to keep scroll smooth.
- **Images:** Use Next.js `Image` with sizes and optional blur placeholder for avatars and photos; consider a single CDN/base URL for cleaner photos.
- **Data safety:** Keep optional chaining and “array or object” normalization (like search `data?.pagination?.total` and goals list) anywhere the API shape can vary or be empty.

### Accessibility & UX

- **Focus and forms:** Ensure all modals and important buttons are reachable by keyboard and that focus is trapped in modals; label icon-only buttons (`aria-label`).
- **Loading:** Use skeletons or inline spinners (e.g. `LoadingSpinner`, `JobRowSkeleton`) consistently so users know when data is loading.
- **Errors:** Show clear, actionable messages (e.g. “Upload failed. Please try again.” + Retry) and avoid raw API error strings in production.

### Mobile & layout

- **Touch targets:** Buttons and links already use min heights (e.g. 44px) in places; audit primary actions site-wide for tap size.
- **Bottom nav:** Confirm client/cleaner/admin nav highlights the correct section and that key flows (book, earnings, disputes) are easy to reach.

### Integrations and ops

- **API base URL:** Document that `NEXT_PUBLIC_API_BASE_URL` / `NEXT_PUBLIC_API_URL` must not contain extra text (e.g. “ and NEXT_PUBLIC_…”); keep one var per line in `.env.local`.
- **60-min run sheet:** Use `docs/60_MINUTE_INTEGRATION_RUN_SHEET.md` for full regression; add a short “smoke” checklist (login, one booking, one approve) for quick pre-deploy checks.

---

## 5. Doc references

- **Screens and status:** `docs/DELIVERABLE_B_TOP_20_SCREENS_AND_ALL_BUILT.md`
- **QA and build priority:** `docs/FRONTEND_QA_COMPLETE_REFERENCE.md`
- **Money flow and idempotency:** `docs/DELIVERABLE_C_MONEY_FLOW_CONTRACT_CHECKLIST.md`
- **Integration test order:** `docs/60_MINUTE_INTEGRATION_RUN_SHEET.md`, `docs/DELIVERABLE_D_FULL_INTEGRATION_AUDIT_PLAN.md`
- **Job status and audit:** `docs/CANONICAL_JOB_STATUS.md`, `docs/ADMIN_AUDIT_LOG.md`
