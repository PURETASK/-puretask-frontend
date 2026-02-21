# Trust-Fintech Frontend — Backend Integration

Complete reference for integrating the PureTask frontend with the Trust-Fintech backend.

---

## 1. Base Setup

| Item | Value |
|------|-------|
| API base URL | `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000` (dev) / your prod URL |
| Auth header | `Authorization: Bearer <JWT>` on all requests |
| Job ID = Booking ID | Same thing — use `job.id` as `bookingId` in Trust routes |

---

## 2. Auth Flow (where the JWT comes from)

Trust endpoints need a valid JWT. Use the main API:

- **Register:** `POST /auth/register` — body: `{ email, password, role, firstName?, lastName? }`
- **Login:** `POST /auth/login` — body: `{ email, password }` → response includes token (or similar field per your backend)

Store the token (e.g. in `localStorage`) and send it in `Authorization` on every Trust (and API) request.

---

## 3. Response Contracts (what the backend returns)

### GET /api/credits/balance

```json
{
  "balance": 120,
  "currency": "USD",
  "lastUpdatedISO": "2026-02-17T12:00:00.000Z"
}
```

### GET /api/credits/ledger?from=&to=&type=&search=&limit=50

```json
{
  "entries": [
    {
      "id": "uuid",
      "createdAtISO": "2026-02-17T12:00:00.000Z",
      "type": "deposit|spend|adjustment|credit",
      "amount": 150,
      "currency": "USD",
      "description": "Credits top-up",
      "status": "posted",
      "invoiceId": "uuid|null",
      "relatedBookingId": "uuid|null"
    }
  ]
}
```

### GET /api/billing/invoices

```json
{
  "invoices": [
    {
      "id": "uuid",
      "createdAtISO": "...",
      "status": "sent|paid|declined|cancelled|expired",
      "subtotal": 150,
      "tax": 0,
      "total": 150,
      "currency": "USD",
      "bookingId": "uuid|null",
      "receiptUrl": "",
      "lineItems": [],
      "paymentMethodSummary": "credits ••••"
    }
  ]
}
```

### GET /api/billing/invoices/:id

Same shape as list item, plus full `lineItems` with `{ id, label, amount }`.

### GET /api/appointments/:bookingId/live

```json
{
  "bookingId": "uuid",
  "state": "scheduled|en_route|arrived|checked_in|completed|cancelled",
  "etaISO": "2026-02-17T13:00:00.000Z|null",
  "gps": [
    {
      "id": "uuid",
      "event": "location",
      "atISO": "...",
      "lat": 37.77,
      "lng": -122.42,
      "accuracyM": 10,
      "source": "device"
    }
  ],
  "photos": [
    {
      "id": "uuid",
      "type": "before|after",
      "url": "...",
      "atISO": "..."
    }
  ],
  "checklist": [
    {
      "id": "c1",
      "label": "Kitchen",
      "completed": false
    }
  ],
  "events": [
    {
      "id": "uuid",
      "atISO": "...",
      "type": "state_change|gps",
      "summary": "job.checked_in",
      "metadata": {}
    }
  ]
}
```

### POST /api/appointments/:bookingId/events

**Request:**

```json
{
  "type": "en_route|arrived|check_in|check_out|note",
  "note": "optional string",
  "gps": {
    "lat": 37.77,
    "lng": -122.42,
    "accuracyM": 10
  },
  "source": "device|manual_override"
}
```

**Response:** `{ "ok": true }` or **501** for `check_in` / `check_out` (use main tracking API instead).

---

## 4. Role Requirements

| Endpoint | Role |
|----------|------|
| `/api/credits/*` | client |
| `/api/billing/*` | client |
| `/api/appointments/:id/live` | client or cleaner (job participant) |
| `/api/appointments/:id/events` | cleaner only |

---

## 5. Operations Not in Trust Adapter

- **Pay invoice:** `POST /client/invoices/:id/pay` — body: `{ payment_method: "credits"|"card" }`
- **Buy credits:** `POST /credits/checkout` — body: `{ packageId, successUrl, cancelUrl }`
- **Reliability:** Reliability UI uses existing PureTask endpoints (e.g. cleaner profile / reliability APIs), not the Trust adapter

---

## 6. Errors

| Status | Meaning |
|--------|---------|
| 401 | Missing/invalid token → redirect to login |
| 403 | Not allowed for this user/role |
| 404 | Resource not found |
| 501 | For `check_in` / `check_out` → use `/tracking/:jobId/check-in` and `/tracking/:jobId/check-out` with photos |

Error body shape (typical): `{ error: { code: "...", message: "..." } }` or `{ message: "..." }`.

---

## 7. CORS

Backend must allow the frontend origin (e.g. `http://localhost:3000`). If you get CORS errors, ensure that origin is configured.

---

## 8. Environment URLs

| Env | NEXT_PUBLIC_API_BASE_URL |
|-----|--------------------------|
| Local | `http://localhost:4000` |
| Staging | Your staging backend URL |
| Prod | Your production backend URL |

---

## Related Docs

- [BACKEND_ENDPOINTS.md](./BACKEND_ENDPOINTS.md) — Full list of all API endpoints
- [TRUST_API_INTEGRATION.md](./TRUST_API_INTEGRATION.md) — Frontend Trust hooks and demo pages
