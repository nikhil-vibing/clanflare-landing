"use client";

import PlatformLogo, {
  PLATFORM_ORDER,
  platformLabel,
  type Platform,
} from "@/components/brand/PlatformLogo";
import { KeyRound } from "lucide-react";
import { useRef } from "react";
import { HumanAvatar } from "@/components/fx/mocks";
import Reveal from "@/components/fx/Reveal";
import { copy } from "@/lib/copy";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// chip anchor (% of stage) and the matching constellation-line endpoint
const CHIPS = [
  { left: "6%", top: "8%", rotate: "-6deg", x: 14, y: 13 },
  { left: "62%", top: "2%", rotate: "4deg", x: 70, y: 7 },
  { left: "78%", top: "34%", rotate: "-3deg", x: 84, y: 38 },
  { left: "70%", top: "72%", rotate: "7deg", x: 78, y: 76 },
  { left: "16%", top: "76%", rotate: "-5deg", x: 24, y: 80 },
  { left: "0%", top: "42%", rotate: "3deg", x: 8, y: 46 },
];

const PLATFORMS: Platform[] = PLATFORM_ORDER;

/**
 * The Tenant Trap — pinned 3-beat scroll story. v12 P1-7: the scene reads
 * as a system, not floating objects — dotted-grid backdrop, constellation
 * lines tethering each platform chip to the "you" orb (they snap as the
 * chips fall), idle float on the chips and a soft pulse on the orb so the
 * scene breathes before scroll. Mobile + reduced motion get the stacked
 * fallback.
 */
