import Image from "next/image";
import { Bell, Heart, MessageCircle, Play, Share2, UserPlus } from "lucide-react";
import type { ReactElement } from "react";
import PlatformLogo, { PLATFORM_ORDER, type Platform } from "@/components/brand/PlatformLogo";

/**
 * v13 finished product visuals + v14 containment & living micro-interactions.
 *
 * §6 (v13): the mini-scenes show real micro-content (real sample faces,
 * believable post copy, believable numbers) instead of skeleton bars.
 *
 * §2/§3 (v14): nothing is locked to a hard pixel height that could guillotine
 * its content — frames size to their content, the phone pins its nav while its
 * own feed scrolls under it, and grid/flex children carry min-h-0 / min-w-0 so
 * intrinsic content can't overflow its track. Each scene carries exactly one
 * meaningful, transform/opacity-only loop (auto-disabled under reduced motion).
 *
 * Human photos here are sample in-product/community people, not customer
 * endorsements. Testimonial/proof identities never use a synthetic face — see
 * Proof.tsx for the honest evidence-card treatment.
 */

export type SceneVariant =
  | "feed"
  | "live"
  | "courses"
  | "membership"
  | "streak"
  | "leaderboard"
  | "mobile";

const PEOPLE = [
  { name: "Maya Singh", role: "member", src: "/assets/people/maya.jpg" },
  { name: "Arjun Mehta", role: "member", src: "/assets/people/arjun.jpg" },
  { name: "Nora Lewis", role: "host", src: "/assets/people/nora.jpg" },
  { name: "Dev Rao", role: "mentor", src: "/assets/people/dev.jpg" },
  { name: "Priya Nair", role: "member", src: "/assets/people/priya.jpg" },
  { name: "Omar Khan", role: "member", src: "/assets/people/omar.jpg" },
] as const;

// Sample in-product posts — ambient community content, never customer claims.
type Post = {
  person: number;
  text: string;
  media?: boolean;
  dur?: string;
  likes: number;
  comments: number;
};
const POSTS: Post[] = [
  { person: 0, text: "Week 3 lesson is live — replay's inside.", media: true, dur: "12:04", likes: 214, comments: 38 },
  { person: 2, text: "Live AMA tonight at 7. Drop your questions 👇", likes: 96, comments: 24 },
  { person: 4, text: "New members — say hi over in #welcome 👋", likes: 142, comments: 51 },
  { person: 3, text: "Cohort sold out. Doors reopen next month.", likes: 308, comments: 12 },
];

const AVATAR_TONES = [
  "linear-gradient(135deg,#5FC9CA,#3B8788)",
  "linear-gradient(135deg,#8BC7BB,#517C72)",
  "linear-gradient(135deg,#C4D7D5,#6E918A)",
  "linear-gradient(135deg,#48A6A7,#2E6B6C)",
  "linear-gradient(135deg,#A7B8FF,#48517A)",
];

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function InitialsAvatar({
  name,
  tone = 0,
  className = "h-11 w-11 text-sm",
}: {
  name: string;
  tone?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`liquid-rim flex shrink-0 items-center justify-center rounded-full font-bold text-[#06100F] ${className}`}
      style={{ background: AVATAR_TONES[tone % AVATAR_TONES.length] }}
    >
      {initials(name)}
    </span>
  );
}

export function HumanAvatar({
  index = 0,
  className = "h-9 w-9",
  priority = false,
}: {
  index?: number;
  className?: string;
  priority?: boolean;
}) {
  const person = PEOPLE[index % PEOPLE.length];

  return (
    <span
      className={`liquid-rim relative block shrink-0 overflow-hidden rounded-full border border-white/20 bg-card ${className}`}
      title={`${person.name}, sample ${person.role}`}
    >
      <Image
        src={person.src}
        alt=""
        width={96}
        height={96}
        sizes="48px"
        priority={priority}
        className="h-full w-full object-cover"
      />
    </span>
  );
}

