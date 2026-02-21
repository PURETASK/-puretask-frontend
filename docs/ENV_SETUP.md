# Environment setup (Phase 2)

## Quick start (local)

1. Copy `.env.example` to `.env.local`.
2. Set at least:
   - `NEXT_PUBLIC_API_URL` – backend API (e.g. `http://localhost:4000` for local dev).
3. Run `npm run dev`.

## Required for production

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` or `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL |
| `NEXT_PUBLIC_BASE_URL` | Frontend base URL (e.g. `https://puretask.com`) |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL for real-time features |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` | Stripe publishable key (live) |

## Optional

- **Analytics:** `NEXT_PUBLIC_GA_ID`
- **Error tracking:** `NEXT_PUBLIC_SENTRY_DSN`
- **Maps:** `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_MAPBOX_TOKEN`
- **SEO:** `NEXT_PUBLIC_SITE_URL`

## Security

- Never commit `.env.local` or any file containing secrets.
- Use your hosting platform’s env UI (Vercel, Netlify, etc.) for production.
- See `LAUNCH_CHECKLIST.md` Phase 2 for production checklist.
