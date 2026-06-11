/**
 * Teal radial glow (v11 §1) — rationed to the hero and the vision
 * crescendo only. Pure CSS, server-rendered.
 */
export default function GlowBg({
  position = "50% 30%",
  size = "60% 50%",
  className = "",
}: {
  position?: string;
  size?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background: `radial-gradient(${size} at ${position}, var(--color-teal-glow), transparent 70%)`,
      }}
    />
  );
}
