#!/usr/bin/env python3
"""Lấy tiêu đề (oEmbed) và ảnh thumbnail của các video YouTube được nhắc trong bản tin.
Chạy:  python3 -I scripts/fetch_youtube.py   (cần chạy convert_docx.py trước để có manifest)
Ghi:   src/data/youtube.json, src/assets/youtube/<id>.jpg
"""
import json, urllib.request, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / 'scripts/_staging/manifest.json').read_text('utf-8'))
out_json = ROOT / 'src/data/youtube.json'
img_dir = ROOT / 'src/assets/youtube'
img_dir.mkdir(parents=True, exist_ok=True)
data = json.loads(out_json.read_text('utf-8')) if out_json.exists() else {}

def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read()

for lesson in manifest:
    shorts = {l.split('/shorts/')[1][:11] for l in lesson['links'] if '/shorts/' in l}
    for vid in lesson['youtube']:
        page = f'https://www.youtube.com/shorts/{vid}' if vid in shorts else f'https://www.youtube.com/watch?v={vid}'
        meta = json.loads(get('https://www.youtube.com/oembed?format=json&url=' + urllib.parse.quote(page)))
        (img_dir / f'{vid}.jpg').write_bytes(get(f'https://i.ytimg.com/vi/{vid}/hqdefault.jpg'))
        data[vid] = {'title': meta['title'], 'author': meta.get('author_name', ''), 'shorts': vid in shorts, 'lesson': lesson['slug']}
        print(vid, data[vid]['shorts'], meta['title'])

out_json.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', 'utf-8')
