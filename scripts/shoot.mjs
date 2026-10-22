// usage: node shoot.mjs <url> <outPrefix> [width=1280] [theme=light] [segments=4] [segH=1400]
import { chromium } from 'playwright';
const [url, out, w = '1280', theme = 'light', segs = '4', segH = '1400'] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: +w, height: +segH }, colorScheme: theme, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: 'networkidle' });
const H = await page.evaluate(() => document.documentElement.scrollHeight);
const sw = await page.evaluate(() => document.documentElement.scrollWidth);
for (let i = 0; i < +segs && i * +segH < H; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * +segH);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${out}-${i}.png` });
}
console.log(JSON.stringify({ height: H, scrollWidth: sw, width: +w, errors }));
await browser.close();
