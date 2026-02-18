# PureTask — Trust-Fintech UI Spec v1

**Version:** 1.0  
**Status:** Approved for Implementation  
**Goal:** Make users feel and know that PureTask verifies service, accounts for money/credits, and makes issues traceable + fixable — through auditability, predictability, evidence-forward UX, risk clarity, and operational confidence.

---

## 1. Purpose

PureTask must feel like a **system-of-record** for home services: verified execution + accountable payments. Every interaction should reinforce:

- **"They verify the work happened."**
- **"If something goes wrong, it's traceable and fixable."**
- **"My money/credits are accounted for."**

These are not marketing copy — they are **Definition of Done** criteria for every trust surface.

---

## 2. Pillars

| Pillar | Meaning |
|--------|---------|
| **Auditability** | Every credit, fee, refund, and event has a timestamp, ID, reason, and evidence |
| **Predictability** | Clear states, clear next actions, no surprises |
| **Evidence-forward** | Check-in/out proof, receipts, timelines, policy links, dispute path |
| **Risk clarity** | Warnings are explicit (late risk, cancellation risk), not buried |
| **Operational confidence** | The UI behaves like a system-of-record: "this platform tracks reality" |

---

## 3. Non-Negotiable Trust Guarantees

### A1) Auditability (ledger-grade everywhere)

Every credit, fee, refund, and event **must** show:

- Timestamp (local + ISO on detail)
- Unique ID (copyable)
- Type (deposit/spend/refund/bonus/fee)
- Reason/description (human-readable)
- Source link(s): booking, invoice, dispute, policy, evidence
- Status (pending/posted/reversed) where applicable

**UI Enforcement:** Every "money-like" row links to a detail drawer/page with full metadata. Every "service-like" state change appears in a timeline with evidence anchors.

### A2) Predictability (clear states + next actions)

Users always know: **what state they're in**, **what comes next**, **what they can do now**.

**UI Enforcement:** Stepper for appointments. Explicit "Next action" block on booking/appointment cards. Disabling actions shows "why" + "how to proceed".

### A3) Evidence-forward (proof is one click away)

- Check-in/out evidence (GPS + time + source)
- Receipts/invoices on every paid event
- Timelines: booking → en route → arrived → check-in → check-out → completed → reviewed
- Policy links are contextual (refund policy next to refund, cancellation policy next to cancel)

### A4) Risk clarity (warnings aren't buried)

Late risk, cancellation risk, payment risk surfaced as badges + banners + tooltips. Each risk has a recommended resolution.

### A5) Operational confidence ("tracks reality")

- Immutable event history (append-only feel)
- Evidence stored with provenance
- "Last updated" stamps
- Manual overrides clearly labeled

---

## 4. Key Surfaces

| Surface | Purpose |
|---------|---------|
| **Client Dashboard** | Command center; links to credits, billing, live service |
| **Credits** | Balance + ledger + detail drill-down |
| **Billing** | Invoices/receipts + export |
| **Day-of-Service Live Appointment** | GPS + photos + checklist + timeline |
| **Cleaner Profile** | Reliability proof (score + breakdown + "why this match") |

---

## 5. Interaction Standards

- **Drawer-first** detail views (context preserved)
- **Contextual tooltips** and policy links
- **Explicit risk banners** with mitigation actions
- **Keyboard-accessible** UI with consistent focus states
- **No "mystery disabled"** states; reasons are visible

---

## 6. Data Truth Standards

- Immutable/append-only event timeline feel
- IDs are copyable
- Manual overrides always labeled and reasoned

---

## 7. Trust-Fintech Definition of Done Checklist

Every trust surface (credits, billing, appointment) **must** pass:

### Money / Accountability
- [ ] Every monetary event has ID, time, reason, status
- [ ] Ledger entries drill down to invoice/booking/evidence
- [ ] Export works (CSV at minimum)

### Service Verification
- [ ] Appointment state has stepper + timeline
- [ ] GPS check-in/out evidence shown and labeled
- [ ] Photos attach to appointment and are visible post-service
- [ ] Checklist progress tracked and timestamped

### Risk Clarity
- [ ] Late/cancel risks shown as badges/banners
- [ ] Each risk has a clear mitigation action

### Interaction Quality
- [ ] Drawers trap focus & close predictably
- [ ] Tooltips/popovers are keyboard accessible
- [ ] No "mystery disabled" states; reasons are visible
