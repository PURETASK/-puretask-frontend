# Trust-Fintech API Integration (Drop-in)

This project includes a fetch-based API client and TanStack Query hooks for credits, billing, and live appointments.

## Files Added

| File | Purpose |
|------|---------|
| `src/lib/apiClient.ts` | Fetch-based `apiGet` / `apiPost` with Bearer token auth |
| `src/types/trust.ts` | Data contracts (CreditsBalance, Invoice, LiveAppointment, etc.) |
| `src/hooks/useCreditsTrust.ts` | `useCreditsBalance`, `useCreditsLedger` |
| `src/hooks/useBillingTrust.ts` | `useInvoices`, `useInvoice` |
| `src/hooks/useLiveAppointmentTrust.ts` | `useLiveAppointment`, `usePostAppointmentEvent` |
| `src/app/client/credits-trust/page.tsx` | Demo: `/client/credits-trust` |
| `src/app/client/billing-trust/page.tsx` | Demo: `/client/billing-trust` |
| `src/app/client/appointments/[bookingId]/live-trust/page.tsx` | Demo: `/client/appointments/:id/live-trust` |

## Backend Endpoints Expected

- `GET /api/credits/balance`
- `GET /api/credits/ledger?...`
- `GET /api/billing/invoices`
- `GET /api/billing/invoices/:id`
- `GET /api/appointments/:bookingId/live`
- `POST /api/appointments/:bookingId/events`
- `POST /api/appointments/:bookingId/photos` (optional)

## Configuration

### API base URL

- Same-origin (Next.js API routes): leave `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_URL` unset.
- Separate backend: set in `.env.local`:
  ```
  NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
  ```
  or use existing:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:4000
  ```

### Auth

The apiClient uses **Bearer tokens** (from `localStorage` key `puretask_token`). For cookie sessions, change `apiClient.ts` to use `credentials: "include"` and remove the `Authorization` header.

## Demo Routes

- `/client/credits-trust` – Credits balance + ledger
- `/client/billing-trust` – Invoices list
- `/client/appointments/[bookingId]/live-trust` – Live appointment state + event posting

## Using in Existing Pages

Replace service calls with the Trust hooks:

```ts
// Before (axios service)
const { data } = useQuery({
  queryKey: ['credits', 'balance'],
  queryFn: () => creditsService.getBalance(),
});

// After (Trust hooks)
const { data } = useCreditsBalance();
```
