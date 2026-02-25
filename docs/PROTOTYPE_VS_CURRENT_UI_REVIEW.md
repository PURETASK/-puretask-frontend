# PureTask: Prototype vs Current Setup — Review

This doc compares the **“PureTask Interactive Website Prototype (React)”** description to the **current PureTask frontend**: what exists, what’s different, and how the suggested high-impact improvements map to the codebase.

---

## 1. Prototype Features vs Current Setup

| Prototype feature | Current setup | Gap / notes |
|-------------------|---------------|-------------|
| **Interactive hero role selector (Client vs Cleaner) with motion + cards** | Hero is **ZIP + “Find Cleaners”** only (`HeroSection.tsx`). Role choice exists on **Register** (client/cleaner cards) and in `AuthForm`, not on landing. | **Different.** No landing hero “I’m a Client” / “I’m a Cleaner” with motion cards. Add optional hero role selector that deep-links to `/search` vs `/cleaner/onboarding`. |
| **Interactive cleaner profile cards (tier badge, reliability progress, hover lift)** | **CleanerCard** has rating, price, badges, hover; **no tier badge or reliability progress ring**. **ReliabilityRing** exists in `JobDetailsTracking` and **cleaner profile** (`/cleaner/[id]`). | **Partial.** Add tier + reliability to **CleanerCard** (and ensure `/cleaner/[id]` uses ReliabilityRing prominently). |
| **Client address entry (ready for Google Places Autocomplete)** | Booking step 3: plain **Input** fields (street, city, state, ZIP). No Places Autocomplete. | **Missing.** Address is manual only. Add Places Autocomplete to booking address step (or a dedicated address page) and keep current fields as fallback. |
| **Cleaner navigation page (map placeholder + ETA/progress, ready for Maps/Mapbox)** | **PresenceMapCard** = map placeholder + status pill + “Open in Maps”. **Client** live: `/client/appointments/[bookingId]/live` with stepper, GPS panel, next action. **Cleaner** job detail: directions via `cleanerEnhancedService.getDirections`, no dedicated “navigation” page with ETA/progress. | **Partial.** Client has live view + placeholder map; cleaner has job detail with directions but no dedicated nav page with ETA/progress. Add cleaner “En route” view with map placeholder + ETA + one-tap “Navigate” / “Check-in”. |
| **Cleaner job workflow: stepper + “En Route → Check-in → Before → Clean → After → Submit”** | **JobStatusRail**: 4 steps — Booked → On route → Working → Completed (maps backend statuses). **Cleaner job** `/cleaner/jobs/[id]`: status transitions, check-in (GPS), before/after photo upload, time/expenses; not a single linear stepper with labels “Before → Clean → After → Submit”. | **Different.** We have status rail + many actions; prototype is a clearer **one-screen stepper** with explicit “En Route → Check-in → Before → Clean → After → Submit”. Consider a **CleanerJobStepper** that mirrors JobStatusRail but with cleaner-facing labels and one-tap actions. |
| **Photo upload (before/after, multi-file, min 1 each)** | **Cleaner job page**: before/after state + `uploadPhoto` mutation; **PhotoUploadPanel** in appointments. No enforced “min 1 before, min 1 after” in UI; backend may enforce. | **Partial.** Add client-side guard: disable “Submit” until at least 1 before + 1 after, with clear copy. |
| **Client review/approval page (before/after gallery tabs, GPS/times, approve vs dispute)** | **Client booking detail** `/client/bookings/[id]`: **JobDetailsTracking** = timeline rail, before/after (**BeforeAfterCompare** slider when both exist), presence, ledger. No dedicated “approval” page with **Approve** vs **Dispute** CTAs; status `awaiting_approval` is shown on cleaner side (“Waiting for client approval”). Admin has disputes; client has **Support** (email dispute). | **Gap.** We have the data (photos, check-ins, times) but no dedicated **client approval screen** with: before/after tabs or slider, GPS/times summary, and explicit **Approve** / **Dispute** buttons. Add a view (or state on booking detail) for `awaiting_approval` with those actions. |
| **Interactive dispute page (reason picker + details)** | **Admin**: `/admin/disputes` (list + resolve). **Client**: `/client/support` (email link for dispute). No **client-facing dispute form** (reason picker + details). | **Missing.** Add **client dispute flow**: reason picker + text/details, then submit (API + optional redirect to support). |
| **Cleaner wallet (weekly vs instant payout toggle, fee calc, earnings list, rewards progress)** | **Cleaner earnings** `/cleaner/earnings`: earnings summary, payouts list, request payout, charts, export. No **weekly vs instant** toggle or **fee calculator** in UI. Gamification **rewards/progress** exist on other pages. | **Partial.** Add payout mode toggle (weekly vs instant) + fee calc + optional “rewards progress” snippet on same page. |

---

## 2. High-Impact Improvements (Prototype) vs Current State

