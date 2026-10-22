#!/usr/bin/env python3
"""Đọc các file .xlsx (xuất từ Google Sheets) ra JSON: ô, vùng gộp, màu nền, dropdown.
Chạy: python3 -I scripts/extract_xlsx.py  → scripts/_staging/xlsx/<tên>.json  (không cần openpyxl)
"""
import json, re, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'scripts/_staging/xlsx'
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
      'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
      'rel': 'http://schemas.openxmlformats.org/package/2006/relationships',
      'x14': 'http://schemas.microsoft.com/office/spreadsheetml/2009/9/main',
      'xm': 'http://schemas.microsoft.com/office/excel/2006/main'}

def read(z, name):
    return ET.fromstring(z.read(name))

def shared_strings(z):
    try:
        root = read(z, 'xl/sharedStrings.xml')
    except KeyError:
        return []
    return [''.join(t.text or '' for t in si.iter(f"{{{NS['m']}}}t")) for si in root.findall('m:si', NS)]

def fills(z):
    st = read(z, 'xl/styles.xml')
    fill_list = []
    for f in st.find('m:fills', NS).findall('m:fill', NS):
        fg = f.find('.//m:fgColor', NS)
        fill_list.append(fg.get('rgb') if fg is not None else None)
    xfs = [int(x.get('fillId', 0)) for x in st.find('m:cellXfs', NS).findall('m:xf', NS)]
    return [fill_list[i] if i < len(fill_list) else None for i in xfs]

def convert(path: Path):
    z = zipfile.ZipFile(path)
    ss = shared_strings(z)
    xf_fill = fills(z)
    wb = read(z, 'xl/workbook.xml')
    rels = {r.get('Id'): r.get('Target') for r in read(z, 'xl/_rels/workbook.xml.rels').findall('rel:Relationship', NS)}
    out = {'file': path.name, 'sheets': []}
    for sh in wb.find('m:sheets', NS).findall('m:sheet', NS):
        target = rels[sh.get(f"{{{NS['r']}}}id")]
        target = target.lstrip('/') if target.startswith('/') else 'xl/' + target
        root = read(z, target)
        cells = {}
        for c in root.iter(f"{{{NS['m']}}}c"):
            ref = c.get('r'); t = c.get('t'); v = c.find('m:v', NS)
            val = None
            if t == 's' and v is not None: val = ss[int(v.text)]
            elif t == 'inlineStr': val = ''.join(x.text or '' for x in c.iter(f"{{{NS['m']}}}t"))
            elif v is not None: val = v.text
            fill = xf_fill[int(c.get('s', 0))] if c.get('s') else None
            if val is not None or fill:
                cells[ref] = {'v': val, 'fill': fill}
        merges = [m.get('ref') for m in root.iter(f"{{{NS['m']}}}mergeCell")]
        dv = []
        for d in root.iter(f"{{{NS['m']}}}dataValidation"):
            f1 = d.find('m:formula1', NS)
            dv.append({'sqref': d.get('sqref'), 'type': d.get('type'), 'formula1': f1.text if f1 is not None else None})
        for d in root.iter(f"{{{NS['x14']}}}dataValidation"):
            f1 = d.find('.//xm:f', NS); sq = d.find('xm:sqref', NS)
            dv.append({'sqref': sq.text if sq is not None else None, 'type': d.get('type'), 'formula1': f1.text if f1 is not None else None})
        for item in dv:
            f = item.get('formula1') or ''
            if f.startswith('"'):
                item['options'] = [o for o in f.strip('"').split(',')]
        out['sheets'].append({'name': sh.get('name'), 'cells': cells, 'merges': merges, 'validations': dv})
    return out

OUT.mkdir(parents=True, exist_ok=True)
for p in sorted((ROOT / 'tai-lieu-goc').rglob('*.xlsx')):
    data = convert(p)
    name = re.sub(r'[^a-z0-9]+', '-', p.stem.lower().encode('ascii', 'ignore').decode()).strip('-')
    (OUT / f'{name}.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), 'utf-8')
    print(name, [ (s['name'], len(s['cells']), len(s['validations'])) for s in data['sheets'] ])
