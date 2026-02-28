# PWA Icons

The app manifest (`public/manifest.json`) references:

- `/icon-192.png` (192×192)
- `/icon-512.png` (512×512)

## Add icons

1. **Option A – Generate:** Use [favicon.io](https://favicon.io), [realfavicongenerator.net](https://realfavicongenerator.net), or your design tool to create 192×192 and 512×512 PNGs from your logo. Save them as `public/icon-192.png` and `public/icon-512.png`.

2. **Option B – Next.js metadata:** If you use `app/icon.tsx` or `app/apple-icon.tsx`, you can still add the same asset (or an export) into `public/` with these names so the manifest works.

3. **Brand:** Use PureTask brand colors (e.g. `#0078FF`, `#00D4FF`) and the "PT" mark for consistency.

Until these files exist, the PWA will still work; some environments may show a default or missing icon.
