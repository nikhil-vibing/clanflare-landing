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
      <div className="absolute inset-0 bg-[radial-gradient(70%_48%_at_50%_18%,rgba(95,201,202,0.16),transparent_68%),radial-gradient(42%_38%_at_76%_35%,rgba(132,118,255,0.08),transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_38%)]" />
      <div className="absolute left-1/2 top-[18%] h-[34rem] w-[58rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(95,201,202,0.12),rgba(72,166,167,0.04)_54%,transparent)] blur-2xl" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.26),transparent)]" />
    </div>
  );
}
