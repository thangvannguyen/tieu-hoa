#!/usr/bin/env python3
"""Chuyển các bản tin .docx trong tai-lieu-goc/ thành bản nháp MDX.

Chạy một lần:  python3 -I scripts/convert_docx.py
Kết quả nằm ở scripts/_staging/ (không bao giờ ghi vào src/content):
  <slug>.mdx         bản nháp để biên tập tay
  <slug>.debug.tsv   từng đoạn: in đậm? viết hoa? danh sách? quyết định heading
  <slug>.txt         toàn văn gốc (dùng cho check_fidelity.py)
  manifest.json      ảnh, link, YouTube, cảnh báo
  images/<slug>/     ảnh trích từ docx
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

import docx
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.hyperlink import Hyperlink
from docx.text.paragraph import Paragraph
from docx.text.run import Run

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "tai-lieu-goc"
OUT = ROOT / "scripts" / "_staging"
OVERRIDES = json.loads((ROOT / "scripts" / "convert_overrides.json").read_text("utf-8"))

# số bản tin / mã file → slug bài trên web
SLUGS = {
    "00": "00-chao-mung",
    "01": "01-vi-sao-viem-da-day-tai-di-tai-lai",
    "02": "02-giai-ma-thoi-quen",
    "03": "03-dinh-duong-phong-viem-loet-trao-nguoc",
    "04": "04-suc-khoe-tinh-than-ban-do-co-the",
    "05": "05-vi-sao-dan-van-phong-roi-loan-tieu-hoa",
    "06": "06-loi-khuan-hieu-cho-dung",
    "07": "07-bo-sung-loi-khuan-dung-cach",
    "08": "08-nuoi-duong-he-vi-sinh-ben-vung",
    "09": "09-giac-ngu-khong-lang-phi",
    "10": "10-ngu-khong-du-hay-roi-loan",
    "11": "11-bo-cong-cu-bao-ve-giac-ngu",
    "12": "12-khi-nao-can-dieu-tri-giac-ngu",
    "13": "13-dinh-duong-trao-nguoc",
    "14": "14-dinh-duong-viem-loet-da-day-ta-trang",
    "15": "15-dinh-duong-ibs",
    "16": "16-dinh-duong-tao-bon",
    "BT01": "bt-01-bai-tap-thuc-day-tieu-hoa",
    "BT02": "bt-02-doc-nhan-thuc-pham",
}

TRACKING_PARAMS = re.compile(r"^(fbclid|utm_.*|__cft__.*|__tn__|feature|si|mibextid)$")
YT_RE = re.compile(
    r"(?:youtu\.be/|youtube\.com/(?:watch\?(?:.*&)?v=|shorts/|embed/))([A-Za-z0-9_-]{11})"
)
EMOJI_RE = re.compile(r"[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿]️?")
TYPED_BULLET_RE = re.compile(r"^\s*([·•\-–]|[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿]️?)\s+")


def nfc(s: str) -> str:
    return unicodedata.normalize("NFC", s)


def clean_url(url: str) -> str:
    url = url.strip()
    p = urlparse(url)
    if p.netloc.endswith("l.facebook.com") and p.path.startswith("/l.php"):
        inner = parse_qs(p.query).get("u", [""])[0]
        if inner:
            return clean_url(inner)
    q = [(k, v) for k, vs in parse_qs(p.query, keep_blank_values=True).items() for v in vs
         if not TRACKING_PARAMS.match(k)]
    return urlunparse(p._replace(query=urlencode(q, doseq=True)))


def is_junk_link(url: str) -> bool:
    host = urlparse(url).netloc.lower()
    return host in {"ths.bs", "www.ths.bs"}


def youtube_id(url: str) -> tuple[str, bool] | None:
    m = YT_RE.search(url)
    if not m:
        return None
    return m.group(1), "/shorts/" in url


def esc(text: str) -> str:
    """Thoát ký tự đặc biệt của MDX/Markdown trong chữ thường."""
    text = text.replace("\\", "\\\\")
    for ch in "{}<>[]*_`":
        text = text.replace(ch, "\\" + ch)
    return text


# ---------------------------------------------------------------- numbering
class Numbering:
    """Tìm định dạng danh sách (bullet/decimal) — ưu tiên lvlOverride như Word."""

    def __init__(self, document):
        self.fmt: dict[tuple[str, int], str] = {}
        try:
            part = document.part.numbering_part
        except NotImplementedError:
            return
        root = part.element
        abstract: dict[str, dict[int, str]] = {}
        for an in root.findall(qn("w:abstractNum")):
            aid = an.get(qn("w:abstractNumId"))
            abstract[aid] = {}
            for lvl in an.findall(qn("w:lvl")):
                nf = lvl.find(qn("w:numFmt"))
                abstract[aid][int(lvl.get(qn("w:ilvl")))] = nf.get(qn("w:val")) if nf is not None else "decimal"
        for num in root.findall(qn("w:num")):
            nid = num.get(qn("w:numId"))
            aid_el = num.find(qn("w:abstractNumId"))
            aid = aid_el.get(qn("w:val")) if aid_el is not None else None
            levels = dict(abstract.get(aid, {}))
            for ov in num.findall(qn("w:lvlOverride")):
                lvl = ov.find(qn("w:lvl"))
                if lvl is not None:
                    nf = lvl.find(qn("w:numFmt"))
                    if nf is not None:
                        levels[int(ov.get(qn("w:ilvl")))] = nf.get(qn("w:val"))
            for ilvl, f in levels.items():
                self.fmt[(nid, ilvl)] = f

    def of(self, p: Paragraph) -> tuple[str, int] | None:
        ppr = p._p.pPr
        if ppr is None or ppr.numPr is None:
            return None
        nid_el = ppr.numPr.numId
        if nid_el is None or nid_el.val == 0:
            return None
        ilvl = ppr.numPr.ilvl.val if ppr.numPr.ilvl is not None else 0
        f = self.fmt.get((str(nid_el.val), ilvl), "decimal")
        return ("ul" if f == "bullet" else "ol"), ilvl


# ---------------------------------------------------------------- inline
class Seg:
    __slots__ = ("text", "bold", "italic", "href")

    def __init__(self, text, bold, italic, href):
        self.text, self.bold, self.italic, self.href = text, bold, italic, href


def run_segments(run: Run, href, images: list, ctx) -> list:
    out = []
    for item in run.iter_inner_content():
        if isinstance(item, str):
            t = item.replace("\t", " ").replace(" ", " ")
            if t:
                out.append(Seg(t, run.bold is True, run.italic is True, href))
        else:  # Drawing
            if getattr(item, "has_picture", False):
                images.append(item)
                out.append(("IMG", item))
    return out


def para_segments(p: Paragraph, ctx) -> tuple[list, list]:
    segs, images = [], []
    for item in p.iter_inner_content():
        if isinstance(item, Run):
            segs += run_segments(item, None, images, ctx)
        elif isinstance(item, Hyperlink):
            href = item.address or ("#" + item.fragment if item.fragment else None)
            if href:
                href = clean_url(href)
                if is_junk_link(href):
                    ctx["warnings"].append(f"bỏ link rác {href!r}")
                    href = None
            for r in item.runs:
                segs += run_segments(r, href, images, ctx)
    return segs, images


def merge(segs):
    out = []
    for s in segs:
        if isinstance(s, tuple):
            out.append(s)
            continue
        if out and isinstance(out[-1], Seg) and (out[-1].bold, out[-1].italic, out[-1].href) == (s.bold, s.italic, s.href):
            out[-1].text += s.text
        else:
            out.append(Seg(s.text, s.bold, s.italic, s.href))
    return out


def fmt_inline(segs) -> str:
    parts = []
    for s in segs:
        if isinstance(s, tuple):
            continue
        t = s.text
        lead = len(t) - len(t.lstrip())
        trail = len(t) - len(t.rstrip())
        core = t.strip()
        if not core:
            parts.append(t)
            continue
        txt = esc(core)
        if s.bold and s.italic:
            txt = f"<strong><em>{txt}</em></strong>"
        elif s.bold:
            txt = f"<strong>{txt}</strong>"
        elif s.italic:
            txt = f"<em>{txt}</em>"
        if s.href:
            txt = f"[{txt}]({s.href})"
        parts.append(t[:lead] + txt + (t[len(t) - trail:] if trail else ""))
    out = "".join(parts)
    out = re.sub(r"</strong>(\s*)<strong>", r"\1", out)
    out = re.sub(r"</em>(\s*)<em>", r"\1", out)
    return re.sub(r"[ ]{2,}", " ", out).strip()


def plain(segs) -> str:
    return "".join(s.text for s in segs if isinstance(s, Seg))


# ---------------------------------------------------------------- tables
def table_md(tbl: Table) -> list[str]:
    rows = []
    for tr in tbl._tbl.tr_lst:
        cells = []
        for tc in tr.tc_lst:
            vm = tc.tcPr.vMerge if tc.tcPr is not None else None
            text = " ".join(
                nfc("".join(t.text or "" for t in p.iter(qn("w:t")))).strip()
                for p in tc.iter(qn("w:p"))
            ).strip()
            if vm is not None and vm.val != "restart":
                text = ""
            span = tc.grid_span
            cells += [esc(text).replace("|", "\\|")] + [""] * (span - 1)
        rows.append(cells)
    if not rows:
        return []
    width = max(len(r) for r in rows)
    rows = [r + [""] * (width - len(r)) for r in rows]
    lines = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * width]
    lines += ["| " + " | ".join(r) + " |" for r in rows[1:]]
    return lines


# ---------------------------------------------------------------- headings
def has_lower(t: str) -> bool:
    return any(ch.islower() for ch in t)
NUM_H2 = re.compile(r"^\d+\s*[.)]?\s+\S")
NUM_H3 = re.compile(r"^\d+\.\d+\.?\s*\S")


def heading_level(text: str, segs, ov_kind: str | None) -> tuple[int | None, str]:
    if ov_kind:
        if ov_kind.startswith("h"):
            return int(ov_kind[1]), "override"
        return None, "override:" + ov_kind
    real = [s for s in segs if isinstance(s, Seg) and s.text.strip()]
    if not real or not all(s.bold for s in real) or any(s.href for s in real):
        return None, "not-all-bold"
    t = text.strip()
    if len(t) > 140:
        return None, "too-long"
    if NUM_H3.match(t):
        return 3, "typed x.y"
    if NUM_H2.match(t):
        return 2, "typed n."
    if not has_lower(t) and len(t) > 3:
        return 2, "all-caps"
    if t.endswith((":", "?")) or not t.endswith("."):
        return 3, "bold short"
    return None, "bold sentence"


# ---------------------------------------------------------------- main
def convert(path: Path, code: str) -> dict:
    slug = SLUGS[code]
    ov = OVERRIDES.get(code, {})
    ov_kind = {int(k): v for k, v in ov.get("kind", {}).items()}
    ov_skip = set(ov.get("skip", []))
    d = docx.Document(str(path))
    numbering = Numbering(d)
    ctx = {"warnings": [], "links": [], "youtube": [], "images": [], "emoji": {}}
    img_dir = OUT / "images" / slug
    img_dir.mkdir(parents=True, exist_ok=True)
    seen_sha = {}
    lines: list[str] = []
    imports: list[str] = []
    debug = ["idx\tbold\tcaps\tlist\tlen\tdecision\treason\ttext"]
    fulltext = []
    recent_links: list[str] = []
    prev_kind = None
    idx = -1

    def blank():
        if lines and lines[-1] != "":
            lines.append("")

    for block in d.iter_inner_content():
        if isinstance(block, Table):
            blank()
            lines += table_md(block)
            lines.append("")
            fulltext.append(" ".join(nfc(t.text or "") for t in block._tbl.iter(qn("w:t"))))
            prev_kind = "table"
            continue
        idx += 1
        p: Paragraph = block
        segs, images = para_segments(p, ctx)
        segs = merge(segs)
        text = nfc(plain(segs))
        fulltext.append(text)
        if idx in ov_skip:
            debug.append(f"{idx}\t\t\t\t{len(text)}\tSKIP\toverride\t{text[:80]}")
            continue
        for e in EMOJI_RE.findall(text):
            ctx["emoji"][e] = ctx["emoji"].get(e, 0) + 1

        # images
        for dr in images:
            img = dr.image
            if img.px_width <= 2 and img.px_height <= 2:
                ctx["warnings"].append(f"bỏ ảnh đệm {img.px_width}x{img.px_height}")
                continue
            if img.sha1 in seen_sha:
                continue
            n = len(seen_sha) + 1
            name = f"{slug}-{n}.{img.ext}"
            (img_dir / name).write_bytes(img.blob)
            seen_sha[img.sha1] = name
            ctx["images"].append({"file": name, "px": [img.px_width, img.px_height], "para": idx})
            imports.append(f"import img{n} from '~/assets/lessons/{slug}/{name}';")
            blank()
            lines.append(f'<Figure src={{img{n}}} alt="TODO" />')
            lines.append("")

        if not text.strip():
            debug.append(f"{idx}\t\t\t\t0\tEMPTY\t\t")
            continue

        # links bookkeeping
        hrefs = [s.href for s in segs if isinstance(s, Seg) and s.href]
        for h in hrefs:
            ctx["links"].append(h)
        # duplicate raw-URL paragraph (or "( url )" tail) right after the same link
        stripped = text.strip().strip("()").strip()
        if re.fullmatch(r"https?://\S+", stripped):
            target = clean_url(hrefs[0] if hrefs else stripped)
            norm = lambda u: (youtube_id(u) or (u.rstrip("/"),))[0]
            if any(norm(target) == norm(r) for r in recent_links[-3:]):
                debug.append(f"{idx}\t\t\t\t{len(text)}\tDROP\tduplicate url\t{text[:80]}")
                continue
        # remove inline "( url )" duplicates of the previous link inside the same paragraph
        segs2 = []
        for s in segs:
            if isinstance(s, Seg) and s.href and segs2:
                prev_links = [x.href for x in segs2 if isinstance(x, Seg) and x.href]
                if prev_links and (youtube_id(s.href) or (s.href,))[0] == (youtube_id(prev_links[-1]) or (prev_links[-1],))[0] and s.text.strip().startswith("http"):
                    # drop this seg and the surrounding "( " ... " )"
                    if segs2 and isinstance(segs2[-1], Seg) and segs2[-1].text.strip() in {"(", ""}:
                        segs2.pop()
                    s = Seg("", False, False, None)
                    s.text = "\x00DROP_PAREN"
            segs2.append(s)
        segs = [s for s in segs2 if not (isinstance(s, Seg) and s.text == "\x00DROP_PAREN")]
        # drop trailing " )" left behind
        if segs and isinstance(segs[-1], Seg) and segs[-1].text.strip() == ")" and not any(
            isinstance(s, Seg) and "(" in s.text for s in segs[:-1]):
            segs = segs[:-1]
        recent_links += hrefs

        yt = [youtube_id(h) for h in hrefs if youtube_id(h)]
        for y in yt:
            if y[0] not in ctx["youtube"]:
                ctx["youtube"].append(y[0])

        lst = numbering.of(p)
        caps = not has_lower(text)
        bold_all = all(s.bold for s in segs if isinstance(s, Seg) and s.text.strip())
        level, reason = (None, "list") if lst else heading_level(text, segs, ov_kind.get(idx))
        body = fmt_inline(segs)

        typed = TYPED_BULLET_RE.match(text) if not lst else None
        decision = "P"
        if level:
            blank()
            heading_text = re.sub(r"</?strong>", "", body)
            lines.append("#" * level + " " + heading_text)
            lines.append("")
            decision = f"H{level}"
        elif lst:
            kind, ilvl = lst
            if prev_kind not in ("ul", "ol"):
                blank()
            marker = "-" if kind == "ul" else "1."
            lines.append("  " * ilvl + f"{marker} {body}")
            decision = kind.upper()
            prev_kind = kind
            debug.append(f"{idx}\t{int(bold_all)}\t{int(caps)}\t{kind}\t{len(text)}\t{decision}\t{reason}\t{text[:80]}")
            continue
        elif typed:
            if prev_kind != "typed":
                blank()
            sym = typed.group(1)
            rest = fmt_inline(segs)
            rest = re.sub(r"^\s*" + re.escape(esc(sym)) + r"\s*", "", rest)
            rest = re.sub(r"^\s*" + re.escape(sym) + r"\s*", "", rest)
            lines.append(f"- {rest}" if sym in "·•-–" else f"- {{/* {sym} */}} {rest}")
            decision = "TYPED"
            prev_kind = "typed"
            debug.append(f"{idx}\t{int(bold_all)}\t{int(caps)}\ttyped\t{len(text)}\t{decision}\t{sym}\t{text[:80]}")
            continue
        elif ov_kind.get(idx) == "quote":
            blank()
            lines.append("> " + body)
            lines.append("")
            decision = "QUOTE"
        else:
            blank()
            # một dòng bắt đầu bằng "1." gõ tay mà không phải heading → giữ số, tránh Markdown hiểu thành list
            body2 = re.sub(r"^(\d+)\.(\s)", r"\1\\.\2", body)
            lines.append(body2)
            lines.append("")
        prev_kind = decision
        debug.append(f"{idx}\t{int(bold_all)}\t{int(caps)}\t\t{len(text)}\t{decision}\t{reason}\t{text[:80]}")

    # completeness: every w:t char must have been visited
    all_t = nfc("".join(t.text or "" for t in d.element.body.iter(qn("w:t"))))
    got = nfc("".join(fulltext))
    if re.sub(r"\s", "", all_t) != re.sub(r"\s", "", got.replace("\t", " ")):
        ctx["warnings"].append(f"COMPLETENESS mismatch: {len(all_t)} vs {len(got)}")

    md = "\n".join(lines)
    md = re.sub(r"\n{3,}", "\n\n", md).strip() + "\n"
    head = "\n".join(imports)
    (OUT / f"{slug}.mdx").write_text((head + "\n\n" if head else "") + md, "utf-8")
    (OUT / f"{slug}.debug.tsv").write_text("\n".join(debug) + "\n", "utf-8")
    (OUT / f"{slug}.txt").write_text("\n".join(fulltext) + "\n", "utf-8")
    sha = hashlib.sha1(path.read_bytes()).hexdigest()
    return {"slug": slug, "source": str(path.relative_to(ROOT)), "sha1": sha, **ctx}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = []
    for path in sorted(SRC.rglob("*.docx")):
        code = path.name.split(" - ")[0]
        if code not in SLUGS:
            print("bỏ qua", path.name, file=sys.stderr)
            continue
        info = convert(path, code)
        manifest.append(info)
        w = info["warnings"]
        print(f"{info['slug']:<48} imgs={len(info['images'])} yt={len(info['youtube'])} links={len(info['links'])} emoji={sum(info['emoji'].values())} warn={len(w)}")
        for x in w:
            print("   !", x)
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), "utf-8")


if __name__ == "__main__":
    main()
