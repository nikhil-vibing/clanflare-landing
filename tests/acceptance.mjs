/**
 * v13 §9 acceptance gates — Playwright harness (uses the installed `playwright`
 * library, no test-runner dep). Boots `next start`, runs the checks on desktop
 * + mobile, exits non-zero on any failure.
 *
 *   npm run build && node tests/acceptance.mjs
 *   # or, against an already-running server:
 *   BASE_URL=http://localhost:3000 node tests/acceptance.mjs
 *
 * Covers: idle cursor (P0), no never-resolving requests, TenantTrap scroll
 * stays responsive, dialogs don't leave the body scroll-locked, the form
 * returns to interactive on validation error, CLS ≤ 0.02, and the
 * reduced-motion path still renders. Lighthouse Perf/INP are a separate manual
 * gate (see README) — they need full Chrome + the lighthouse CLI.
 */
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PORT = process.env.PORT || "3219";
const EXTERNAL = process.env.BASE_URL;
const BASE = EXTERNAL || `http://localhost:${PORT}`;
const CLS_BUDGET = 0.02;

const results = [];
const ok = (name) => results.push({ name, pass: true });
const fail = (name, detail) => results.push({ name, pass: false, detail: String(detail) });
async function check(name, fn) {
  try {
    await fn();
    ok(name);
  } catch (err) {
    fail(name, err?.message ?? err);
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function waitForServer(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`server at ${url} did not become ready in ${timeoutMs}ms`);
}

// ---- per-viewport gate run -------------------------------------------------
async function run(browser, label, viewport, isMobile) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: isMobile ? 3 : 2, isMobile });
  const page = await ctx.newPage();

  // track requests that never settle
  const pending = new Map();
  page.on("request", (r) => pending.set(r, r.url()));
  page.on("requestfinished", (r) => pending.delete(r));
  page.on("requestfailed", (r) => pending.delete(r));

  // CLS observer, installed before any layout work
  await page.addInitScript(() => {
    window.__cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (!e.hadRecentInput) window.__cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(BASE, { waitUntil: "networkidle" });

  // P0 — idle cursor after load and after 5s idle
  await check(`[${label}] body cursor is auto on load`, async () => {
    assert((await page.evaluate(() => getComputedStyle(document.body).cursor)) === "auto", "cursor not auto");
  });
  await page.waitForTimeout(5000);
  await check(`[${label}] body cursor still auto after 5s idle`, async () => {
    assert((await page.evaluate(() => getComputedStyle(document.body).cursor)) === "auto", "cursor not auto at idle");
  });
  await check(`[${label}] no element shows a wait/progress cursor`, async () => {
    const bad = await page.evaluate(() => {
      const hits = [];
      for (let x = 40; x < innerWidth; x += 120) {
        for (let y = 40; y < innerHeight; y += 120) {
          const el = document.elementFromPoint(x, y);
          if (!el) continue;
          const c = getComputedStyle(el).cursor;
          if (c === "wait" || c === "progress") hits.push(el.tagName + "." + el.className);
        }
      }
      return hits;
    });
    assert(bad.length === 0, `busy cursor on: ${bad.join(", ")}`);
  });

  // CLS — gate on the LOAD-phase value, measured before any synthetic scroll.
  // This matches the CLS definition / Lighthouse: real users scroll WITH input,
  // so Chrome excludes scroll-pin shifts (e.g. ScrollTrigger pinning the
  // min-h-screen TenantTrap section). A programmatic scroll has no recent input
  // and would mis-count those pin transitions, so we never gate on it.
  const loadCls = await page.evaluate(() => window.__cls ?? 0);
  await check(`[${label}] load CLS ≤ ${CLS_BUDGET}`, async () => {
    assert(loadCls <= CLS_BUDGET, `load CLS=${loadCls.toFixed(4)}`);
  });

  // responsiveness while scrolling through TenantTrap (the pinned section)
  await check(`[${label}] page stays responsive while scrolling`, async () => {
    let worst = 0;
    for (let i = 0; i <= 10; i++) {
      await page.evaluate((p) => window.scrollTo(0, document.body.scrollHeight * p), i / 10);
      const t0 = Date.now();
      await page.evaluate(() => document.body.offsetHeight); // main-thread round trip
      worst = Math.max(worst, Date.now() - t0);
      await page.waitForTimeout(120);
    }
    assert(worst < 1000, `main-thread round-trip ${worst}ms (looks blocked)`);
  });

  // no never-resolving requests
  await check(`[${label}] no request stays pending forever`, async () => {
    await page.waitForTimeout(1500);
    const stuck = [...pending.values()].filter((u) => !u.startsWith("data:"));
    assert(stuck.length === 0, `pending: ${stuck.join(", ")}`);
  });

  // non-gating: during-scroll shift delta (dominated by ScrollTrigger pin
  // transitions that real CLS excludes — logged for visibility only)
  const scrollCls = (await page.evaluate(() => window.__cls ?? 0)) - loadCls;
  console.log(`  · [${label}] during-scroll shift delta (non-gating): ${scrollCls.toFixed(3)}`);

  // form validation error returns interactive
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await check(`[${label}] form returns to interactive after a validation error`, async () => {
    const submit = page.locator('#contact button[type="submit"]');
    await submit.scrollIntoViewIfNeeded();
    await submit.click();
    await page.waitForTimeout(800);
    assert(await submit.isEnabled(), "submit stayed disabled after validation error");
    const txt = (await submit.innerText()).toLowerCase();
    assert(!txt.includes("sending"), `submit stuck in pending state: "${txt}"`);
    const invalid = await page.locator('#contact [aria-invalid="true"]').count();
    assert(invalid > 0, "no field error surfaced for an empty submit");
  });

  // dialog open/close must not leave the body scroll-locked.
  // The compact (hamburger) nav only renders below md (768px); at tablet width
  // (≥768, isMobile) the desktop nav + Tour CTA show instead — so pick the
  // trigger by viewport width, not the isMobile/touch flag.
  const compactNav = viewport.width < 768;
  const dialogTrigger = compactNav
    ? page.getByRole("button", { name: "Open menu" })
    : page.getByRole("button", { name: /tour/i });
  await check(`[${label}] ${compactNav ? "menu" : "tour"} dialog open/close leaves scroll usable`, async () => {
    await page.evaluate(() => window.scrollTo(0, 0));
    await dialogTrigger.click();
    await page.waitForTimeout(400);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const scrollable = await page.evaluate(async () => {
      // The page sets html{scroll-behavior:smooth}; a programmatic scrollTo
      // then animates over several frames, so reading scrollY one rAF later
      // races the animation (it lands short on taller/touch layouts and is a
      // false "lock leaked"). Force instant scroll so we measure real
      // scrollability — the actual thing this gate asserts — not the easing.
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, 600);
      await new Promise((r) => requestAnimationFrame(r));
      const moved = window.scrollY > 100;
      window.scrollTo(0, 0);
      html.style.scrollBehavior = prev;
      return moved;
    });
    assert(scrollable, "body could not scroll after dialog closed (scroll lock leaked)");
  });

  await ctx.close();
}

