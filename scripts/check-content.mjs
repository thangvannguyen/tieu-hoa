// Kiểm tra nội dung: câu trích nguồn có thật trong bài, sơ đồ khai báo tồn tại & được dùng, mỗi bài có ≥ 1 sơ đồ.
// Chạy: node scripts/check-content.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LESSONS = 'src/content/lessons';
const errors = [];
const warnings = [];

const norm = (s) =>
  s
    .normalize('NFC')
    .replace(/<\/?(strong|em|b|i|br|span|mark|sup|sub|small)\b[^>]*>/g, ' ')
    .replace(/\\([{}<>\[\]*_`])/g, '$1')
    .replace(/\*\*|\*|__/g, '')
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

const lessonText = {};
const lessonRaw = {};
for (const f of readdirSync(LESSONS).filter((f) => f.endsWith('.mdx'))) {
  const id = f.replace(/\.mdx$/, '');
  lessonRaw[id] = readFileSync(join(LESSONS, f), 'utf8');
  lessonText[id] = norm(lessonRaw[id]);
}

function checkSource(src, where) {
  if (!src || !src.bai || !src.trich) return errors.push(`${where}: thiếu source {bai, trich}`);
  if (!lessonText[src.bai]) return errors.push(`${where}: bài "${src.bai}" không tồn tại`);
  if (!lessonText[src.bai].includes(norm(src.trich))) errors.push(`${where}: không tìm thấy câu trích trong ${src.bai}: “${src.trich}”`);
}

function walk(obj, where) {
  if (Array.isArray(obj)) obj.forEach((o, i) => walk(o, `${where}[${i}]`));
  else if (obj && typeof obj === 'object') {
    if ('source' in obj) checkSource(obj.source, where);
    for (const [k, v] of Object.entries(obj)) if (k !== 'source') walk(v, `${where}.${k}`);
  }
}

for (const dir of ['src/data/quiz', 'src/data/thuat-ngu', 'src/data/canh-bao']) {
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    walk(JSON.parse(readFileSync(join(dir, f), 'utf8')), `${dir}/${f}`);
  }
}
if (existsSync('src/data/so-sanh-dinh-duong.json')) walk(JSON.parse(readFileSync('src/data/so-sanh-dinh-duong.json', 'utf8')), 'so-sanh-dinh-duong');

// sơ đồ
const diagramFiles = {};
for (const ch of ['c0', 'c1', 'c2', 'c3', 'c4', 'them', 'chung']) {
  const d = join('src/components/diagrams', ch);
  if (!existsSync(d)) continue;
  for (const f of readdirSync(d).filter((f) => f.endsWith('.astro'))) {
    const name = f.replace(/\.astro$/, '');
    if (diagramFiles[name]) errors.push(`Trùng tên sơ đồ ${name}: ${diagramFiles[name]} và ${d}`);
    diagramFiles[name] = join(d, f);
  }
}
for (const [id, raw] of Object.entries(lessonRaw)) {
  const fm = raw.split('---')[1] ?? '';
  if (/^draft:\s*true/m.test(fm)) continue;
  const m = fm.match(/^diagrams:\s*\[([^\]]*)\]/m);
  const list = m ? m[1].split(',').map((s) => s.trim()).filter(Boolean) : [];
  if (list.length === 0 && !/^kind:\s*gioi-thieu/m.test(fm) && id !== 'bt-03-lam-loang-dom') errors.push(`${id}: chưa có sơ đồ nào (frontmatter diagrams)`);
  for (const name of list) {
    if (!diagramFiles[name]) errors.push(`${id}: sơ đồ "${name}" không tồn tại`);
    else if (!new RegExp(`<${name}[\\s/>]`).test(raw)) errors.push(`${id}: khai báo sơ đồ "${name}" nhưng chưa đặt vào bài`);
  }
  for (const used of raw.matchAll(/<([A-Z][A-Za-z0-9]+)[\s/>]/g)) {
    const n = used[1];
    if (diagramFiles[n] && !list.includes(n)) warnings.push(`${id}: dùng sơ đồ ${n} nhưng chưa khai báo trong diagrams`);
  }
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(raw.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''))) errors.push(`${id}: còn emoji trong bài`);
  if (/alt="TODO"/.test(raw)) errors.push(`${id}: còn ảnh alt="TODO"`);
}

for (const w of warnings) console.warn('cảnh báo: ' + w);
if (errors.length) {
  console.error(`check-content: ${errors.length} lỗi\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`check-content: OK — ${Object.keys(lessonRaw).length} bài, ${Object.keys(diagramFiles).length} sơ đồ`);
