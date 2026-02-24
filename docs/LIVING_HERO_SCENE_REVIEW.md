# Living Hero Scene (R3F + Framer Motion) — Review & Integration Plan

This doc reviews the “Living Hero Scene” spec and maps it to the **PureTask frontend** so you can implement it without breaking existing flows.

## Requirements checklist (all installed and wired)

- **three**, **@react-three/fiber**, **@react-three/drei** — 3D scene (installed).
- **framer-motion** — headline/CTA animations (already in project).
- **next/dynamic** — `ssr: false` for the Canvas (Next.js).
- **next/link** — “Get started” → `/search`, “See how reliability works” → `/#how-it-works`.
- **@/components/hero/AmbientHeroScene3D.tsx** — scene with geometry disposal, reduced-motion, typed Vec3.
- **@/components/hero/HeroSection.tsx** — dynamic import, loading fallback, `aria-label`, min-height.
- **src/app/page.tsx** — uses `HeroSection` from `@/components/hero/HeroSection`.
- **HowItWorks** — has `id="how-it-works"` for the anchor link.
- **@sentry/nextjs** — installed so the app build resolves (optional at runtime if no DSN).

---

## 1. What the spec does

| Piece | Role |
|-------|------|
| **AmbientHeroScene3D.tsx** | R3F Canvas with: floating box “homes”, glowing sphere “service nodes”, Catmull-Rom path lines, rotating “reliability” torus, subtle camera drift. Dark background `#0B0E14`. |
| **HeroSection.tsx** | Wrapper: 3D scene as background + gradient overlay + Framer Motion headline/CTA (“Home tasks, orchestrated by intelligence.”). |
| **page.tsx** | Renders `<HeroSection />` on the homepage. |

You get: a calm, “living depth” hero that can be reused for onboarding/empty states later.

---

## 2. Fit with this repo

### 2.1 Paths and structure

- Spec assumes a top-level `/components/hero/`. This project uses **`src/`** and **`@/*` → `./src/*`**.
- **Use these paths:**

  - `src/components/hero/AmbientHeroScene3D.tsx`
  - `src/components/hero/HeroSection.tsx`

- **Imports:** `@/components/hero/HeroSection` (not `@/components/hero/HeroSection.tsx`).

### 2.2 Existing hero

- **Current:** `src/components/features/landing/HeroSection.tsx` — gradient CTA “Book a Professional Cleaner In Minutes” + ZIP input + Find Cleaners.
- **Options:**
  - **A) Replace:** Point `src/app/page.tsx` at the new `@/components/hero/HeroSection` and retire or keep the old one under another name (e.g. `HeroSectionLegacy.tsx`) if you need it elsewhere.
  - **B) Swap in 3D only:** Keep current hero layout/copy but use the new 3D scene as the background (import `AmbientHeroScene3D` into `components/features/landing/HeroSection.tsx` and adjust layout).
  - **C) New route:** Use the new hero only on a dedicated route (e.g. `/preview-hero` or `/marketing`) and leave the main landing as-is.

Recommendation: **A** if you want the new “trust-fintech” message site-wide; **B** if you want to keep current copy and CTA but add the 3D look.

### 2.3 Dependencies

- **Already in repo:** `framer-motion`.
- **To add (frontend root):**

  ```bash
  npm i three @react-three/fiber @react-three/drei
  ```

- **Types:** `@types/three` often comes with `three`; if you see type errors, add `@types/three` as devDep.

---

## 3. Code review (spec as given)

### 3.1 Correct and solid

- **`"use client"`** on both hero components — required for Canvas and Framer Motion in App Router. Good.
- **Canvas options:** `dpr={[1, 1.5]}`, `gl={{ antialias: true, alpha: true }}` are reasonable for quality vs perf.
- **Float (drei):** Good for subtle motion without manual `useFrame`.
- **Camera drift:** Small sin-based offset and `lookAt` keep the scene stable and “living”.
- **Overlay gradient:** `from-black/55 via-black/25 to-black/10` keeps text readable over the 3D scene.
- **Framer Motion:** Simple `initial` / `animate` / `transition` with stagger is appropriate.

### 3.2 Things to fix or watch

