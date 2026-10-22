#!/usr/bin/env python3
"""Thay viền/bóng 'sticker' dùng var(--ink) bằng token --edge / --edge-shadow (để dark mode dịu mắt hơn).
Chạy lại được nhiều lần (idempotent):  python3 -I scripts/apply-edge-tokens.py"""
import re
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
n = 0
for p in list((ROOT / 'src').rglob('*.astro')) + list((ROOT / 'src').rglob('*.css')):
    if p.name in {'tokens.css', 'BeBung.astro'}:
        continue
    s = p.read_text('utf-8')
    t = re.sub(r'(box-shadow:[^;]*?\b0 -?\d+(?:\.\d+)?px 0 )var\(--ink\)', r'\1var(--edge-shadow)', s)
    t = re.sub(r'(box-shadow:[^;]*?\b0 -?\d+(?:\.\d+)?px 0 )var\(--ink\)', r'\1var(--edge-shadow)', t)
    t = re.sub(r'border(-[a-z]+)?: (\d(?:\.\d)?px) (solid|dashed) var\(--ink\)', r'border\1: \2 \3 var(--edge)', t)
    t = re.sub(r'border-color: var\(--ink\)', 'border-color: var(--edge)', t)
    if t != s:
        p.write_text(t, 'utf-8'); n += 1
print('updated', n, 'files')