function AvatarStack({ count = 5, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`flex -space-x-2 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <HumanAvatar key={i} index={i} className="h-8 w-8 ring-2 ring-[#111614]" />
      ))}
    </div>
  );
}

/** Slim labelled progress track. The fill grows as it scrolls into view. */
function Meter({ pct, teal = true }: { pct: number; teal?: boolean }) {
  return (
    <span className="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-white/10" aria-hidden="true">
      <span
        className={`meter-fill block h-full rounded-full ${teal ? "bg-teal-hi" : "bg-white/35"}`}
        style={{ width: `${pct}%` }}
      />
    </span>
  );
}

/** Vertical equaliser bar — loops (live) or rises once on view (analytics). */
function VBar({
  h,
  i,
  mode = "rise",
  teal = "bg-teal-hi/65",
}: {
  h: number;
  i: number;
  mode?: "eq" | "rise";
  teal?: string;
}) {
  return (
    <span
      className={`${mode === "eq" ? "eq-bar" : "bar-rise"} block w-full rounded-full ${teal}`}
      style={{ height: `${h}%`, animationDelay: mode === "eq" ? `${(i % 5) * 0.12}s` : `${i * 0.04}s` }}
    />
  );
}

function LiveBadge({ label = "live" }: { label?: string }) {
  return (
    <span className="live-dot relative flex items-center gap-1.5 rounded-full bg-teal-hi px-2.5 py-1 text-[9px] font-black uppercase text-[#06100F]">
      <i className="h-1.5 w-1.5 rounded-full bg-[#06100F]" />
      {label}
    </span>
  );
}

function Reaction({ icon: Icon, count }: { icon: typeof Heart; count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink-faint">
      <Icon size={11} strokeWidth={2} className="text-ink-dim" aria-hidden="true" />
      {count}
    </span>
  );
}

function TinyMetric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="glass-panel min-w-0 rounded-xl px-3 py-2">
      <p className={`text-[15px] font-black leading-none ${accent ? "text-teal-hi" : "text-ink"}`}>
        {value}
      </p>
      <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-ink-faint">
        {label}
      </p>
    </div>
  );
}

function FeedCard({ post = 0 }: { post?: number }) {
  const p = POSTS[post % POSTS.length];
  const author = PEOPLE[p.person % PEOPLE.length];

  return (
    <div className="glass-panel rounded-xl p-3">
      <div className="relative flex items-center gap-2.5">
        <HumanAvatar index={p.person} className="h-7 w-7" />
        <div className="min-w-0 flex-1 leading-none">
          <p className="truncate text-[11px] font-bold text-ink">{author.name}</p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-ink-faint">
            {author.role} · 2h
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/8 px-2 py-1 text-[9px] font-bold text-teal-hi">
          owned
        </span>
      </div>
      <p className="mt-2.5 text-[11.5px] leading-snug text-ink-dim">{p.text}</p>
      {p.media && (
        <div className="relative mt-3 h-16 overflow-hidden rounded-lg border border-teal-hi/20 bg-[radial-gradient(80%_90%_at_30%_20%,rgba(95,201,202,0.34),transparent_65%),linear-gradient(135deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))]">
          <span className="play-pulse absolute left-1/2 top-1/2 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#06100F]/55 text-teal-hi backdrop-blur-[2px]">
            <Play size={12} fill="currentColor" aria-hidden="true" />
          </span>
          <span className="absolute bottom-1.5 right-2 rounded bg-[#06100F]/70 px-1.5 py-0.5 text-[8px] font-bold tabular-nums text-white">
            {p.dur}
          </span>
        </div>
      )}
      <div className="mt-3 flex items-center gap-3.5">
        <Reaction icon={Heart} count={p.likes} />
        <Reaction icon={MessageCircle} count={p.comments} />
        <Share2 size={11} strokeWidth={2} className="ml-auto text-ink-faint" aria-hidden="true" />
      </div>
    </div>
  );
}

/** Looping in-product toast — slides in, holds, slides out (transform/opacity). */
function NotifToast({
  icon: Icon = UserPlus,
  title,
  sub,
  className = "",
}: {
  icon?: typeof UserPlus;
  title: string;
  sub: string;
  className?: string;
}) {
  return (
    <div
      className={`notif-loop glass-panel pointer-events-none flex items-center gap-2.5 rounded-xl px-3 py-2 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.7)] ${className}`}
      aria-hidden="true"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal-hi">
        <Icon size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[10.5px] font-bold text-ink">{title}</p>
        <p className="truncate text-[9px] text-ink-faint">{sub}</p>
      </div>
    </div>
  );
}

function PlatformImportCloud({ compact = false }: { compact?: boolean }) {
  const items: Platform[] = compact ? ["youtube", "instagram", "discord"] : PLATFORM_ORDER;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Sample social platforms">
      {items.map((platform) => (
        <span
          key={platform}
          className="glass-chip z-[1] flex h-8 w-8 items-center justify-center text-white/90"
        >
          <PlatformLogo platform={platform} className="relative h-3.5 w-3.5" />
        </span>
      ))}
    </div>
  );
}

/**
 * Real-screenshot slot. The device chrome (browser bar / phone bezel) stays in
 * the parent; this fills the inner area with the image. The aspect ratio is
 * locked so the frame can't shift while the image loads (CLS gate) and so a
 * correctly-sized capture fills it with no crop. object-top keeps the app
 * header anchored if a capture is slightly tall.
 */
function DeviceShot({
  src,
  alt,
  ratio,
  priority = false,
  sizes,
  rounded = "",
}: {
  src: string;
  alt: string;
  /** tailwind aspect utility, e.g. "aspect-[16/10]" */
  ratio: string;
  priority?: boolean;
  sizes: string;
  rounded?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden ${ratio} ${rounded}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-top"
      />
    </div>
  );
}

/** Brand lockup — real wordmark, not a skeleton bar. */
function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`liquid-rim rounded-lg bg-gradient-to-br from-teal-hi to-teal ${
          compact ? "h-6 w-6" : "h-7 w-7"
        }`}
      />
      <div className="leading-none">
        <p className="text-[12px] font-black tracking-tight text-ink">Yourbrand</p>
        <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-ink-faint">
          community
        </p>
      </div>
    </div>
  );
}

export function AppMock({
  screenshot,
  priority = false,
}: {
  /** real in-app desktop screenshot; falls back to the designed mock when null */
  screenshot?: string | null;
  priority?: boolean;
}) {
  // Real screenshot drops straight into the browser chrome (kept by the parent).
  if (screenshot) {
    return (
      <DeviceShot
        src={screenshot}
        alt="The Yourbrand community app on the web"
        ratio="aspect-[16/10]"
        priority={priority}
        sizes="(min-width: 768px) 880px, 100vw"
      />
    );
  }

  // No fixed aspect-ratio: the frame sizes to its content so the metric grid
  // ("100% Revenue owned") and live panel can never be clipped (v14 §2).
  return (
    <div className="relative flex w-full overflow-hidden bg-[linear-gradient(160deg,#101412,#090B0A)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_70%_at_74%_8%,rgba(95,201,202,0.16),transparent_62%),radial-gradient(45%_60%_at_15%_85%,rgba(139,126,255,0.08),transparent_68%)]" />

      <aside className="relative hidden w-[20%] flex-col border-r border-white/[0.07] p-4 sm:flex">
        <BrandMark />
        <div className="mt-6 flex flex-col gap-2.5">
          {["Home", "Live", "Courses", "Members", "Data"].map((item, i) => (
            <div
              key={item}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider ${
                i === 0 ? "glass-chip text-teal-hi" : "text-ink-faint"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-sm ${i === 0 ? "bg-teal-hi" : "bg-white/15"}`} />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-ink-faint">
            Importing from
          </p>
          <PlatformImportCloud compact />
        </div>
      </aside>

      <main className="relative grid min-w-0 flex-1 grid-cols-[1fr_0.72fr] gap-3 p-4 max-md:grid-cols-1 md:pr-7">
        <section className="relative flex min-w-0 flex-col gap-3">
          {/* one looping life signal over the feed */}
          <NotifToast
            title="Maya joined your community"
            sub="now · from Instagram"
            className="absolute right-1 top-1 z-[4] w-[68%] max-w-[220px]"
          />
          <div className="glass-panel flex items-center justify-between gap-2 rounded-2xl p-3">
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-widest text-teal-hi">
                Yourbrand community
              </p>
              <p className="mt-1 text-lg font-black leading-none tracking-tight">Owned home</p>
            </div>
            <AvatarStack count={5} />
          </div>
          <FeedCard post={0} />
          <FeedCard post={1} />
        </section>

        <section className="relative hidden min-w-0 flex-col gap-3 md:flex">
          <div className="glass-panel rounded-2xl p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-hi">
                Live room
              </p>
              <LiveBadge />
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2 pt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <HumanAvatar key={i} index={i + 1} className="h-8 w-8" />
              ))}
            </div>
            <div className="mt-4 flex h-10 items-end gap-1.5" aria-hidden="true">
              {[30, 64, 45, 86, 54, 72, 38, 60].map((h, i) => (
                <VBar key={i} h={h} i={i} mode="eq" teal="bg-teal-hi/70" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TinyMetric label="Members" value="12.4k" accent />
            <TinyMetric label="Direct reach" value="91%" />
            <TinyMetric label="Courses" value="18" />
            <TinyMetric label="Revenue owned" value="100%" accent />
          </div>
        </section>
      </main>
    </div>
  );
}

export function PhoneMock({
  screenshot,
  priority = false,
}: {
  /** real in-app phone screenshot; falls back to the designed mock when null */
  screenshot?: string | null;
  priority?: boolean;
}) {
  // Real phone capture fills the bezel (kept by the parent) at the screen ratio.
  if (screenshot) {
    return (
      <DeviceShot
        src={screenshot}
        alt="The Yourbrand community app on iOS and Android"
        ratio="aspect-[9/19]"
        priority={priority}
        sizes="(min-width: 768px) 220px, 60vw"
        rounded="rounded-[22px]"
      />
    );
  }

  // Flex column: header + a flex-1 (min-h-0) feed that clips its OWN overflow
  // like a real screen, and a nav row that is always fully visible (v14 §2).
  return (
    <div className="relative flex aspect-[9/19] w-full flex-col overflow-hidden rounded-[22px] bg-[linear-gradient(170deg,#111514,#080A09)] p-3">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(95,201,202,0.15),transparent_70%)]" />
      <div className="relative flex shrink-0 items-center gap-2">
        <BrandMark compact />
        <span className="glass-chip ml-auto px-2 py-1 text-[8px] font-black text-teal-hi">APP</span>
      </div>

      {/* push notification slides in on a loop */}
      <div className="relative mt-2.5 shrink-0">
        <NotifToast
          icon={Bell}
          title="Live cohort starts in 10 min"
          sub="Yourbrand · push notification"
        />
      </div>

      <div className="relative mt-2.5 flex shrink-0 -space-x-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <HumanAvatar key={i} index={i} className="h-8 w-8 ring-2 ring-[#101412]" />
        ))}
      </div>

      {/* the feed scrolls under the pinned nav — clipping here is by design.
          Text posts only: the video card lives in the desktop mock, so the
          phone reads as a clean, finished feed at small scale (no empty box). */}
      <div className="relative mt-2.5 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        <FeedCard post={2} />
        <FeedCard post={1} />
      </div>

      <div className="relative mt-2.5 flex shrink-0 items-center justify-around border-t border-white/[0.08] pt-2.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-sm ${i === 0 ? "nav-dot bg-teal-hi" : "bg-white/15"}`}
          />
        ))}
      </div>
    </div>
  );
}

