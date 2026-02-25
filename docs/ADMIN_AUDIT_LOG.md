# Admin Audit Log

The backend must log **admin actions** so that resolve-dispute, overrides, and credit changes are auditable. The frontend displays the audit log at **Admin → Settings → Security** (GET `/admin/settings/audit-log`).

---

## Required events to log

Every time an admin performs one of these actions, append an audit log entry with at least: **action**, **admin user id**, **timestamp**, **target** (e.g. job id, user id), and **optional payload** (e.g. resolution, amount).

| Action | When | Suggested payload / notes |
|--------|------|----------------------------|
| **resolve_dispute** | Admin resolves a job dispute (POST `/admin/jobs/:jobId/resolve-dispute`) | `jobId`, `resolution` (resolved_refund / resolved_no_refund), `admin_notes?`, refund amount if applicable |
| **credit_adjustment** | Admin adds or removes credits for a user (manual balance change) | `userId`, `delta_credits`, `reason` |
| **override_booking** | Admin overrides booking status or assignment | `bookingId` / `jobId`, `previous_status`, `new_status` or override type |
| **override_cleaner** | Admin overrides cleaner eligibility, pause, or tier | `cleanerId`, override type, reason |
| **override_payout** | Admin manually triggers or blocks a payout | `payoutId` or `cleanerId`, action (e.g. manual_payout, block) |
| **settings_change** | Admin changes a sensitive system setting | `key`, `previous_value?`, `new_value?` (redact secrets) |

---

## API contract

- **GET /admin/settings/audit-log** (params: `limit?`)  
  Returns `{ logs: Array<{ action: string; user_id: string; timestamp: string; target_id?: string; target_type?: string; payload?: object; ip_address?: string }> }`.

Frontend expects at least `action`, `timestamp`, `user_id`, and optionally `ip_address` for display. Additional fields (`target_id`, `payload`) improve filtering and detail views later.

---

## Sync

- **Backend:** Emit an audit log entry for each of the actions above before or after the mutation; persist in a dedicated `admin_audit_log` (or equivalent) table.
- **n8n:** If any admin flows run in n8n, ensure they call an API that records the action, or that the backend records it when the mutation is performed.