1. **TubeGeometry lifecycle**  
   In `PathLines`, `THREE.TubeGeometry` is created in `useMemo` and never disposed. In Three.js/R3F, geometries should be disposed when unmounting to avoid memory leaks.  
   **Fix:** Use a ref to store geometries and in a `useEffect` cleanup (or R3F’s `useFrame`/unmount), call `geom.dispose()` for each, or build the tube in a way that R3F can dispose (e.g. let `<mesh>` own the geometry and rely on R3F’s disposal if applicable for your version).

2. **Type casts**  
   `position={h.p as any}` and `scale={h.s as any}` are a bit loose. You can type the tuple as `[number, number, number]` and avoid `as any`:

   ```ts
   const homes: { p: [number, number, number]; s: [number, number, number]; c: string }[] = [...]
   ```

3. **Buttons are not links**  
   “Get started” and “See how reliability works” are `<button>`. For a real landing page you’ll want:
   - “Get started” → `<Link href="/search">` or `/booking` (or your main CTA).
   - “See how reliability works” → `<Link href="/#how-it-works">` or a dedicated trust/reliability page.

4. **Accessibility**  
   - Prefer `<section aria-label="Hero">` or similar.
   - Ensure contrast of “Calm surfaces • Living depth • Trust-fintech UX” (`text-white/65`) against the gradient meets WCAG if it’s important text.

5. **Performance / low-end devices**  
   Canvas + multiple Float + TubeGeometry can be heavy. Consider:
   - Reducing `dpr` max (e.g. `dpr={[1, 1.25]}`) or disabling camera drift on `prefers-reduced-motion`.
   - Lazy-loading the 3D hero (dynamic import with `ssr: false`) so the rest of the page loads first.

6. **Spec’s `HeroSection` export**  
   Spec uses `export default function HeroSection`. Your existing hero is `export function HeroSection`. If you replace the import, the default export is fine; just be consistent so the rest of the app doesn’t expect a named export.

---

## 4. Integration checklist (for this repo)

Use this order so you don’t break the current landing page.

1. **Install deps (in repo root)**  
   ```bash
   npm i three @react-three/fiber @react-three/drei
   ```

2. **Create hero folder and 3D scene**  
   - Add `src/components/hero/AmbientHeroScene3D.tsx` (paste spec code; optionally add geometry disposal and type fixes above).

3. **Add new HeroSection**  
   - Add `src/components/hero/HeroSection.tsx` (paste spec; add `"use client"` if not present).  
   - Wire buttons to real routes (e.g. `Link` to `/search`, `/booking`, or `/how-it-works`).

4. **Decide how to show it**  
   - **Replace current hero:** In `src/app/page.tsx`, change:
     - `import { HeroSection } from '@/components/features/landing/HeroSection';`
     - to `import HeroSection from '@/components/hero/HeroSection';`
   - **Keep both:** e.g. use the 3D hero on `/` and keep the old one on another route or behind a feature flag.

5. **Optional: Lazy-load 3D hero**  
   In `HeroSection.tsx`:
   ```tsx
   const AmbientHeroScene3D = dynamic(
     () => import('@/components/hero/AmbientHeroScene3D'),
     { ssr: false }
   );
   ```
   Then use `<AmbientHeroScene3D />` so the Canvas only loads on the client.

6. **Optional: Reduced motion**  
   Use `window.matchMedia('(prefers-reduced-motion: reduce)')` to skip camera drift or simplify the scene (e.g. fewer floats or no PathLines) when the user prefers reduced motion.

---

## 5. Cursor / tooling

- Same as any other Next/TS project: Cursor doesn’t change where files live or how Next/App Router works. Run `npm run dev` from the **frontend** directory; the 3D hero is entirely frontend.

---

## 6. Expected result (recap)

After integration you should see:

- Dark hero card (`#0B0E14`), rounded.
- Floating abstract “homes” (boxes) and glowing “service nodes” (spheres).
- Subtle green path lines and rotating “reliability” ring.
- Gentle camera drift.
- Animated headline and CTA with gradient overlay keeping text readable.

If you want, next step can be: “apply the checklist in this repo (add files, fix disposal/types, wire CTAs, and replace hero on `page.tsx`)” and I can do that in code.
