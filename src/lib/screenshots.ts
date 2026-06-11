// NOTE: server-only by virtue of `node:fs` — only import this from Server
// Components (Hero, ProductBento) and pass the resolved paths down as props.
import fs from "node:fs";
import path from "node:path";

/**
 * Real-screenshot resolver (drop-in, no code changes).
 *
 * Drop a file named exactly like the value below into
 * `public/assets/screenshots/` and that surface switches from the designed
 * mock to your real in-app screenshot automatically on the next build. Any of
 * .png / .jpg / .jpeg / .webp / .avif works. Until the file exists, the mock
 * renders as a graceful fallback.
 *
 * Capture at (or above) the listed pixel size and KEEP the aspect ratio — the
 * device frame is locked to that ratio so the screenshot fills it with no crop
 * and no layout shift (CLS gate stays green).
 */
const DIR = path.join(process.cwd(), "public", "assets", "screenshots");
const EXT = ["png", "jpg", "jpeg", "webp", "avif"] as const;

// key → base filename (without extension). Recommended capture in the comment.
const SLOTS = {
  appDesktop: "app-desktop", //   hero browser body · 16:10 · ≥1600×1000
  appPhone: "app-phone", //       hero phone screen · 9:19 · ≥540×1140
  feed: "tile-feed", //           bento: Feeds · 16:10 · ≥880×550
  live: "tile-live", //           bento: Live voice rooms · 16:10 · ≥880×550
  courses: "tile-courses", //     bento: Courses · 16:10 · ≥880×550
  membership: "tile-membership", //bento: Membership & billing · 16:10 · ≥880×550
  streak: "tile-streak", //       bento: Streaks · 16:10 · ≥880×550
  leaderboard: "tile-leaderboard", //bento: Leaderboards · 16:10 · ≥880×550
  mobile: "tile-mobile", //       bento: Native mobile · 9:19 · ≥540×1140
  // brand-swap section — same app, second brand (red "Attack Mode" skin)
  whitelabeled: "tile-whitelabeled", // 16:10 · ≥1600×1000
} as const;

export type ScreenshotKey = keyof typeof SLOTS;
export type ScreenshotMap = Record<ScreenshotKey, string | null>;

function resolve(base: string): string | null {
  for (const ext of EXT) {
    const file = `${base}.${ext}`;
    try {
      if (fs.existsSync(path.join(DIR, file))) return `/assets/screenshots/${file}`;
    } catch {
      // fs unavailable (shouldn't happen in a server component) — treat as missing
    }
  }
  return null;
}

/** Read once per render on the server; cheap (a handful of existsSync calls). */
export function getScreenshots(): ScreenshotMap {
  const out = {} as ScreenshotMap;
  for (const key of Object.keys(SLOTS) as ScreenshotKey[]) {
    out[key] = resolve(SLOTS[key]);
  }
  return out;
}
