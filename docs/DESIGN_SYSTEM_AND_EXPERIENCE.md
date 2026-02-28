# PureTask Design System & Experience

A single source of truth for **why** the app looks and behaves the way it does, **what** we optimize for, and **how** to implement it consistently.

---

## 1. Experience principles

Every screen should reinforce:

| Principle | Meaning | UI implications |
|-----------|---------|------------------|
| **Trust** | "They verify the work. My money is accounted for. If something goes wrong, it's traceable." | Timestamps, IDs, evidence links, ledger-grade surfaces, clear Approve/Dispute. |
| **Predictability** | Users always know: current state, what's next, what they can do now. | One primary CTA per context, steppers, "What happens next" copy, disabled states with reasons. |
| **Evidence-forward** | Proof is one click away. | Check-in/out proof, receipts, timelines, policy links next to actions. |
| **Clarity over flair** | Flare supports clarity; we never sacrifice readability or actionability. | Strong hierarchy, consistent status colors, scannable cards. |
| **One place for the job** | Client and cleaner see the same story (timeline, status, evidence). | Shared job timeline, consistent status labels, same event stream. |

---

## 2. Design tokens

### 2.1 Brand (CSS variables in `globals.css`)

| Token | Value | Use |
|-------|--------|-----|
| `--brand-blue` | #0078FF | Primary CTAs, links, key accents. |
| `--brand-aqua` | #00D4FF | Gradient end, secondary accent. |
| `--brand-graphite` | #1D2533 | Headings, strong text. |
| `--brand-cloud` | #F7F9FC | App background tint, subtle surfaces. |
| `--brand-mint` | #28C76F | Success, completed, positive states. |
| `--gradient-primary` | linear-gradient(90deg, blue, aqua) | Hero CTAs, key banners, logo. |

### 2.2 Semantic colors

| Role | Use |
|------|-----|
| **Primary** | Main action (Book, Approve, Save). Use brand blue or gradient. |
| **Success** | Completed, approved, paid. Use brand mint. |
| **Warning** | Held credits, pending, attention. Use amber. |
| **Risk / Destructive** | Dispute, cancel, refund. Use red. |
| **Neutral** | Body text, borders, secondary. Use gray scale. |

### 2.3 Typography

- **Font:** Geist Sans (variable on body).
- **Headings:** Bold, tracking-tight; use `text-gray-900` (or graphite).
- **Page title:** `text-3xl md:text-4xl font-bold`.
- **Section title:** `text-xl font-semibold`.
- **Body:** `text-base text-gray-600` for secondary; `text-gray-900` for primary copy.
- **Supporting:** `text-sm text-gray-500` for timestamps, IDs, labels.

### 2.4 Spacing & layout

- **Page padding:** `py-8 px-4 md:px-6`.
- **Content max-width:** `max-w-7xl` (lists, dashboards); `max-w-4xl` (detail views, forms).
- **Section spacing:** `space-y-8` or `mb-8` between major blocks.
- **Card padding:** `p-6`; compact cards `p-4`.

### 2.5 Surfaces

- **App background:** `.bg-app` (gradient cloud → white).
- **Cards:** White, `rounded-xl`, `shadow-sm`, `hover:shadow-md`, optional `border-l-4` accent.
- **Banners:** Light tint (e.g. blue-50), border with brand or semantic color.
- **Trust strip:** Short line with icon + "X credits held" / "ID: …" / "Receipt".

---

## 3. Component patterns

### 3.1 Buttons

- **Primary:** Brand blue or gradient; one per section when possible.
- **Secondary:** Outline (border brand blue) or ghost for "Cancel", "Back".
- **Destructive:** Red for "Cancel booking", "Open dispute" (with confirmation).
- **Loading:** Always show spinner + "Loading…" or context ("Approving…").

### 3.2 Cards

- Default: white, rounded-xl, shadow-sm, transition-shadow.
- **Accent:** `border-l-4` with brand or semantic color for stats, alerts.
- **Clickable:** Wrap in AnimatedCardMotion for hover lift; ensure one primary action (e.g. "View").

### 3.3 Status & badges