function LiveScene() {
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-3 p-4">
      <div className="flex items-center justify-between">
        <AvatarStack count={4} />
        <LiveBadge label="live now" />
      </div>
      <div className="glass-panel flex h-20 items-end gap-1.5 rounded-xl p-3" aria-hidden="true">
        {[26, 66, 42, 92, 58, 78, 36, 70, 48].map((h, i) => (
          <VBar key={i} h={h} i={i} mode="eq" />
        ))}
      </div>
    </div>
  );
}

function CourseScene() {
  const weeks = [
    { label: "Foundations", pct: 100, done: true },
    { label: "Building blocks", pct: 100, done: true },
    { label: "Launch week", pct: 72, done: false },
  ];
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-2.5 p-4">
      {weeks.map((w) => (
        <div key={w.label} className="glass-panel flex items-center gap-3 rounded-xl p-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-teal-hi/30 text-[10px] font-black text-teal-hi">
            {w.done ? "✓" : `${w.pct}%`}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-bold text-ink">{w.label}</p>
            <Meter pct={w.pct} teal={!w.done} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MembershipScene() {
  const tiers = [
    { tier: "Free", members: "4,120", pct: 80 },
    { tier: "Pro", members: "820", pct: 55 },
    { tier: "Inner circle", members: "128", pct: 36 },
  ];
  return (
    <div className="grid h-full min-h-0 grid-cols-2 gap-2 p-4">
      {tiers.map((t, i) => (
        <div
          key={t.tier}
          className={`glass-panel min-w-0 rounded-xl p-3 ${i === 2 ? "col-span-2" : ""}`}
        >
          <p className="truncate text-[10px] font-black uppercase tracking-widest text-teal-hi">
            {t.tier}
          </p>
          <p className="mt-2 text-xl font-black leading-none">{t.members}</p>
          <p className="mt-1 text-[9px] font-medium uppercase tracking-wider text-ink-faint">
            paid members
          </p>
          <Meter pct={t.pct} teal={false} />
        </div>
      ))}
    </div>
  );
}

function StreakScene() {
  // GitHub-style contribution heatmap fallback (real screenshot normally wins).
  const cells = [10, 40, 70, 20, 90, 55, 30, 80, 45, 100, 60, 25, 75, 35, 95, 50, 15, 85, 65, 40, 70, 30, 90, 55, 20, 80, 100, 45];
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-3 p-4">
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black leading-none text-teal-hi">47</p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-faint">
          day streak
        </p>
      </div>
      <div className="grid grid-cols-7 gap-1.5" aria-hidden="true">
        {cells.map((v, i) => (
          <span
            key={i}
            className="aspect-square rounded-[3px]"
            style={{ background: `rgba(95,201,202,${0.12 + (v / 100) * 0.7})` }}
          />
        ))}
      </div>
    </div>
  );
}

function LeaderboardScene() {
  const rows = [
    { i: 1, idx: 2, m: "1,240m" },
    { i: 2, idx: 0, m: "980m" },
    { i: 3, idx: 3, m: "870m" },
  ];
  return (
    <div className="flex h-full min-h-0 flex-col justify-center gap-2.5 p-4">
      {rows.map((r) => (
        <div key={r.i} className="glass-panel flex items-center gap-3 rounded-xl p-2.5">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-teal-hi/30 text-[11px] font-black text-teal-hi">
            {r.i}
          </span>
          <HumanAvatar index={r.idx} className="h-7 w-7" />
          <p className="min-w-0 flex-1 truncate text-[11px] font-bold text-ink">
            {PEOPLE[r.idx].name}
          </p>
          <span className="shrink-0 text-[11px] font-black tabular-nums text-teal-hi">
            {r.m}
          </span>
        </div>
      ))}
    </div>
  );
}

export function LoopMock({
  variant,
  screenshot,
}: {
  variant: SceneVariant;
  /** real in-app screenshot for this tile; falls back to the designed scene */
  screenshot?: string | null;
}) {
  if (variant === "mobile") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(70%_80%_at_50%_30%,rgba(72,166,167,0.14),transparent_70%)] p-3">
        <div className="glass-device flex max-h-full w-[58%] max-w-[150px] flex-col rounded-xl p-2">
          <PhoneMock screenshot={screenshot} />
        </div>
      </div>
    );
  }

  // Real screenshot for a designed scene tile — fills the tile's scene area.
  if (screenshot) {
    return (
      <DeviceShot
        src={screenshot}
        alt={`Yourbrand community app — ${variant}`}
        ratio="aspect-[16/10]"
        sizes="(min-width: 768px) 560px, 100vw"
      />
    );
  }

  const scenes: Record<Exclude<SceneVariant, "mobile">, ReactElement> = {
    feed: (
      <div className="flex h-full min-h-0 w-full flex-col justify-center gap-2 p-4">
        <FeedCard post={0} />
        <FeedCard post={1} />
      </div>
    ),
    live: <LiveScene />,
    courses: <CourseScene />,
    membership: <MembershipScene />,
    streak: <StreakScene />,
    leaderboard: <LeaderboardScene />,
  };

  return (
    <div className="h-full w-full bg-[radial-gradient(80%_90%_at_60%_20%,rgba(72,166,167,0.12),transparent_70%)]">
      {scenes[variant]}
    </div>
  );
}
