/**
 * Fixed grain overlay (v10 Rule 2 / v11 §1) — SVG feTurbulence noise
 * data-URI at low opacity, mix-blend overlay. Cheap, no asset, no JS.
 */
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120] opacity-[0.04] mix-blend-overlay"
      style={{ backgroundImage: NOISE }}
    />
  );
}
