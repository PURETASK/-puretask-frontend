# Redesign & Animations

Summary of the UI/UX redesign and animation system used across the app.

---

## 1. Motion system

- **Tokens:** `src/components/motion/tokens.ts` — duration, easing, spring, page enter/exit, stagger, list item variants.
- **CSS variables:** `src/styles/animations.css` — `--motion-duration-*`, `--motion-ease-out` for non-Framer usage.
- **Framer Motion** is used for: page transitions, modals, scroll reveal, staggered lists, hover/press on cards.

### Key components

| Component | Use |
|-----------|-----|
| `ClientPageTransition` | Wraps all page content in root layout; every route gets a fade + slide + blur enter. |
| `PageTransitionMotion` | Same enter animation; use when you need it inside a client tree without the layout wrapper. |
| `ScrollRevealSection` / `ScrollRevealItem` | Reveal on scroll (fade + slide up); use for landing sections, grids. |
| `Stagger` / `StaggerItem` | Staggered list animation (e.g. dashboard cards). |
| `AnimatedCardMotion` | Hover lift + tap press on cards; wrap clickable cards. |
| `Modal` | AnimatePresence + backdrop/panel enter/exit (scale + fade). |

---

## 2. Global changes

- **Page transitions:** Every navigation triggers a short enter animation (opacity, y, blur) via `ClientPageTransition`.
- **Buttons:** Global hover `scale(1.02)` and active `scale(0.98)`; `transition-colors` and `transition-transform` with 200ms.
- **Cards:** `rounded-xl`, `transition-shadow duration-200`, `hover:shadow-md`.
- **Modals/dialogs:** Backdrop blur, panel scale + fade in/out with AnimatePresence.

---

## 3. Landing page

- **Hero:** Existing Framer stagger on headline and CTAs; CTAs use `transition-all duration-200` and hover/active scale.
- **Trust badges:** Emoji replaced with Lucide icons (Shield, CheckCircle2, Star); each badge wrapped in `ScrollRevealItem`; icon containers have `group-hover:scale-110` and `rounded-2xl`.
- **Testimonials:** Each card wrapped in `ScrollRevealItem` + `AnimatedCardMotion`; star rating uses Lucide `Star` (filled); cards use updated Card styling and hover shadow.
- **CTA section:** Buttons use hover/active scale.

---

## 4. Navigation

- **BottomNav:** Active item has `bg-blue-50`, active icon `scale-110`; all items use `transition-all duration-200` and hover background; nav bar uses `bg-white/95 backdrop-blur-sm`.
- **Header:** Logo link uses `transition-opacity duration-200`.

---

## 5. How to add animations

- **New page:** No extra work; `ClientPageTransition` in layout gives enter animation.
- **List of cards:** Wrap list in `Stagger`, each card in `StaggerItem`; optionally wrap each card in `AnimatedCardMotion` if clickable.
- **Section that should reveal on scroll:** Wrap in `ScrollRevealSection` or use `ScrollRevealItem` per item with `index` and optional `staggerDelay`.
- **New modal:** Use `Modal`; it already has enter/exit animations.
- **Consistent timings:** Use `motionTokens.duration.*` and `motionTokens.ease.*` from `@/components/motion/tokens`.

---

## 6. Assets and brand

- **Brand tokens:** `src/lib/brand.ts` — `BRAND` (blue, aqua, graphite, cloud, mint), `gradientPrimary`. Use these for CTAs and key surfaces.
- **Icons:** Prefer Lucide React; replace emoji with icons for trust badges, ratings, and empty states where it fits.