export default function TenantTrap() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
      const mm = gsap.matchMedia();
      // ≥1024px (desktop / large tablet landscape) + motion: the full pinned,
      // scrub-driven 3-beat scene. We deliberately DON'T pin below this — touch
      // address-bar resizes make pinned scenes jump (GSAP docs); tablet & phone
      // get the lighter non-pinned reveal below.
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const q = gsap.utils.selector(ref);
          const lines = q<HTMLElement>("[data-beat]");
          const chips = q<HTMLElement>("[data-chip]");
          const chipInners = q<HTMLElement>("[data-chip-float]");
          const links = q<SVGLineElement>("[data-link]");
          const frame = q<HTMLElement>("[data-frame]");
          const members = q<HTMLElement>("[data-member]");
          const key = q<HTMLElement>("[data-key]");

          gsap.set(lines, { autoAlpha: 0, y: 28 });
          gsap.set(chips, { autoAlpha: 0, scale: 0.85 });
          gsap.set(links, { autoAlpha: 0 });
          gsap.set(frame, { autoAlpha: 0, scale: 0.7 });
          gsap.set(members, { autoAlpha: 0, scale: 0 });

          // idle float on the chip inners — separate element from the one
          // the scrub timeline moves, so the tweens never fight
          chipInners.forEach((el, i) => {
            gsap.to(el, {
              y: 7,
              duration: 3 + (i % 3) * 0.45,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              delay: i * 0.35,
            });
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: q<HTMLElement>("[data-scene]")[0],
              start: "top top",
              end: "+=250%",
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // beat 1 — captive: chips tethered to "you"
          tl.to(lines[0], { autoAlpha: 1, y: 0, duration: 0.5 })
            .to(chips, { autoAlpha: 1, scale: 1, stagger: 0.06, duration: 0.4 }, "<")
            .to(links, { autoAlpha: 0.55, stagger: 0.05, duration: 0.4 }, "<+0.1")
            .to({}, { duration: 0.6 })
            // beat 2 — the tethers snap, the chips detach and fall
            .to(lines[0], { autoAlpha: 0, y: -28, duration: 0.4 })
            .to(links, { autoAlpha: 0, stagger: 0.04, duration: 0.25 }, "<")
            .to(
              chips,
              {
                y: "120vh",
                rotation: (i) => (i % 2 ? 38 : -32),
                stagger: 0.07,
                duration: 1.1,
                ease: "power2.in",
              },
              "<"
            )
            .to(lines[1], { autoAlpha: 1, y: 0, duration: 0.5 }, "<+0.25")
            .to({}, { duration: 0.6 })
            // beat 3 — the branded frame assembles
            .to(lines[1], { autoAlpha: 0, y: -28, duration: 0.4 })
            .to(frame, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.3)" }, "<")
            .to(members, { autoAlpha: 1, scale: 1, stagger: 0.05, duration: 0.35 }, "<+0.3")
            .to(lines[2], { autoAlpha: 1, y: 0, duration: 0.5 }, "<")
            .to(key, { rotation: 90, duration: 0.4 }, "<+0.3")
            .to({}, { duration: 0.4 });
        }
      );

      // <1024px (phone + tablet) + motion: a LIGHTER, NON-PINNED reveal. The
      // captive composition (orb + tethered chips + constellation) assembles
      // as the stage scrolls into view; a gentle scrubbed drift gives the
      // chips the "pull" of captivity. No pin, transform/opacity only — so the
      // mobile address-bar resize bug can't apply and it stays cheap on
      // low-power devices. The 3 beats below reveal in sequence via <Reveal>.
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const q = gsap.utils.selector(ref);
          const stage = q<HTMLElement>("[data-m-stage]")[0];
          if (!stage) return;
          const orb = q<HTMLElement>("[data-m-orb]");
          const chips = q<HTMLElement>("[data-m-chip]");
          const links = q<SVGLineElement>("[data-m-link]");

          // assemble-in when the stage enters the viewport
          gsap
            .timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            })
            .from(orb, { autoAlpha: 0, scale: 0.55, duration: 0.5, ease: "back.out(1.6)" })
            .from(
              links,
              { autoAlpha: 0, duration: 0.4, stagger: 0.05 },
              "<+0.1"
            )
            .from(
              chips,
              { autoAlpha: 0, scale: 0.5, stagger: 0.07, duration: 0.5, ease: "back.out(1.5)" },
              "<"
            );

          // gentle scroll-scrubbed drift — the chips strain outward as you pass
          gsap.to(chips, {
            y: (i: number) => (i % 2 ? 16 : -12),
            x: (i: number) => (i < 3 ? 12 : -12),
            ease: "none",
            scrollTrigger: {
              trigger: stage,
              start: "top 65%",
              end: "bottom 25%",
              scrub: true,
            },
          });
        }
      );
    },
    { scope: ref }
  );

  const beats = copy.trap.beats;

  return (
    <section ref={ref} id="trap" aria-labelledby="trap-heading" className="band">
      <h2 id="trap-heading" className="sr-only">
        The tenant trap
      </h2>

      {/* ===== pinned scene (≥1024px, motion ok) ===== */}
      {/* min-h-[100svh]: the SMALL viewport height (toolbars-shown) so the
          pinned stage never gets clipped by mobile/tablet browser chrome. */}
      <div data-scene className="relative hidden min-h-[100svh] items-center overflow-hidden lg:motion-safe:flex">
        <div className="mx-auto grid w-full max-w-[1180px] items-center gap-16 px-10 md:grid-cols-2">
          {/* beat copy — absolutely stacked, crossfaded by the timeline */}
          <div className="relative min-h-[280px]">
            <p className="eyebrow">The tenant trap</p>
            {beats.map((b, i) => (
              <div key={i} data-beat className="absolute inset-x-0 top-12">
                <p className="text-[clamp(28px,3.4vw,44px)] font-bold leading-[1.12] tracking-tight">
                  {b.line}
                </p>
                <p className="mt-5 max-w-[36ch] text-lg font-medium text-ink-dim">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* visual stage — always composed (v12 P1-7) */}
          <div className="relative aspect-[5/4] w-full" aria-hidden="true">
            {/* dotted-grid backdrop */}
            <div className="dot-grid absolute inset-[-6%]" />
            {/* constellation lines: chips → you */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {CHIPS.map((c, i) => (
                <line
                  key={i}
                  data-link
                  className="tether-shimmer"
                  style={{ animationDelay: `${i * 0.4}s` }}
                  x1={c.x}
                  y1={c.y}
                  x2={50}
                  y2={50}
                  stroke="rgba(155,230,232,0.34)"
                  strokeWidth="0.28"
                  strokeDasharray="1.4 1.3"
                />
              ))}
            </svg>
            {/* the creator, center — pulsing, alive. Badge sits OUTSIDE the
                glass orb (which clips its overflow) so it can never be cut. */}
            <div className="absolute left-1/2 top-1/2 z-[4] -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="orb-pulse glass-device liquid-rim flex h-24 w-24 items-center justify-center rounded-full p-2 shadow-[0_0_42px_rgba(72,166,167,0.42)]">
                  <HumanAvatar index={2} className="h-full w-full" priority />
                </div>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-hi px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#06100F] shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                  you
                </span>
              </div>
            </div>
            {/* captor chips (outer = scrub target, inner = idle float) */}
            {PLATFORMS.map((p, i) => (
              <span
                key={p}
                data-chip
                className="absolute z-[3] block"
                style={{ left: CHIPS[i].left, top: CHIPS[i].top, rotate: CHIPS[i].rotate }}
              >
                <span
                  data-chip-float
                  className="glass-chip flex items-center gap-2 px-3.5 py-2 text-[12px] font-bold text-ink-dim shadow-[var(--shadow-raise)]"
                  aria-label={platformLabel(p)}
                >
                  <PlatformLogo platform={p} className="relative h-4 w-4" />
                  <span className="relative">{platformLabel(p)}</span>
                </span>
              </span>
            ))}
            {/* branded app frame that assembles around creator + members */}
            {/* position:absolute set inline — .glass-device declares
                position:relative and (loading after Tailwind) would otherwise
                override the `absolute` utility, collapsing the frame to its
                header height. Inline style wins, so the frame fills the stage. */}
            <div
              data-frame
              style={{ position: "absolute", inset: "8%" }}
              className="glass-device z-[1] rounded-3xl shadow-[var(--shadow-stage),0_40px_90px_-30px_rgba(72,166,167,0.35)]"
            >
              <div className="flex items-center gap-2.5 border-b border-white/5 px-5 py-3.5">
                <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-hi to-teal shadow-[0_0_14px_rgba(72,166,167,0.5)]" />
                <span className="h-2 w-24 rounded bg-teal-hi/40" />
                <span data-key className="glass-chip relative ml-auto flex h-9 w-9 items-center justify-center text-teal-hi">
                  <KeyRound size={18} />
                </span>
              </div>
              {[
                { left: "18%", top: "38%" },
                { left: "70%", top: "30%" },
                { left: "78%", top: "62%" },
                { left: "28%", top: "70%" },
                { left: "55%", top: "78%" },
                { left: "12%", top: "56%" },
              ].map((pos, i) => (
                <span
                  key={i}
                  data-member
                  className="absolute"
                  style={pos}
                >
                  <HumanAvatar index={i} className="h-10 w-10 ring-2 ring-teal-hi/30" />
                </span>
              ))}
              <span className="absolute bottom-4 left-5 rounded-full bg-teal-hi px-3 py-1.5 text-[11px] font-semibold text-[#06100F]">
                Your members · your data
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== stacked layout (phone / tablet / reduced motion) =====
          Below 1024px (or with reduced motion) this replaces the pinned scene.
          With motion, the composition assembles + drifts on scroll via the
          <1024px gsap.matchMedia block above (non-pinned). Static otherwise. */}
      <div className="mx-auto max-w-[1180px] px-6 py-20 md:px-10 lg:motion-safe:hidden">
        <p className="eyebrow">The tenant trap</p>
        <div
          data-m-stage
          className="relative mt-8 aspect-[5/4] overflow-hidden rounded-3xl border border-hairline-2 bg-surface p-6"
        >
          <div className="dot-grid absolute inset-0 opacity-70" />
          {/* constellation: chips tethered to "you" (same system as desktop) */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {CHIPS.map((c, i) => (
              <line
                key={i}
                data-m-link
                className="tether-shimmer"
                style={{ animationDelay: `${i * 0.4}s` }}
                x1={c.x}
                y1={c.y}
                x2={50}
                y2={50}
                stroke="rgba(155,230,232,0.34)"
                strokeWidth="0.4"
                strokeDasharray="1.4 1.3"
              />
            ))}
          </svg>
          <div className="relative flex h-full items-center justify-center">
            <div data-m-orb className="relative z-[2]">
              <div className="orb-pulse glass-device liquid-rim flex h-24 w-24 items-center justify-center rounded-full p-2">
                <HumanAvatar index={2} className="h-full w-full" />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-hi px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#06100F] shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                you
              </span>
            </div>
            <div className="absolute inset-0">
              {PLATFORMS.map((p, i) => (
                <span
                  key={p}
                  data-m-chip
                  className="glass-chip absolute flex h-11 w-11 items-center justify-center"
                  style={{ left: CHIPS[i].left, top: CHIPS[i].top }}
                >
                  <PlatformLogo platform={p} className="relative h-5 w-5" />
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-12">
          {beats.map((b, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p className="text-[clamp(26px,6vw,38px)] font-bold leading-[1.15] tracking-tight">
                {b.line}
              </p>
              <p className="mt-3 max-w-[38ch] text-[17px] font-medium text-ink-dim">{b.sub}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
