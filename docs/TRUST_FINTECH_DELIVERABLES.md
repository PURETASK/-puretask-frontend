# PureTask Trust-Fintech Upgrade — Complete Deliverables

**Version:** 1.0  
**Companion to:** [TRUST_FINTECH_UI_SPEC_V1.md](./TRUST_FINTECH_UI_SPEC_V1.md)

This document provides the detailed implementation outline: how we solve each complex problem, route map, component inventory, data contracts, migration plan, and acceptance tests.

---

## 0. How We Solve the Complex Problems (Detailed Outline)

### Problem 1: "Auditability everywhere" without overwhelming users

**Solution pattern: Summary → Drill-down → Immutable record feel**

1. Show compact summaries in cards/tables: what, when, amount, status
2. Provide one-click drill-down to a Drawer/Detail View with:
   - Timestamp(s)
   - Unique ID (copyable)
   - Reason
   - Evidence links (booking, invoice, policy, GPS, photos)
   - Status (pending/posted/reversed)
3. Ensure "append-only" event history vibe:
   - Events listed chronologically
   - Edits appear as new events (overrides labeled)

**Implementation lever:** Standard `AuditMetaRow` formatting + `DetailDrawerShell` template used across credits, billing, appointment events.

---

### Problem 2: "Predictable states and next actions" across booking + service day

**Solution pattern: State machine UI + Next Action block**

1. Implement a single appointment state model:
   `scheduled → en_route → arrived → checked_in → completed`
2. Render it the same way everywhere:
   - Stepper at top (current state + timestamps)
   - Timeline below (all events)
   - "Next action" card pinned (what user can do now)

**Implementation lever:** `AppointmentStatusStepper` + `NextActionCard` reused in dashboard, booking details drawer, and day-of-service page.

---

### Problem 3: "Evidence-forward" without feeling like surveillance

**Solution pattern: Proof artifacts with human framing**

- GPS check-in/out displayed as: *"Checked in at 9:02 AM — GPS verified (±12m)"*
- Photos (before/after): gallery with timestamps; presented as "Service evidence"
- Policies contextual: refunds → refund policy link; cancellations → cancellation policy link

**Implementation lever:** EvidencePanel components (GPS, Photos, Checklist) with consistent labels.

---

### Problem 4: "Risk clarity" that feels helpful (not scary)

**Solution pattern: Risk badges + explicit mitigation actions**

- Late risk and cancellation risk: badge (list), banner (detail), tooltip (definition)
- Every risk includes an action: "Switch to Gold+", "Reschedule", "Contact Support"
- Manual overrides labeled: *"Manual override by Support — reason: …"*

**Implementation lever:** `RiskBadge`, `RiskBanner`, and `MitigationActions` standardized.

---

### Problem 5: Introducing Radix/shadcn incrementally without refactoring the whole app

**Solution pattern: Bridge layer + targeted migration**

1. Install shadcn/Radix + Framer Motion
2. Migrate only new trust surfaces first: Drawers/Dialogs/Tooltips/Tables
3. Keep existing Button/Card/Input initially; optionally wrap later
4. Avoid touching admin/analytics pages until trust surfaces are done

**Implementation lever:** Introduce new primitives into `/components/ui` while leaving existing components intact.

---

## 1. Route Map (Final List of Pages + Navigation Links)

### Primary Navigation (Client)

| Route | Purpose | Key Links |
|-------|---------|-----------|
| `/client/dashboard` | Command center | "View booking details" → Drawer; "View live service" → `/client/appointments/[bookingId]/live`; "Credits" → `/client/credits`; "Billing" → `/client/billing` |
| `/booking` | Booking flow entry | Cleaner selection (with compare drawer); Confirm → `/booking/confirm/[id]` |
| `/client/bookings` | Booking history | Keep existing; add "Open in drawer" option later (optional) |

### Trust Surfaces (Client) — NEW

| Route | Purpose | Key Links |
|-------|---------|-----------|
| `/client/credits` | Credits & ledger | Ledger row click → LedgerEntryDrawer; links to booking/invoice/policy |
| `/client/billing` | Billing & invoices | Invoice row click → InvoiceViewerDrawer; Export actions |
| `/client/billing/invoices/[invoiceId]` | Invoice viewer | Optional; use for shareable URLs or printing |
| `/client/appointments/[bookingId]/live` | Day-of-service proof center | GPS + photos + checklist + timeline |

