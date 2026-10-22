// chụp riêng từng sơ đồ (.dg) của một trang
import { chromium } from 'playwright';
const [url, out, w = '1280', theme = 'light'] = process.argv.slice(2);
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: +w, height: 1000 }, colorScheme: theme });
const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
await p.goto(url, { waitUntil: 'networkidle' });
const figs = await p.$$('figure.dg, .fig');
let i = 0;
for (const f of figs) { await f.scrollIntoViewIfNeeded(); await f.screenshot({ path: `${out}-${i++}.png` }); }
console.log(JSON.stringify({ count: figs.length, errs }));
await b.close();
