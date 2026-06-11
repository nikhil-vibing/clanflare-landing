import { chromium } from "playwright";
const b = await chromium.launch();
const widths = [1440, 1024, 768, 375];
const sections = process.argv.slice(2).length ? process.argv.slice(2) : ["#product"];
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 2 });
  await p.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  for (const sel of sections) {
    const el = await p.$(sel);
    if (!el) { console.log("MISSING", sel, w); continue; }
    await el.scrollIntoViewIfNeeded();
    await p.waitForTimeout(500);
    const name = sel.replace("#", "");
    await el.screenshot({ path: `/tmp/v14-${name}-${w}.png` });
    console.log("shot", name, w);
  }
  await p.close();
}
await b.close();