### Existing Routes (Touch for Trust-Fintech)

| Route | Change |
|-------|--------|
| `/client/dashboard` | Add BookingDetailsDrawer + Reliability snippet in upcoming card |
| `/booking` | Add reliability display + compare drawer on cleaner selection |
| `/cleaner/[id]` | Add ReliabilityScoreCard + breakdown + "Why this match" |

### Cleaner + Admin (Unchanged for Phase 1)

- `/cleaner/dashboard`, `/cleaner/jobs`, etc. — keep as-is
- `/admin/*` — keep as-is
- Only touch `/cleaner/[id]` for reliability proof

---

## 2. Component Inventory (Exact Components + Responsibilities)

### A) Trust System Primitives (Reusable Everywhere)

| Component | Responsibility |
|-----------|----------------|
| `AuditMetaRow` | Renders: timestamp, ID (copyable), status, reason, links |
| `DetailDrawerShell` | Standard Radix/shadcn drawer layout: header, metadata sections, actions |
| `EvidenceLink` | Consistent link chips to booking/invoice/policy/photos |

### B) Reliability (Core Differentiation)

| Component | Responsibility |
|-----------|----------------|
| `ReliabilityScoreCard` | Score 0–100, tier, last updated, "how calculated" tooltip |
| `ReliabilityBreakdownBars` | Bars: on-time, completion, cancellations (inverted), comms, quality |
| `ReliabilityWhyThisMatch` | 2–3 bullets explaining ranking ("why #1") |
| `RiskBadge` / `RiskBanner` | Late risk, cancel risk, payment risk with mitigation actions |
| `CleanerCompareDrawer` | Side-by-side: reliability + availability + price + badges |

### C) Credits & Billing (Auditability Engine)

| Component | Responsibility |
|-----------|----------------|
| `CreditsBalanceCard` | Balance display + last update |
| `CreditsAutoRefillCard` | Reuse existing settings logic; add deep links |
| `CreditsLedgerTable` | Filterable + sortable; row opens ledger drawer |
| `LedgerEntryDrawer` | Full audit metadata + linked booking/invoice + export link |
| `InvoiceTable` | Filterable; row opens invoice viewer |
| `InvoiceViewerDrawer` | Items, totals, timestamps, payment method, links, export |
| `ExportButton` | CSV (minimum) + PDF if available |

### D) Appointment / Day-of-Service (Proof Center)

| Component | Responsibility |
|-----------|----------------|
| `AppointmentStatusStepper` | States + timestamps |
| `AppointmentEventTimeline` | Full append-only timeline |
| `GpsEvidencePanel` | GPS events list with accuracy + source |
| `PhotoUploadPanel` | Before/after sections + timestamps + gallery |
| `ChecklistProgress` | Progress bar + items + completion times |
| `NextActionCard` | Clear "what you can do now" |
| `SupportActionCard` | Report issue / contact support / dispute path |
| `BookingDetailsDrawer` | From dashboard; reliability + actions + timeline snippet |

### E) Radix/shadcn Primitives (New)

| Primitive | Used By |
|-----------|---------|
| Drawer (Sheet) | BookingDetailsDrawer, CleanerCompareDrawer, LedgerEntryDrawer, InvoiceViewerDrawer |
| Dialog | Confirm flows, dispute dialogs |
| Tooltip | "How calculated", risk definitions, disabled reasons |
| Popover | Table filters, date range pickers |
| DropdownMenu | Actions, filters |
| Tabs | Credits page sections, billing sections |
| Table | Ledger, invoices (with filters) |

### F) Motion Wrappers (Framer Motion — Limited)

| Component | Use |
|-----------|-----|
| `MotionFadeIn` | Drawer open/close, subtle reveals |
| `MotionListStagger` | List filtering in ledger, cleaner selection |
| `MotionDrawerTransition` | Drawer enter/exit (opacity/transform only) |

**Policy:** Only opacity/transform; nothing layout-janky.

---

## 3. Data Contracts (Types)

### Reliability

```typescript
// src/types/reliability.ts
export type ReliabilityBreakdown = {
  onTimePct: number;
  completionPct: number;
  cancellationPct: number;   // lower is better
  communicationPct: number;
  qualityPct: number;
};

export type ReliabilityScore = {
  score: number;             // 0-100
  tier: "Excellent" | "Good" | "Watch" | "Risk";
  breakdown: ReliabilityBreakdown;
  explainers: string[];      // "Why ranked #1..."
  lastUpdatedISO: string;
};
```