| Improvement | Current state | Recommendation |
|-------------|---------------|-----------------|
| **One shared “Job Timeline” event stream** | **JobStatusRail** = 4 visual steps (booked → on_route → working → completed). **Job details** have check-ins list, ledger, photos; no single **event stream** (e.g. `en_route_sent`, `gps_checkin`, `before_uploaded`, `checkout`, `client_approved`, `dispute_opened`). | Introduce a **Job Timeline** (or **Job Event Stream**) component: one list of events from backend (or derived from job + checkins + ledger + photos). Use it on **client** booking detail and **cleaner** job view so both see the same narrative. Backend: add or normalize events (e.g. from status transitions, check-ins, photo uploads, approval, dispute). |
| **Auto-guardrails to prevent disputes** | Cleaner job page: photo upload and check-in exist; no **block submit without before/after**. No **GPS mismatch** message (“Move closer to address to check in”). | **Add:** (1) On cleaner submit/complete: if before/after count &lt; 1 each, block and show “Add at least 1 before and 1 after photo.” (2) On check-in: if backend returns “out of radius”, show “Move closer to address to check in” and disable or explain check-in. |
| **Client approval UX = “confidence builder”** | **BeforeAfterCompare** = side-by-side slider (we have this). No “What changed?” captions. Approval is not a dedicated step with clear CTAs. | **Keep** before/after slider; **add** optional “What changed?” captions (from cleaner or template). Make **client approval** a clear step: when status = `awaiting_approval`, show before/after + summary + **Approve** / **Dispute** prominently (dedicated section or page). |
| **Cleaner workflow = one-tap actions** | Cleaner job page has many buttons (directions, check-in, upload, status transitions). “Send En Route” is not a single big primary action; flow is not “one tap → then Navigate → Check-in”. | **Add** a **primary action** per state: e.g. “I’m on my way” (one tap) → then show “Navigate” + “Check-in”. Reduce clutter: one main CTA, secondary actions grouped or in a menu. |
| **Wallet: make payout feel rewarding** | Earnings page shows balance and payouts; no **“+X credits added”** or **“Available payout updated”** animation after client approval. | **Add:** On earnings (or job completion) when a job is approved / released, show a short success animation: “+X credits added” → “Available payout updated” (and optionally refresh balance). Can be triggered by polling or WebSocket. |

---

## 3. Summary: What We Have vs What’s Different

**Already aligned (or close):**

- Before/after photos and **BeforeAfterCompare** slider.
- Job status progression (JobStatusRail + backend statuses).
- Cleaner job page: check-in (GPS), before/after upload, status transitions.
- Client booking detail: timeline rail, presence, ledger, photos.
- Map placeholder + “Open in Maps” (PresenceMapCard).
- Cleaner earnings: list, request payout, charts.
- Admin disputes list and resolve flow.

**Different or missing:**

- **Landing:** No hero role selector (Client vs Cleaner) with motion cards.
- **Cleaner cards:** No tier badge or reliability progress on search cards.
- **Address:** No Google Places Autocomplete on booking.
- **Cleaner:** No dedicated “navigation” page with ETA/progress; no single-screen stepper with one-tap “En Route” → “Check-in” → “Before” → “Clean” → “After” → “Submit”.
- **Client:** No dedicated approval screen with Approve / Dispute; no in-app dispute form (reason picker + details).
- **Timeline:** No single event stream (en_route_sent, gps_checkin, before_uploaded, client_approved, dispute_opened, etc.) shared by client and cleaner.
- **Guardrails:** No “min 1 before + 1 after” block or “Move closer to check in” on cleaner flow.
- **Wallet:** No weekly vs instant toggle, no fee calc, no “+credits added” / “payout updated” animation.

---

## 4. Suggested Implementation Order

1. **Client approval + dispute (high impact)**  
   - Add approval block on `/client/bookings/[id]` when status = `awaiting_approval`: before/after + Approve / Dispute.  
   - Add client dispute flow: reason picker + details → submit (calls API, then redirect or message).

2. **Job Timeline (shared)**  
   - Define event types (en_route_sent, gps_checkin, before_uploaded, checkout, client_approved, dispute_opened, etc.).  
   - Backend: return or derive events (from status, check-ins, photos, ledger).  
   - Add **JobTimeline** component; use on client booking detail and cleaner job view.

3. **Cleaner guardrails**  
   - Block submit/complete until ≥1 before and ≥1 after; show clear message.  
   - On check-in failure (e.g. out of radius), show “Move closer to address to check in.”

4. **Cleaner one-tap workflow**  
   - Refactor cleaner job view: one primary CTA per state (“I’m on my way”, “Check in”, “Start cleaning”, “Submit photos”, etc.); secondary actions (navigate, expenses) grouped.

5. **Hero role selector (optional)**  
   - Add Client / Cleaner cards on landing with motion; link to `/search` and `/cleaner/onboarding`.

6. **Address Autocomplete**  
   - Integrate Google Places (or similar) on booking step 3; keep manual fields as fallback.

7. **Wallet polish**  
   - Weekly vs instant payout toggle + fee calc on earnings page.  
   - “+X credits added” / “Available payout updated” animation when a job is approved/released.

8. **Cleaner card tier + reliability**  
   - Show tier badge and reliability (e.g. ReliabilityRing or progress) on CleanerCard and public profile.

---

*Doc generated from comparison of the “PureTask Interactive Website Prototype” description with the current codebase (UI_REFERENCE, PAGES_AND_FEATURES_ANALYSIS, and component/page review).*
