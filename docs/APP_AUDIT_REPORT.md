# App Audit Report

Review of the app for the same issues we fixed: broken links, undefined components, viewport/themeColor warnings, and navigation problems.

**Audit date:** 2026-02-18

---

## Issues Fixed in This Audit

### 1. Loading component mismatch (favorites page)
- **File:** `src/app/favorites/page.tsx`
- **Problem:** Imported `LoadingSpinner` but used `<Loading />` (undefined).
- **Fix:** Changed import to `Loading` from `@/components/ui/Loading`.

### 2. viewport/themeColor in seo.ts
- **File:** `src/lib/seo.ts`
- **Problem:** `generateMetadata()` returned `viewport` and `themeColor` in metadata object, which triggers Next.js warnings.
- **Fix:** Removed `viewport` and `themeColor` from the return value. Root layout already has `export const viewport`.

---

## Issues Fixed Previously (Same Session)

| Issue | File | Fix |
|-------|------|-----|
| View All Bookings button | `src/app/dashboard/page.tsx` | Wrapped in `Link href="/client/bookings"` |
| Messages page Loading | `src/app/messages/page.tsx` | Import `Loading` instead of `LoadingSpinner` |
| viewport/themeColor in metadata | `src/app/layout.tsx` | Moved to `export const viewport` |

---

## Verified OK (No Change Needed)

### Loading imports
All other files correctly import and use:
- `Loading` from `@/components/ui/Loading` when using `<Loading />` or `<Loading size="..." text="..." />`
- `LoadingSpinner` from `@/components/ui/LoadingSpinner` when using that component

### Header Login/Sign Up
- Already wrapped in `<Link href="/auth/login">` and `<Link href="/auth/register">` ✓

### Navigation patterns
- Many pages use `window.location.href` or `router.push()` for programmatic navigation — acceptable and works.
- Footer, MobileNav, BottomNav use proper `Link` components ✓

---

## Potential Follow-ups (Low Priority)

### Buttons without navigation
These buttons may be placeholders or trigger other actions (modals, forms). Review if they should navigate:

| File | Button text |
|------|-------------|
| `src/app/dashboard/page.tsx` | New Booking |
| `src/app/cleaner/ai-assistant/quick-responses/page.tsx` | + Create New |
| `src/app/cleaner/ai-assistant/history/page.tsx` | View Analytics, Export Data |
| `src/app/admin/settings/page.tsx` | Test Connection |
| `src/app/admin/risk/page.tsx` | Review Flagged Accounts |
| `src/app/admin/communication/page.tsx` | Preview, Send to Test Email, Send Message |
| `src/app/admin/api/page.tsx` | + Create New Key, + Add Webhook |
| `src/app/cleaner/profile/page.tsx` | Update Pricing, + Add Service Area, Update Password |
| `src/app/cleaner/team/page.tsx` | + Invite Member, Send Invitation |

### lib/seo.ts usage
- `lib/seo.ts` `generateMetadata` is not currently imported by any page.
- `lib/seo/metadata.ts` `generateMetadata` is different and does not include viewport/themeColor ✓

---

## Summary

| Category | Found | Fixed |
|----------|-------|-------|
| Loading vs LoadingSpinner mismatch | 2 | 2 |
| viewport/themeColor in metadata | 2 | 2 |
| Broken/non-navigating buttons | 2 | 2 (View All Bookings, Messages page) |

All critical issues from the same problem patterns have been addressed.