// reduced-motion path renders (static, readable)
async function runReducedMotion(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await check(`[reduced-motion] hero + proof render`, async () => {
    assert(await page.locator("#top").isVisible(), "hero hidden");
    await page.locator("#proof").scrollIntoViewIfNeeded();
    assert(await page.locator("#proof").isVisible(), "proof hidden");
    assert((await page.locator("#proof .text-section").innerText()).length > 0, "proof heading empty");
  });
  await ctx.close();
}

// ---- main ------------------------------------------------------------------
let server;
async function main() {
  if (!EXTERNAL) {
    server = spawn("npx", ["next", "start", "-p", PORT], {
      stdio: "ignore",
      env: { ...process.env, PORT },
    });
  }
  await waitForServer(BASE);

  const browser = await chromium.launch();
  try {
    await run(browser, "desktop", { width: 1280, height: 900 }, false);
    await run(browser, "tablet", { width: 834, height: 1194 }, true); // iPad portrait (touch)
    await run(browser, "mobile", { width: 390, height: 844 }, true);
    await runReducedMotion(browser);
  } finally {
    await browser.close();
  }
}

main()
  .catch((err) => fail("harness", err?.stack ?? err))
  .finally(() => {
    if (server) server.kill();
    const failed = results.filter((r) => !r.pass);
    console.log(`\nv13 §9 acceptance — ${results.length - failed.length}/${results.length} passed\n`);
    for (const r of results) {
      console.log(`${r.pass ? "✓" : "✗"} ${r.name}${r.detail ? `\n    ${r.detail}` : ""}`);
    }
    process.exit(failed.length ? 1 : 0);
  });
