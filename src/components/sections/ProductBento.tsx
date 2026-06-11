import {
  CreditCard,
  Flame,
  GraduationCap,
  Newspaper,
  Radio,
  Smartphone,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { LoopMock, type SceneVariant } from "@/components/fx/mocks";
import Reveal from "@/components/fx/Reveal";
import TiltSpotlight from "@/components/fx/TiltSpotlight";
import { copy } from "@/lib/copy";
import { getScreenshots, type ScreenshotKey } from "@/lib/screenshots";

type TileMeta = { span: string; icon: LucideIcon; loop: SceneVariant; tilt?: number };

// v14 §2: a clean 6-col grid that tiles in three full rows with NO fixed row
// height and NO row-span — every cell sizes to its content, so a real
// screenshot can never be guillotined. Each tile is backed by a real in-app
// capture (resolved in screenshots.ts); the designed scene is the fallback.
// (feeds | live) · (courses | streak | leaderboard) · (membership | mobile).
const META: Record<string, TileMeta> = {
  feeds: { span: "lg:col-span-3", icon: Newspaper, loop: "feed", tilt: 6 },
  live: { span: "lg:col-span-3", icon: Radio, loop: "live" },
  courses: { span: "lg:col-span-2", icon: GraduationCap, loop: "courses" },
  streak: { span: "lg:col-span-2", icon: Flame, loop: "streak" },
  leaderboard: { span: "lg:col-span-2", icon: Trophy, loop: "leaderboard" },
  membership: { span: "lg:col-span-3", icon: CreditCard, loop: "membership" },
  mobile: { span: "lg:col-span-3", icon: Smartphone, loop: "mobile" },
};

const ORDER = [
  "feeds",
  "live",
  "courses",
  "streak",
  "leaderboard",
  "membership",
  "mobile",
] as const;

/**
 * Active bento grid. Loop surfaces show designed scenes; each tile carries one
 * living micro-interaction (v14 §3): feeds tilts in 3D, every tile reveals a
 * cursor spotlight, and the scenes animate their own state (live ping,
 * equaliser, scroll-driven meter fills, looping in-app notifications).
 */
export default function ProductBento() {
  const c = copy.product;
  const byKey = Object.fromEntries(c.tiles.map((t) => [t.key, t]));
  // Each scene variant ("feed" | "live" | … | "mobile") is also a screenshot
  // key, so a dropped-in file for that tile resolves directly.
  const shots = getScreenshots();

  return (
    <section
      id="product"
      aria-labelledby="product-heading"
      className="band glow-anchor py-24 md:py-[120px] [--glow-x:22%]"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <Reveal as="p" className="eyebrow">
          {c.eyebrow}
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="product-heading" className="text-section mt-4 max-w-[20ch]">
            {c.heading}
          </h2>
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-4 max-w-[30ch] text-[clamp(20px,2.3vw,27px)] font-semibold leading-snug tracking-tight">
          One product replaces the nine tools you&apos;re duct-taping together —{" "}
          <span className="font-medium text-ink-dim">on your brand, on web and mobile.</span>
        </Reveal>

        {/* base: 1-up · tablet (sm–lg): clean 2-up · desktop (lg+): 6-col bento.
            The designed col-spans only kick in at lg, so tablet never inherits
            the cramped third-width desktop cells (intrinsic-ish tablet tier). */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {ORDER.map((key, i) => {
            const t = byKey[key];
            const m = META[key];
            const Icon = m.icon;
            const isMobile = m.loop === "mobile";
            return (
              <Reveal key={key} delay={(i % 2) * 0.08} className={m.span}>
                <TiltSpotlight
                  tabIndex={0}
                  tilt={m.tilt ?? 0}
                  className={`raised group relative flex h-full p-6 transition-[transform,border-color,background,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-card-hover hover:shadow-[var(--shadow-raise-lg),0_30px_60px_-30px_rgba(72,166,167,0.3)] focus-visible:-translate-y-0.5 focus-visible:border-white/[0.14] focus-visible:bg-card-hover ${
                    isMobile ? "flex-col gap-5 lg:flex-row lg:items-center" : "flex-col"
                  }`}
                >
                  <div className={isMobile ? "lg:flex-1" : undefined}>
                    <h3 className="flex items-center gap-3 text-lg font-bold tracking-tight">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-teal/12 text-teal-hi shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-transform duration-200 ease-out group-hover:rotate-3"
                        aria-hidden="true"
                      >
                        <Icon size={17} strokeWidth={1.8} />
                      </span>
                      {t.title}
                    </h3>
                    <p className="mt-2.5 max-w-[42ch] text-[14.5px] leading-relaxed text-ink-dim">
                      {t.body}
                    </p>
                  </div>
                  <div
                    className={`glass-sheen mt-4 overflow-hidden rounded-xl border border-hairline bg-[rgba(8,10,9,0.5)] opacity-90 transition-opacity duration-300 group-hover:opacity-100 ${
                      isMobile
                        ? "flex w-full items-center justify-center lg:mt-0 lg:w-[280px] lg:shrink-0"
                        : "min-h-[150px] flex-1"
                    }`}
                  >
                    <LoopMock variant={m.loop} screenshot={shots[m.loop as ScreenshotKey]} />
                  </div>
                </TiltSpotlight>
              </Reveal>
            );
          })}
        </div>

        <Reveal as="p" delay={0.1} className="mt-10 text-center text-lg font-medium text-ink-dim">
          {c.tail}
        </Reveal>
      </div>
    </section>
  );
}