### Credits Ledger

```typescript
// src/types/credits.ts
export type CreditLedgerEntry = {
  id: string;
  createdAtISO: string;
  type: "deposit" | "spend" | "refund" | "bonus" | "fee";
  amount: number;            // +/- by type
  currency: "USD";
  description: string;
  status: "pending" | "posted" | "reversed";
  relatedBookingId?: string;
  invoiceId?: string;
  evidence?: { kind: "receipt" | "policy" | "dispute"; id: string; href: string }[];
};
```

### Invoice

```typescript
// src/types/billing.ts
export type InvoiceLineItem = {
  id: string;
  label: string;
  quantity?: number;
  unitPrice?: number;
  amount: number;
};

export type Invoice = {
  id: string;
  createdAtISO: string;
  status: "draft" | "open" | "paid" | "void" | "refunded";
  subtotal: number;
  tax: number;
  total: number;
  currency: "USD";
  bookingId?: string;
  receiptUrl?: string;
  lineItems: InvoiceLineItem[];
  paymentMethodSummary?: string;
};
```

### Appointment Evidence

```typescript
// src/types/appointment.ts
export type AppointmentState =
  | "scheduled"
  | "en_route"
  | "arrived"
  | "checked_in"
  | "completed";

export type GpsEvidence = {
  id: string;
  event: "en_route" | "arrived" | "check_in" | "check_out";
  atISO: string;
  lat: number;
  lng: number;
  accuracyM?: number;
  source: "device" | "manual_override";
};

export type PhotoEvidence = {
  id: string;
  kind: "before" | "after";
  url: string;
  createdAtISO: string;
  uploadedBy: "cleaner" | "client" | "support";
};

export type ChecklistItem = {
  id: string;
  label: string;
  completed: boolean;
  completedAtISO?: string;
};

export type AppointmentEvent = {
  id: string;
  atISO: string;
  type: "state_change" | "gps" | "photo" | "checklist" | "payment" | "note" | "manual_override";
  summary: string;
  metadata?: Record<string, unknown>;
};

export type LiveAppointment = {
  bookingId: string;
  state: AppointmentState;
  etaISO?: string;
  reliability?: ReliabilityScore;
  gps: GpsEvidence[];
  photos: PhotoEvidence[];
  checklist: ChecklistItem[];
  events: AppointmentEvent[];   // append-only timeline
};
```

---

## 4. Migration Plan (Incremental)

### Phase 0: Dependencies & Plumbing

| Action | Details |
|--------|---------|
| Install Radix primitives | Dialog, Drawer (Sheet), Tooltip, Popover, Tabs, Select, DropdownMenu, Accordion |
| Install Framer Motion | For drawer/list transitions |
| Install shadcn helpers | class-variance-authority, clsx, tailwind-merge |
| Remove react-router-dom | **Current status:** In `package.json` but **not used** in `src`. Safe to remove. |

### Phase 1: Trust Surfaces Only (Targeted)

**Existing pages touched:**
- `src/app/client/dashboard/page.tsx` — add BookingDetailsDrawer, reliability snippet
- `src/app/booking/page.tsx` — add reliability display, compare drawer
- `src/app/cleaner/[id]/page.tsx` — add ReliabilityScoreCard, breakdown

**New pages created:**
- `src/app/client/credits/page.tsx`
- `src/app/client/billing/page.tsx`
- `src/app/client/appointments/[bookingId]/live/page.tsx`

**Existing components that remain:**
- `Button`, `Card`, `Input`, `Modal`, `Table`, `Tooltip`, `Dropdown`, etc.
- Existing CSS animations (toasts, skeletons)

### Phase 2: Standardize (Optional)

- Replace custom Tooltip, Dropdown with Radix equivalents across core client surfaces
- Normalize form error states and focus rings

### Phase 3: Expand (Optional)

- Admin tables/filters
- Cleaner app upgrades with same trust evidence patterns

**Guarantee:** No "big bang" rewrite. Migrate only where it directly powers trust-fintech requirements.

---

## 5. Radix/shadcn Impact — What Changes

### Current PureTask UI (Custom)