- Use `getJobStatusLabel` / `getJobStatusBadgeClass` from `constants/jobStatus.ts` everywhere.
- **Trust badges:** Tier, reliability %, "Verified", "Insured" — use Lucide icons + short label.

### 3.4 Empty states

- **Icon:** Lucide (not emoji) for consistency.
- **Title:** Clear, actionable ("No bookings yet").
- **Description:** One line explaining what will appear or what to do.
- **Action:** Single primary CTA when applicable ("Book a service", "Browse cleaners").

### 3.5 Trust-forward blocks

- **TrustBanner:** One line: icon + "Credits held for this job" / "Booking ID: …" / "Receipt available".
- **NextActionCard:** One primary CTA + one sentence ("Approve to release payment to the cleaner.").
- **EvidenceLink:** Link to receipt, timeline, or ledger entry with icon.

---

## 4. Page-level experience

### 4.1 Landing

- **Goal:** Clear value prop + trust + one path for Client, one for Cleaner.
- **Hero:** "I am a…" with Client / Cleaner CTAs; supporting line on verification and credits.
- **Sections:** How it works (3 steps), Why PureTask (insured, vetted, reviews), Testimonials, CTA with gradient.
- **Flare:** Scroll reveal, gradient CTA, Lucide icons, optional subtle motion.

### 4.2 Client dashboard

- **Goal:** Command center — what's next, quick access to credits/bookings/live.
- **Above fold:** Welcome strip (optional gradient); "What's next" (next booking or "Book your first"); primary CTA "Book a Cleaner".
- **Stats:** Total bookings, upcoming, spent, completed — with Lucide icons and left accent.
- **Shortcuts:** Credits, Invoices, Book a Cleaner — brand outline or primary.
- **Trust:** Link to credits/ledger; no clutter.

### 4.3 Client booking detail

- **Goal:** One place for status, timeline, evidence, and the right action (Approve, Dispute, Cancel, Add to calendar).
- **When awaiting_approval:** Dedicated block: before/after + short summary + **Approve** (primary) + **Dispute** (secondary, with reason). Copy: "Approve to release payment to the cleaner."
- **When in_progress / on_my_way:** "Job in progress" + timer (if any) + "X credits held" in a clear banner.
- **Always:** Job ID, timeline (JobDetailsTracking), link to ledger/receipt when relevant.

### 4.4 Search

- **Goal:** Find a cleaner quickly; trust signals (tier, reliability) visible.
- **Header:** Clear title + result count + filters.
- **Cards:** CleanerCard with photo, name, tier, reliability, rating, price; one primary "View" or "Book".

### 4.5 Credits / Billing

- **Goal:** Ledger-grade clarity; every row linkable to detail; balance prominent.
- **Credits:** Balance at top; ledger with date, type, amount, ID; filters (date, type).
- **Billing:** Invoices list; detail with line items; Pay with credits / Pay with card; receipt link.

### 4.6 Cleaner job view

- **Goal:** One primary action per state; guardrails (min photos); clear stepper.
- **Primary CTA:** "I'm on my way" → "Check in" → "Upload before photos" → "Submit after photos" etc.
- **Secondary:** Navigate, expenses, help — grouped or in menu.
- **Guardrails:** Disable complete until ≥1 before + ≥1 after; "Move closer to check in" when applicable.

---

## 5. Accessibility & performance

- **Focus:** All interactive elements focusable; modals trap focus.
- **Labels:** Icon-only buttons have `aria-label`.
- **Loading:** Skeletons that match content layout; no raw spinners for full-page loads where possible.
- **Errors:** Clear message + Retry; avoid raw API strings in production.

---

## 6. Implementation checklist

- [ ] All app pages use `.bg-app` or consistent background.
- [ ] All primary CTAs use brand blue or gradient.
- [ ] Status uses `getJobStatusLabel` / `getJobStatusBadgeClass`.
- [ ] Empty states use Lucide icons and helpful copy + CTA.
- [ ] Client booking detail has dedicated approval block when `awaiting_approval`.
- [ ] Client dashboard has "What's next" and clear Book + Credits/Invoices.
- [ ] Trust surfaces show ID/timestamp/evidence link where relevant.
- [ ] Motion (page transition, scroll reveal, hover) is consistent and subtle.
