import type { ReactNode } from "react";

/**
 * Native scroll wrapper.
 *
 * v13 memory guardrail: Lenis looked good, but pairing a root smooth-scroll
 * loop with ScrollTrigger pinning pushed browser RSS over 1GB on this landing
 * page. Native scroll keeps the interaction choreography without the extra
 * compositor pressure.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
