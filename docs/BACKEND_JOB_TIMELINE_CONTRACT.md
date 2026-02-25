# Backend Job Timeline Contract

This doc defines the **minimum backend contract** so the frontend’s cleaner stepper and client “job transparency” UI stay in sync via a single **Job Timeline** event stream.

## Why this matters

- **Cleaner workflow** = “next required event” + stepper (En Route → Check-in → Before → Clean → After → Submit).
- **Client review** = transparency timeline + timestamps + photo proof + Approve vs Dispute.

Both UIs read the same timeline. Every action (en route, check-in, before/after upload, submit, approve, dispute) must become a **timeline event** so the frontend can show the right step and the client can see a full receipt of trust.

---

## 1. Timeline event stream

**GET /jobs/:jobId/timeline** (ASC order)

- **Returns:** `Array<{ id: string; type: TimelineEventType; createdAt: string; meta?: object }>`.
- **Event types:**  
  `job_assigned` | `en_route_sent` | `gps_check_in` | `before_photos_uploaded` | `timer_started` | `timer_paused` | `timer_resumed` | `gps_check_out` | `after_photos_uploaded` | `job_submitted` | `client_approved` | `dispute_opened` | `dispute_resolved`.

Frontend uses this for the **stepper** (cleaner workflow) and client receipt. Backend must return events in **ascending** order (oldest first).

---

## 2. Uploads: sign + commit

**Photo upload flow:** POST /uploads/sign → PUT to putUrl → POST /jobs/:jobId/photos/commit.

### POST /uploads/sign

- **Body:** `{ jobId, kind: "before" | "after" | "client_dispute", fileName, contentType, bytes }`.
- **Returns:** `{ putUrl, key, publicUrl? }`.
- **Behavior:** Generate a presigned PUT URL (e.g. via S3/R2) so the client uploads directly to object storage. Frontend then PUTs the file to `putUrl` and calls the commit endpoint with `key`.

(If the frontend uses Next.js API route `POST /api/uploads/sign`, that route can call your backend or use `lib/storage.ts` with AWS SDK v3 to generate the presigned URL.)

### POST /jobs/:jobId/photos/commit

- **Body:** `{ kind: "before" | "after" | "client_dispute", key, contentType, bytes }`.
- **Behavior (required for timeline sync):**
  1. Persist the photo (e.g. JobPhotos row or link to object storage by `key`).
  2. **Create a timeline event:**
     - `kind === "before"` → emit `before_photos_uploaded`.
     - `kind === "after"` → emit `after_photos_uploaded`.
     - `kind === "client_dispute"` → attach to dispute (no timeline event needed for stepper).

If commit does **not** create the corresponding timeline event, the cleaner stepper and client receipt will be out of sync (e.g. “Submit” stays disabled, or client doesn’t see “Before photos uploaded”).

---

## 3. Job events (en-route, check-in, submit)

- **POST /api/v1/jobs/:jobId/events/en-route**  
  Create timeline event `en_route_sent` (and notify client if desired).

- **POST /api/v1/jobs/:jobId/events/check-in**  
  Body: `{ lat, lng }`. Validate GPS (e.g. within `GPS_CHECKIN_RADIUS_METERS`). If too far, return 400 with a message like “Move closer to address to check in.” If OK, create `gps_check_in`.

- **POST /api/v1/jobs/:jobId/events/submit**  
  **Guardrail:** Require at least one before and one after photo (e.g. using `MIN_BEFORE_PHOTOS`, `MIN_AFTER_PHOTOS`). If not met, return 400 “Upload before and after photos first.” If OK, create `job_submitted` and move job to `awaiting_approval`.

---

## 4. Client approval and dispute (auth + job ownership)

- **POST /tracking/:jobId/approve**  
  Body: `{ rating?, note? }`. Create `client_approved`, release funds, set job to `completed`.

- **POST /tracking/:jobId/dispute**  
  Body: `{ reason, details }`. Create `dispute_opened`, create Dispute row, notify admin.

---

## 5. Cleaner next job and location (optional)

- **GET /api/v1/cleaner/next-job**  
  Returns next appointment: `{ jobId, addressLabel, lat, lng, etaMinutes? }`.

- **POST /api/v1/cleaner/location**  
  Body: `{ lat, lng }`. Optional heartbeat every 10–30s for live “cleaner on route” presence.

---

## 6. Frontend env (mirror backend rules)

Recommend mirroring backend env in frontend validation so users don’t hit preventable errors:

- `GPS_CHECKIN_RADIUS_METERS` → show “Move closer to address to check in” when check-in fails.
- `MIN_BEFORE_PHOTOS` / `MIN_AFTER_PHOTOS` → enforce min photos in upload UI and in submit guardrail message.
- `DISPUTE_WINDOW_HOURS` → show “Dispute window closes in X hours” on client review page.

---

## Fastest path to “timeline in sync”

1. **Implement or verify:**  
   **GET /jobs/:jobId/timeline** (ASC)  
   so both cleaner workflow and client review read the same event list.

2. **Implement:**  
   **POST /uploads/sign**  
   (or use Next.js API route + `lib/storage.ts` with AWS SDK v3; already implemented in this repo).

3. **Implement:**  
   **POST /jobs/:jobId/photos/commit**  
   with:
   - DB write for the photo (key, kind, jobId, etc.).
   - **Creation of timeline event** `before_photos_uploaded` or `after_photos_uploaded` depending on `kind`.

4. Ensure **en-route**, **check-in**, and **submit** endpoints create the corresponding timeline events (`en_route_sent`, `gps_check_in`, `job_submitted`).

Once these are in place, the Job Timeline model keeps the cleaner stepper and the client receipt perfectly in sync.
