# Clanflare Landing

Implementation of the Clanflare landing page: built to **landing-v11**, polished to **landing-v12**, and upgraded to **landing-v13** for liquid-glass graphics, real platform marks, sample human product visuals, and memory-safe motion — see `../landing-v11.md`, `../landing-v12.md`, and `../landing-v13.md`.

**Positioning (locked):** category = *Community Monetisation Infrastructure* (eyebrow, meta, footer); emotional spine = *ownership / digital sovereignty*. Money appears as infrastructure you own, never hype.

## Stack

Next.js 16 (App Router, TS, Turbopack) · Tailwind CSS v4 (`@theme` tokens) · native scroll · GSAP 3 + ScrollTrigger + SplitText · Motion · Radix Dialog · lucide-react · CSS-only liquid glass/ambient depth · zod + Resend server action · Vercel Analytics + Speed Insights.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run test:e2e # v13 §9 acceptance gates (boots `next start`, runs Playwright)
```

`test:e2e` runs after a `build` and checks, on desktop + mobile + reduced-motion:
idle cursor stays `auto` (the P0 busy-cursor regression), no request hangs, the
page stays responsive while scrolling the pinned story, dialogs don't leak a
body scroll-lock, the form returns to interactive on a validation error, and
**load-phase CLS ≤ 0.02**. CLS is gated on the load value (the Lighthouse/field
definition); the during-scroll delta it prints is non-gating, since it's
dominated by ScrollTrigger pin transitions that real CLS excludes (they're
input-adjacent). Lighthouse Perf ≥ 90 / INP < 200ms remain a manual gate —
`npx lighthouse http://localhost:3000 --view` against `next start`.

Email delivery needs env vars (otherwise submissions log to the server console):

```
RESEND_API_KEY=...
CONTACT_TO=hello@clanflare.com
CONTACT_FROM="Clanflare <hello@clanflare.com>"   # verified Resend domain
```

## Architecture

- `src/lib/copy.ts` — ALL copy, single source of truth
- `src/lib/gsap.ts` — plugin registration (once)
- `src/app/` — layout (fonts, JSON-LD, native scroll wrapper, Grain, analytics), page (sections; GSAP showpieces via `next/dynamic`), `actions.ts` (zod + honeypot + Resend), `opengraph-image.tsx`
- `src/components/brand/PlatformLogo.tsx` — real social platform marks from Simple Icons path data, scoped to the six marks used in TenantTrap
- `src/components/fx/` — `Grain`, `GlowBg`, `ShaderBg` (CSS-only ambient hero depth), `Reveal`, `SquiggleWord`, `CountUp` (SSR-static real value, count-up on view), `DrawBorder`, `mocks.tsx` (v13 glass product graphics with real micro-content — named sample posts, reactions, progress meters, tier counts — not skeleton bars; sample in-app human avatars)
- `src/components/sections/` — Nav (underline hover, sheet menu), Hero (SplitText H1, strikethrough, sheen CTA, liquid-glass device graphics), TenantTrap (pinned 3-beat story with real platform marks and sample human "you" orb; stacked fallback), Pillars, StatsBand (real numbers, SSR-correct), ProductBento (glass mini-scenes), Vision (scrub crescendo), Proof (honest "case file" cards — role glyph + falsifiable count-up result, no face/initials until cleared photos exist, border draw-in quote), HowItWorks (chips light in sequence), CtaForm (floating labels, success check draw-in), Footer

## v13 rules encoded here

- **No placeholder ever ships**: every missing asset renders a *designed fallback* (real-micro-content product UI / role-glyph case cards), never a dashed box with instruction text, never a bare initials circle, and never fake faces.
- **Real platform marks**: TenantTrap uses real YouTube, Instagram, Discord, Patreon, TikTok, and X SVG paths inside glass chips.
- **Human imagery stays honest**: sample portraits are used only inside product/community UI graphics; named proof/testimonials show an evidence-led case card (role glyph + falsifiable result), never a synthetic face, until cleared real photos exist.
- **Memory-safe visuals**: no WebGL/canvas shader, no Lenis root scroll loop; liquid glass is CSS-only and the pinned story remains bounded under production memory checks.
- **Numbers are SSR-static real values**, enhanced by count-up — a unit never renders without its value. If a number isn't real, the stat is deleted.
- Elevation bands + hairline/gradient section transitions + per-section glow anchors; card anatomy and hover (−2px, 200ms) consistent everywhere; all animations have a reduced-motion path.

## Swapping in real assets (the remaining 20%)

| Asset | Where |
|---|---|
| Hero desktop/mobile screenshots | replace `<AppMock/>`/`<PhoneMock/>` in `Hero.tsx` with `next/image` (priority — the LCP) |
| 6 bento micro-loops (3–4s muted MP4/WebM ≤1MB) | replace `<LoopMock/>` in `ProductBento.tsx` with `<video loop muted playsInline preload="none" poster=…>` |
| Arcade/Storylane tour URL | `TourDialog.tsx` mock block → lazy iframe |
| Cleared client photos | `Proof.tsx` case-file cards → real face + name + verifiable link |
| Resend domain + key | env vars above |

Sourcing map (free tools): shots.so / Mockuuups for device frames, Random User Generator sample portraits for illustrative in-app avatars, Screen Studio/QuickTime for loops — see `../landing-v13.md`.
