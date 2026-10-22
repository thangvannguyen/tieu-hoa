// Kiểm tra trợ năng bằng axe-core trên các trang đã build (chạy với `npm run preview` đang mở).
// node scripts/qa-axe.mjs [baseUrl] [light|dark]
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const base = process.argv[2] ?? 'http://localhost:4321/tieu-hoa';
const scheme = process.argv[3] ?? 'light';
const pages = [];
(function walk(dir, rel = '') {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { if (!['_astro', 'pagefind', 'videos'].includes(n)) walk(p, `${rel}${n}/`); }
    else if (n === 'index.html') pages.push(rel);
  }
})('dist');

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ colorScheme: scheme, viewport: { width: 1280, height: 900 } });
let total = 0;
for (const rel of pages) {
  const page = await ctx.newPage();
  await page.goto(`${base}/${rel}`, { waitUntil: 'networkidle' });
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  const v = res.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical');
  if (v.length) {
    console.log(`\n/${rel}`);
    for (const x of v) {
      total++;
      console.log(`  [${x.impact}] ${x.id}: ${x.help} (${x.nodes.length})`);
      for (const n of x.nodes.slice(0, 3)) console.log(`     ${n.target.join(' ')} — ${n.failureSummary?.split('\n')[1]?.trim() ?? ''}`);
    }
  }
  await page.close();
}
await browser.close();
console.log(`\naxe (${scheme}): ${pages.length} trang, ${total} lỗi nghiêm trọng`);
process.exit(total ? 1 : 0);