| Component | Location | Notes |
|-----------|----------|-------|
| Modal | `src/components/ui/Modal.tsx` | Custom focus trap, ESC; no Radix portal |
| Tooltip | `src/components/ui/Tooltip.tsx` | Mouse only; no keyboard a11y |
| Dropdown | `src/components/ui/Dropdown.tsx` | Custom; click-outside |
| Table | `src/components/ui/Table.tsx` | Basic; no Radix |
| Tabs | `src/components/ui/Tabs.tsx` | Custom |
| ConfirmDialog | `src/components/ui/ConfirmDialog.tsx` | Custom modal |

### Pages Using Components to Migrate (Phase 1 Only)

| Page | Components Used | Migration Scope |
|------|-----------------|-----------------|
| `/client/dashboard` | Modal (via ConfirmDialog?), Card | Add new Drawer; keep Card |
| `/booking` | Card, Button, Input | Add Drawer for compare; keep rest |
| `/cleaner/[id]` | Card, Rating, Avatar | Add ReliabilityCard; keep rest |
| `/client/credits` (NEW) | — | Use new LedgerTable + Drawer (Radix) |
| `/client/billing` (NEW) | — | Use new InvoiceTable + Drawer (Radix) |
| `/client/appointments/[id]/live` (NEW) | — | Use new Stepper, Panels; Drawer for details |

**Estimated pages with component changes:** ~3 existing + 3 new = **6 pages** in Phase 1.

### Benefits from Radix/shadcn

| Benefit | How We Get It |
|---------|---------------|
| Premium drawers/modals | Focus trap, ESC close, body scroll lock, portal layering |
| Menus, tooltips, popovers | Enterprise feel; consistent keyboard nav |
| Consistency | Focus rings, spacing, disabled states, error states |
| Speed | Stop reinventing primitives |
| A11y | Radix handles focus, ARIA, keyboard details |

---

## 6. Acceptance Tests (Human QA + Optional Automation)

### Human QA Checklist — Trust-Fintech Definition of Done v1

#### Money / Accountability
- [ ] Every monetary event shows: ID, time, reason, status
- [ ] Ledger rows drill down to invoice/booking/evidence
- [ ] Export works (CSV minimum) and matches on-screen rows

#### Service Verification
- [ ] Appointment state shows stepper + timeline
- [ ] GPS check-in/out evidence is shown, labeled, includes accuracy/source
- [ ] Before/after photos attach to appointment and remain visible after completion
- [ ] Checklist progress shows timestamps where completed

#### Risk Clarity
- [ ] Late/cancel risks visible as badges/banners (not buried)
- [ ] Each risk includes a mitigation action

#### Interaction Quality
- [ ] Drawers trap focus, close on ESC, lock scroll, layer correctly
- [ ] Tooltips/popovers are keyboard accessible
- [ ] Disabled actions display a reason ("why disabled") and next step

### Optional Automated Checks

| Test Type | Scope |
|-----------|-------|
| **Playwright E2E** | Open/close drawers with keyboard (Tab/ESC); ledger filters; export download |
| **axe-core** | No critical violations on trust pages |
| **Contract tests** | Zod schemas validate API payloads for ledger/invoice/appointment |

---

## 7. API Endpoints (Backend Requirements)

| Endpoint | Purpose |
|----------|---------|
| `GET /cleaners/:id/reliability` | Reliability score + breakdown (or embed in profile) |
| `GET /credits/ledger?from&to&type&status` | Ledger entries with filters |
| `GET /billing/invoices` | Invoice list |
| `GET /billing/invoices/:id` | Invoice detail |
| `GET /billing/invoices/:id/download?format=pdf|csv` | Export |
| `GET /client/jobs/:id/live` | Live appointment state, GPS, photos, checklist, events |

*Existing:* `/credits/balance`, auto-refill config, booking/job endpoints.

---

## 8. Next Steps (Implementation Order)

1. **Phase 0:** Add deps, remove react-router-dom
2. **Data contracts:** Create `src/types/reliability.ts`, `credits.ts`, `billing.ts`, `appointment.ts`
3. **Radix primitives:** Add Drawer, Tooltip (Radix), Table patterns
4. **Reliability system:** Components + placement on cleaner profile + booking
5. **Credits + Billing:** New routes + components
6. **Live appointment:** New route + stepper + evidence panels
7. **Premium drawers:** BookingDetailsDrawer, CleanerCompareDrawer, LedgerEntryDrawer
