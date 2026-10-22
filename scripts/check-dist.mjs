// Kiểm tra nhanh thư mục dist/ sau khi build (chạy trong CI).
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const MAX_FILE = 95 * 1024 * 1024;
const MAX_TOTAL = 900 * 1024 * 1024;
const errors = [];
let total = 0;
const htmlFiles = [];

(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else {
      total += st.size;
      if (st.size > MAX_FILE) errors.push(`File quá lớn (>95MB): ${p}`);
      if (p.endsWith('.html')) htmlFiles.push(p);
    }
  }
})(DIST);
if (total > MAX_TOTAL) errors.push(`dist quá lớn: ${(total / 1e6).toFixed(1)}MB`);

const banned = [
  [/fbclid|utm_source|l\.facebook\.com|href="https?:\/\/ths\.bs/i, 'link theo dõi / link rác'],
  [/alt="TODO"/, 'ảnh thiếu alt'],
  [/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, 'còn emoji (hãy dùng icon tự vẽ)'],
];
for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  for (const [re, why] of banned) if (re.test(html)) errors.push(`${why}: ${f} → “${html.match(re)[0]}”`);
}

if (errors.length) {
  console.error('check-dist: ' + errors.length + ' lỗi\n  ' + errors.join('\n  '));
  process.exit(1);
}
console.log(`check-dist: OK — ${htmlFiles.length} trang, ${(total / 1e6).toFixed(1)}MB`);
