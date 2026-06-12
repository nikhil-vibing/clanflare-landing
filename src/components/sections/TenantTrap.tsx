"use client";

import { Flag, KeyRound, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useRef, type CSSProperties } from "react";
import PlatformLogo, { PLATFORM_ORDER } from "@/components/brand/PlatformLogo";
import { HumanAvatar } from "@/components/fx/mocks";
import { copy } from "@/lib/copy";
import { Flip, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// v19 "Gather the clan": real people — not platform chips — scatter on faded
// rented ground, then migrate and coalesce into one owned home. A flag plants.
const MEMBERS = [
  { name: "Maya", i: 0 },
  { name: "Arjun", i: 1 },
  { name: "Nora", i: 2 },
  { name: "Dev", i: 3 },
  { name: "Priya", i: 4 },
  { name: "Omar", i: 5 },
] as const;

// loose constellation orbiting the owned home — clear of the frame, its panel,
// and the metrics in the resting (pre-scroll / reduced-motion) state.
const SCATTER = [
  { left: "12%", top: "6%", rotate: "-7deg" },
  { left: "50%", top: "2%", rotate: "4deg" },
  { left: "86%", top: "9%", rotate: "-5deg" },
  { left: "84%", top: "90%", rotate: "6deg" },
  { left: "15%", top: "92%", rotate: "-6deg" },
  { left: "52%", top: "95%", rotate: "3deg" },
] as const;

const OWNED_METRICS = [
  { label: "members", value: "12.4k" },
  { label: "direct reach", value: "91%" },
  { label: "revenue owned", value: "100%" },
] as const;

type ScatterStyle = CSSProperties & {
  "--scatter-left": string;
  "--scatter-top": string;
  "--scatter-rotate": string;
};

function MemberCard({ name, i }: { name: string; i: number }) {
  const scatter = SCATTER[i];
  return (
    <span
      data-gather-card
      className="gather-card z-[5] block"
      style={
        {
          "--scatter-left": scatter.left,
          "--scatter-top": scatter.top,
          "--scatter-rotate": scatter.rotate,
        } as ScatterStyle
      }
    >
      <span className="glass-chip flex min-h-[46px] items-center gap-2.5 py-1.5 pl-1.5 pr-4 text-[13px] font-bold text-ink shadow-[var(--shadow-raise)]">
        <HumanAvatar index={i} className="h-9 w-9 shrink-0" />
        <span className="relative whitespace-nowrap">{name}</span>
      </span>
    </span>
  );
}

function OwnedFrame({ draggable = false }: { draggable?: boolean }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      data-owned-frame
      drag={draggable && !reduced}
      dragElastic={0.2}
      dragMomentum={false}
      whileDrag={draggable && !reduced ? { scale: 1.015 } : undefined}
      className="relative mx-auto min-h-[400px] w-full max-w-[610px] cursor-grab active:cursor-grabbing"
      aria-hidden="true"
    >
      <div
        data-frame-shell
        className="glass-device absolute inset-0 rounded-[28px] shadow-[var(--shadow-stage),0_46px_110px_-58px_rgba(0,0,0,0.58)]"
      />

      <div className="relative z-[2] p-4 sm:p-5">
        <div className="flex items-center gap-3 border-b border-hairline pb-4">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal text-[#103330] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            <ShieldCheck size={18} strokeWidth={2.1} aria-hidden="true" />
          </span>
          <div className="min-w-0 leading-none">
            <p className="text-[13px] font-black tracking-wide text-ink">Yourbrand</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
              owned community home
            </p>
          </div>
          {/* the flag plants when the clan is gathered */}
          <span
            data-flag
            className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-teal/16 text-teal-hi"
          >
            <Flag size={17} strokeWidth={2.2} aria-hidden="true" />
          </span>
          <span
            data-owned-chip
            className="glass-chip hidden items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-teal-hi sm:flex"
          >
            <KeyRound size={14} aria-hidden="true" />
            your keys
          </span>
        </div>

        {/* the empty slots are filled only by the desktop GSAP Flip (≥1024px);
            on mobile the members render in the chip row below, so hide them here
            to avoid 6 empty boxes (design audit P0). */}
        {draggable && (
          <>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-teal-hi">
              Your clan, gathered
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {MEMBERS.map((m) => (
                <span key={m.name} data-gather-slot className="gather-slot min-h-[46px] min-w-0" />
              ))}
            </div>
          </>
        )}

        <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {OWNED_METRICS.map((m) => (
            <div
              key={m.label}
              data-owned-metric
              className="glass-panel rounded-2xl px-4 py-3"
            >
              <span className="block text-[9px] font-bold uppercase tracking-wider text-ink-faint">
                {m.label}
              </span>
              <span className="mt-1 block font-display text-[24px] font-black leading-none text-teal-hi tabular-nums">
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * The Gather — v19's single signature moment ("Gather the clan / raise your
 * flag"). Desktop gets one pinned, scrub-driven GSAP Flip convergence: real
 * member cards scatter across faded rented ground, migrate into one owned home,
 * and a flag plants. Touch/reduced-motion render the resolved story statically.
 */
export default function TenantTrap() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      document.fonts.ready.then(() => ScrollTrigger.refresh());

      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const q = gsap.utils.selector(ref);
          const scene = q<HTMLElement>("[data-gather-scene]")[0];
          const scatterShell = q<HTMLElement>("[data-scatter-shell]")[0];
          if (!scene || !scatterShell) return;

          // Scope every target to the desktop scene (the mobile block renders a
          // SECOND OwnedFrame; querying the section would double the slot count).
          const cards = gsap.utils.toArray<HTMLElement>(
            scatterShell.querySelectorAll("[data-gather-card]")
          );
          const slots = gsap.utils.toArray<HTMLElement>(
            scene.querySelectorAll("[data-gather-slot]")
          );
          const frameShell = gsap.utils.toArray<HTMLElement>(
            scene.querySelectorAll("[data-frame-shell]")
          );
          const ownedChips = gsap.utils.toArray<HTMLElement>(
            scene.querySelectorAll("[data-owned-chip]")
          );
          const metrics = gsap.utils.toArray<HTMLElement>(
            scene.querySelectorAll("[data-owned-metric]")
          );
          const flag = gsap.utils.toArray<HTMLElement>(
            scene.querySelectorAll("[data-flag]")
          );
          const rented = gsap.utils.toArray<HTMLElement>(
            scene.querySelectorAll("[data-rented]")
          );

          if (cards.length === 0 || cards.length !== slots.length) return;

          gsap.set(frameShell, { autoAlpha: 0.34, scale: 0.96 });
          gsap.set(ownedChips, { autoAlpha: 0, y: 12 });
          gsap.set(metrics, { autoAlpha: 0, y: 12 });
          gsap.set(flag, { autoAlpha: 0, y: 10, scale: 0.6, transformOrigin: "bottom left" });
          gsap.set(rented, { autoAlpha: 0.5 });

          const state = Flip.getState(cards);
          cards.forEach((card, i) => {
            card.classList.add("is-owned");
            slots[i]?.appendChild(card);
          });

          const flip = Flip.from(state, {
            absolute: true,
            scale: true,
            nested: true,
            stagger: 0.045,
            duration: 1,
            ease: "none",
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: scene,
              start: "top top",
              end: "+=180%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          tl.add(flip, 0.05)
            .to(rented, { autoAlpha: 0.12, filter: "grayscale(1)", duration: 0.8 }, 0.12)
            .to(frameShell, { autoAlpha: 1, scale: 1, duration: 0.65 }, 0.26)
            .to(ownedChips, { autoAlpha: 1, y: 0, duration: 0.28 }, 0.74)
            .to(metrics, { autoAlpha: 1, y: 0, stagger: 0.05, duration: 0.3 }, 0.8)
            .to(flag, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34 }, 0.86)
            .to({}, { duration: 0.22 });

          return () => {
            tl.kill();
            flip.kill();
            cards.forEach((card) => {
              card.classList.remove("is-owned");
              scatterShell.appendChild(card);
            });
          };
        }
      );
    },
    { scope: ref }
  );

  const beats = copy.trap.beats;

  return (
    <section
      ref={ref}
      id="trap"
      aria-labelledby="trap-heading"
      className="anchor-band band relative overflow-hidden"
    >
      <h2 id="trap-heading" className="sr-only">
        The Gather
      </h2>

      <div
        data-gather-scene
        className="relative hidden min-h-[100svh] items-center overflow-hidden lg:motion-safe:flex"
      >
        <div className="dot-grid absolute inset-0 opacity-80" />
        <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-14 px-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="relative z-[3]">
            <p className="eyebrow">The Gather</p>
            <p className="font-display mt-8 max-w-[13ch] text-[clamp(40px,4.8vw,68px)] font-black leading-[1.02]">
              Scattered people become one <span className="own-word">owned</span> home.
            </p>
            <p className="mt-6 max-w-[39ch] text-lg font-medium leading-relaxed text-ink-dim">
              Your people are scattered across borrowed ground — Discord, Patreon, social feeds,
              algorithms that keep the keys. Clanflare gathers your clan, your data, and your revenue
              into one home you own, then you plant your flag.
            </p>
          </div>

          <div className="relative min-h-[600px]">
            {/* faded rented ground — the borrowed platforms your people are stuck on */}
            <div data-rented className="pointer-events-none absolute inset-0 z-[1]">
              {PLATFORM_ORDER.map((p, i) => (
                <span
                  key={p}
                  className="absolute opacity-40 grayscale"
                  style={{
                    left: `${[8, 70, 40, 88, 20, 58][i]}%`,
                    top: `${[34, 22, 64, 50, 70, 40][i]}%`,
                  }}
                >
                  <PlatformLogo platform={p} monochrome className="h-6 w-6 text-ink-faint" />
                </span>
              ))}
            </div>
            <div data-scatter-shell className="absolute inset-0 z-[5]">
              {MEMBERS.map((m) => (
                <MemberCard key={m.name} name={m.name} i={m.i} />
              ))}
            </div>
            <div className="absolute inset-0 z-[2] rounded-[48px] bg-[radial-gradient(58%_58%_at_50%_50%,rgba(220,232,229,0.16),transparent_72%)]" />
            <div className="relative z-[3] flex min-h-[600px] items-center">
              <OwnedFrame draggable />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[680px] px-6 pb-20 pt-36 md:px-10 lg:motion-safe:hidden">
        <p className="eyebrow">The Gather</p>
        <h3 className="font-display mt-5 text-[clamp(40px,10vw,70px)] font-black leading-[1.02]">
          Scattered people gather into one home you <span className="own-word">own.</span>
        </h3>
        <p className="mt-5 text-lg font-medium leading-relaxed text-ink-dim">
          {beats[0].sub} {beats[2].sub}
        </p>

        <div className="mt-10">
          <OwnedFrame />
          <div className="mt-9 flex flex-wrap gap-2.5">
            {MEMBERS.map((m) => (
              <span
                key={m.name}
                className="glass-chip flex min-h-[44px] items-center gap-2 py-1.5 pl-1.5 pr-3.5 text-[12.5px] font-bold text-ink"
              >
                <HumanAvatar index={m.i} className="h-8 w-8" />
                {m.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
