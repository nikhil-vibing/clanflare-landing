"use client";

import PlatformLogo, {
  PLATFORM_ORDER,
  platformLabel,
  type Platform,
} from "@/components/brand/PlatformLogo";
import { KeyRound, Lock } from "lucide-react";
import { useRef } from "react";
import { HumanAvatar } from "@/components/fx/mocks";
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

// Mobile/tablet ring: the desktop CHIPS layout was tuned for a wide stage and
// falls apart on a narrow one (chips clip at the edge, tethers miss them). Here
// the 6 captors sit on a symmetric ring around "you" (center 50,50). Each point
// is BOTH the chip's centre and the tether endpoint, so a line can never dangle
// to an empty corner. Radius kept at 32% so chips never reach the clipped edge,
// and the bottom-centre gap (no chip at 90°) leaves room for the "you" badge.
const M_CHIPS = [
  { x: 66, y: 22 }, // youtube  — upper right
  { x: 82, y: 50 }, // instagram — right
  { x: 66, y: 78 }, // discord  — lower right
  { x: 34, y: 78 }, // patreon  — lower left
  { x: 18, y: 50 }, // tiktok   — left
  { x: 34, y: 22 }, // x        — upper left
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

      // <1024px (phone + tablet) + motion: a LIGHTER, NON-PINNED reveal that
      // tells the SAME three acts as the desktop pin, each scroll-TRIGGERED on
      // enter (Apple/Pudding mobile pattern — never pin-scrub, which fights the
      // address bar). Act 1 the captive constellation assembles; Act 2 the reach
      // bars crater + members lock out; Act 3 the branded-app payoff snaps in.
      // No pin, transform/opacity only — so the mobile address-bar resize bug
      // can't apply and it stays cheap on low-power devices.
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          const q = gsap.utils.selector(ref);
          const stage = q<HTMLElement>("[data-m-stage]")[0];
          if (!stage) return;
          const orb = q<HTMLElement>("[data-m-orb]");
          const chips = q<HTMLElement>("[data-m-chip]");
          const chipFloats = q<HTMLElement>("[data-m-chip-float]");
          const links = q<SVGLineElement>("[data-m-link]");

          // Centre the orb + chips on their anchor points via GSAP transforms,
          // NOT a Tailwind translate — the assemble/idle tweens write to
          // transform and would otherwise clobber a utility translate and shove
          // every node off its anchor (which is exactly what broke the mobile
          // render: chips landed at the edge and clipped).
          gsap.set(orb, { xPercent: -50, yPercent: -50 });
          gsap.set(chips, { xPercent: -50, yPercent: -50 });

          // idle float on the chip INNERS so the captive ring breathes — a
          // separate element from the assemble target (mirrors the desktop
          // scene) so the two tweens never fight over the same transform.
          chipFloats.forEach((el, i) => {
            gsap.to(el, {
              y: -5,
              duration: 2.6 + (i % 3) * 0.4,
              yoyo: true,
              repeat: -1,
              ease: "sine.inOut",
              delay: i * 0.3,
            });
          });

          // assemble-in as the stage scrolls into view: orb pops, tethers draw,
          // then the platform chips snap onto the ring. Reverses on scroll-up.
          gsap
            .timeline({
              scrollTrigger: {
                trigger: stage,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            })
            .from(orb, { autoAlpha: 0, scale: 0.5, duration: 0.5, ease: "back.out(1.6)" })
            .from(links, { autoAlpha: 0, duration: 0.4, stagger: 0.06 }, "<+0.1")
            .from(
              chips,
              { autoAlpha: 0, scale: 0.4, stagger: 0.07, duration: 0.5, ease: "back.out(1.6)" },
              "<"
            );

          // ACT 2 — the trap springs. The reach bars climb then crater and the
          // "locked out" chip snaps in as this card scrolls up: the algorithm
          // burying your reach, made literal.
          const trap = q<HTMLElement>("[data-m-trap]")[0];
          if (trap) {
            const bars = q<HTMLElement>("[data-m-bar]");
            const lock = q<HTMLElement>("[data-m-lock]");
            const drop = q<HTMLElement>("[data-m-drop]");
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: trap,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              })
              .from(bars, {
                scaleY: 0,
                transformOrigin: "50% 100%",
                stagger: 0.06,
                duration: 0.5,
                ease: "power2.out",
              })
              .from(lock, { autoAlpha: 0, scale: 0.6, y: -6, duration: 0.4, ease: "back.out(1.7)" }, "<+0.25")
              .from(drop, { autoAlpha: 0, x: -8, duration: 0.4 }, "<");
          }

          // ACT 3 — you own it. The branded app frame assembles, members pop in,
          // the key turns, and the payoff stats rise: the resolution the desktop
          // scene earns, now told on mobile too.
          const own = q<HTMLElement>("[data-m-own]")[0];
          if (own) {
            const frame = q<HTMLElement>("[data-m-own-frame]");
            const members = q<HTMLElement>("[data-m-own-member]");
            const key = q<HTMLElement>("[data-m-own-key]");
            const stats = q<HTMLElement>("[data-m-own-stat]");
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: own,
                  start: "top 78%",
                  toggleActions: "play none none reverse",
                },
              })
              .from(frame, { autoAlpha: 0, scale: 0.86, y: 20, duration: 0.55, ease: "back.out(1.3)" })
              .from(members, { autoAlpha: 0, scale: 0.4, stagger: 0.06, duration: 0.4, ease: "back.out(1.7)" }, "<+0.2")
              .from(key, { rotate: -90, autoAlpha: 0, duration: 0.4 }, "<")
              .from(stats, { autoAlpha: 0, y: 14, stagger: 0.08, duration: 0.4, ease: "power2.out" }, "<+0.1");
          }
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

      {/* ===== stacked 3-act story (phone / tablet / reduced motion) =====
          Below 1024px (or reduced motion) this replaces the pinned scene. The
          desktop tells a pinned 3-beat story; on touch we tell the SAME three
          acts as scroll-TRIGGERED reveals (the Apple/Pudding mobile pattern —
          reveal-on-enter, never pin-scrub, which fights the address bar). Every
          beat is PAIRED with its own visual so the message lands instead of
          three naked paragraphs. The orb/chips carry a CSS -translate fallback
          so the constellation still centres under reduced motion (no GSAP). */}
      <div className="mx-auto max-w-[600px] px-6 py-20 md:px-10 lg:motion-safe:hidden">
        <p className="eyebrow">The tenant trap</p>

        {/* ---- ACT 1 · captive — you, tethered to six platforms ---- */}
        <div className="mt-8">
          <div
            data-m-stage
            aria-hidden="true"
            className="relative aspect-square overflow-hidden rounded-3xl border border-hairline-2 bg-surface sm:aspect-[5/4]"
          >
            <div className="dot-grid absolute inset-0 opacity-70" />
            {/* tethers: each chip on the ring → "you" at the centre */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {M_CHIPS.map((c, i) => (
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
            {/* the creator, dead centre */}
            <div data-m-orb className="absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
              <div className="orb-pulse glass-device liquid-rim flex h-20 w-20 items-center justify-center rounded-full p-2 shadow-[0_0_38px_rgba(72,166,167,0.4)] sm:h-24 sm:w-24">
                <HumanAvatar index={2} className="h-full w-full" />
              </div>
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal-hi px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#06100F] shadow-[0_4px_14px_rgba(0,0,0,0.45)]">
                you
              </span>
            </div>
            {/* captor chips — anchored on the ring, each centred on its point */}
            {PLATFORMS.map((p, i) => (
              <span
                key={p}
                data-m-chip
                className="absolute z-[3] block -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${M_CHIPS[i].x}%`, top: `${M_CHIPS[i].y}%` }}
              >
                <span
                  data-m-chip-float
                  className="glass-chip flex h-11 w-11 items-center justify-center shadow-[var(--shadow-raise)]"
                  aria-label={platformLabel(p)}
                >
                  <PlatformLogo platform={p} className="relative h-5 w-5" />
                </span>
              </span>
            ))}
          </div>
          <div className="mt-7">
            <p className="text-[clamp(25px,6.2vw,33px)] font-bold leading-[1.16] tracking-tight">
              {beats[0].line}
            </p>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-ink-dim">{beats[0].sub}</p>
          </div>
        </div>

        {/* ---- ACT 2 · the trap springs — reach craters, members locked ---- */}
        <div className="mt-16">
          <div
            data-m-trap
            aria-hidden="true"
            className="relative overflow-hidden rounded-3xl border border-hairline-2 bg-surface p-6"
          >
            <div className="dot-grid absolute inset-0 opacity-50" />
            <div className="relative flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-faint">
                Your reach
              </p>
              <span
                data-m-lock
                className="glass-chip flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold"
                style={{ color: "#F0A8A2" }}
              >
                <Lock size={12} />
                members locked out
              </span>
            </div>
            <div className="relative mt-5 flex h-28 items-end gap-1.5">
              {[88, 96, 74, 80, 46, 27, 15, 9].map((h, i) => (
                <span
                  key={i}
                  data-m-bar
                  className="flex-1 rounded-t-[3px]"
                  style={{
                    height: `${h}%`,
                    background:
                      i >= 4
                        ? "linear-gradient(to top, rgba(214,90,80,0.22), rgba(240,130,120,0.82))"
                        : "linear-gradient(to top, rgba(72,166,167,0.22), rgba(95,201,202,0.78))",
                  }}
                />
              ))}
            </div>
            <div className="relative mt-3 flex items-center justify-between text-[12px]">
              <span className="text-ink-faint">12 months on rented land</span>
              <span data-m-drop className="font-bold" style={{ color: "#F0A8A2" }}>
                −91% reach
              </span>
            </div>
          </div>
          <div className="mt-7">
            <p className="text-[clamp(25px,6.2vw,33px)] font-bold leading-[1.16] tracking-tight">
              {beats[1].line}
            </p>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-ink-dim">{beats[1].sub}</p>
          </div>
        </div>

        {/* ---- ACT 3 · you own it — branded app + the payoff ---- */}
        <div className="mt-16">
          <div
            data-m-own
            aria-hidden="true"
            className="relative overflow-hidden rounded-3xl border border-teal-hi/20 bg-surface p-5 shadow-[0_30px_70px_-40px_rgba(72,166,167,0.5)]"
          >
            <div className="dot-grid absolute inset-0 opacity-40" />
            {/* branded app frame */}
            <div data-m-own-frame className="glass-device relative rounded-2xl">
              <div className="flex items-center gap-2.5 border-b border-white/5 px-4 py-3">
                <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-hi to-teal shadow-[0_0_14px_rgba(72,166,167,0.5)]" />
                <div className="leading-none">
                  <p className="text-[12px] font-black tracking-tight text-ink">Yourbrand</p>
                  <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-ink-faint">
                    community
                  </p>
                </div>
                <span
                  data-m-own-key
                  className="glass-chip ml-auto flex h-8 w-8 items-center justify-center text-teal-hi"
                >
                  <KeyRound size={15} />
                </span>
              </div>
              <div className="flex items-center px-4 py-3.5">
                <div className="flex -space-x-2.5">
                  {[0, 1, 3, 4, 5].map((idx, i) => (
                    <span key={i} data-m-own-member>
                      <HumanAvatar index={idx} className="h-8 w-8 ring-2 ring-[#0c0e0d]" />
                    </span>
                  ))}
                </div>
                <span className="ml-3 text-[12.5px] font-semibold text-ink-dim">
                  12.4k members · yours
                </span>
              </div>
            </div>
            {/* the payoff — the credibility stats the desktop scene earns */}
            <div className="relative mt-4 space-y-2">
              {copy.credibility.proof.map((s) => (
                <div
                  key={s.l}
                  data-m-own-stat
                  className="raised flex items-center justify-between gap-3 rounded-xl px-4 py-2.5"
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                    {s.l}
                  </span>
                  <span className="text-[14.5px] font-black tracking-tight text-teal-hi">{s.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-7">
            <p className="text-[clamp(25px,6.2vw,33px)] font-bold leading-[1.16] tracking-tight">
              {beats[2].line}
            </p>
            <p className="mt-3 text-[17px] font-medium leading-relaxed text-ink-dim">{beats[2].sub}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
