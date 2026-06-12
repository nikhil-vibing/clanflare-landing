/**
 * Static ambient hero backdrop.
 *
 * v13 memory guardrail: the previous full-screen WebGL MeshGradient could push
 * Chromium/WebKit RSS above 1GB on scroll. This keeps the same deep, liquid
 * atmosphere with compositor-cheap CSS gradients and no runtime canvas.
 */
export default function ShaderBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* v19: richer pastel mesh — more sage-teal + dusty-blue presence so the
          hero is warm, not washed, and reads as kin to the deep-teal bands. */}
      <div className="absolute inset-0 bg-[radial-gradient(52%_46%_at_15%_8%,rgba(127,168,163,0.50),transparent_56%),radial-gradient(54%_48%_at_87%_14%,rgba(243,236,221,0.62),transparent_60%),radial-gradient(46%_44%_at_66%_92%,rgba(127,168,163,0.28),transparent_58%),linear-gradient(180deg,rgba(255,253,247,0.28),transparent_40%)]" />
      <div className="absolute left-[42%] top-[12%] h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(127,168,163,0.36),rgba(220,232,229,0.14)_56%,transparent)] blur-2xl" />
      {/* soft hand-off into the deep-teal Gather band below */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(40,67,63,0.07))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(40,67,63,0.18),transparent)]" />
    </div>
  );
}
