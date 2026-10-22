# Hướng dẫn biên tập bài học & vẽ sơ đồ

Tài liệu này dành cho người (hoặc agent) chuyển một bản tin `.docx` thành trang bài học trên web.
**Bài mẫu chuẩn:** `src/content/lessons/01-vi-sao-viem-da-day-tai-di-tai-lai.mdx` và các sơ đồ của nó trong
`src/components/diagrams/c1/` + `src/components/diagrams/chung/TrucNaoRuot.astro`. Hãy đọc kỹ bài mẫu trước khi làm.

## 0. Ba nguyên tắc không được phá

1. **Giữ nguyên ý và câu chữ của bác sĩ.** Chỉ sửa lỗi rõ ràng: chính tả, lặp từ, thiếu dấu cách/dấu câu,
   đánh số sai, link trùng/link rác. Mọi chỗ sửa phải ghi vào sổ biên tập (mục 6).
2. **Không thêm kiến thức y khoa mới.** Không thêm con số, cơ chế, danh sách thực phẩm, dấu hiệu bệnh… mà bài
   gốc không có. Nếu sơ đồ cần một ý mà bài không nói, lấy từ bài khác trong chuỗi (ghi `from`) — nếu cả chuỗi
   không có thì bỏ, và ghi vào sổ biên tập. Chỗ nghi ngờ về y khoa: **không tự sửa**, chỉ ghi lại để hỏi BS.
3. **Không sót đoạn nào.** Mọi đoạn văn trong docx đều phải có mặt trên trang (trừ: link URL thô bị lặp,
   dòng chữ ký đã đưa vào frontmatter `signoff`, tiêu đề đã đưa vào frontmatter).
   Có thể thêm heading `##` để chia mục (bài gốc không có heading thật) — heading là trình bày, phải mô tả
   đúng nội dung đoạn bên dưới, ưu tiên dùng lại chữ trong bài.

## 1. Nguồn làm việc

| Thứ | Ở đâu |
|---|---|
| File gốc | `tai-lieu-goc/<chương>/<số> - <TIÊU ĐỀ>.docx` |
| Bản nháp MDX tự động | `scripts/_staging/<slug>.mdx` (đã có heading đoán, list, link, `<Figure>` ảnh) |
| Toàn văn gốc | `scripts/_staging/<slug>.txt` · bảng quyết định từng đoạn: `<slug>.debug.tsv` |
| Ảnh đã tách | `src/assets/lessons/<slug>/<slug>-<n>.{png,jpg}` — **mở xem từng ảnh** (công cụ đọc ảnh) |
| Video YouTube | `src/data/youtube.json` (tiêu đề + ảnh bìa đã tải) |
| Công cụ thực hành | `src/data/tools.ts` (id công cụ cho `<ToolLink tool="…" />` và frontmatter `tools`) |

Nếu bản nháp đoán sai heading/list, hãy đọc lại docx: `python3 -I -c "import docx,sys; d=docx.Document(sys.argv[1]); [print(i, repr(p.text)) for i,p in enumerate(d.paragraphs)]" "<file>"`.

## 2. Frontmatter (bắt buộc — schema ở `src/content.config.ts`)

```yaml
---
kind: ban-tin            # gioi-thieu | ban-tin | bai-them
so: 7                    # số bản tin gốc (bỏ với bài thêm / thư chào mừng)
order: 7                 # thứ tự toàn site: 0 chào mừng, 1–16 bản tin, 101–103 bài thêm
chapter: c2              # c0 | c1 | c2 | c3 | c4 | them
title: Bổ sung lợi khuẩn sao cho đúng cách, sao cho có lợi?   # viết thường đầu câu, dễ đọc
titleOriginal: "Bản tin #7: BỔ SUNG LỢI KHUẨN SAO CHO ĐÚNG CÁCH, SAO CHO CÓ LỢI?"   # nguyên văn
subtitle: …              # nếu bài gốc có phụ đề (bài 9–12 có)
summary: 1–2 câu tóm tắt (≤ 300 ký tự), dùng chữ trong bài
keyPoints:               # 3–5 ý chính, mỗi ý ≤ 2 dòng, rút từ chính bài, cho phép **đậm**
  - "…"
authors: [lan-vien, quynh-thu]   # lan-vien | quynh-thu | diem-khue (theo chữ ký cuối bài)
published: 16.09.2026    # chỉ bài thêm có ngày đăng
icon: men-vi-sinh        # một icon trong src/icons/
mascot: suy-nghi         # vui | lo-lang | buon-ngu | dau | khoe | suy-nghi
pillars: [dinh-duong]    # dinh-duong | giac-ngu | van-dong | stress | nghien-chat | quan-he
diagrams: [NamDung, CoNenBoSungLoiKhuan]   # tên component sơ đồ dùng trong bài (≥ 1)
tools: [nhat-ky-loi-khuan-5-ngay]           # id trong src/data/tools.ts (hiện thẻ công cụ cuối bài)
related: [06-loi-khuan-hieu-cho-dung, 08-nuoi-duong-he-vi-sinh-ben-vung]
reflection:              # câu hỏi "Chiêm nghiệm" NGUYÊN VĂN (nếu bài có) → trang tự tạo ô ghi chú
  - "Bạn cảm thấy thế nào…?"
signoff:                 # lời chào cuối + chữ ký NGUYÊN VĂN, dòng cuối là tagline
  - "Mến chúc bạn …"
  - "Quý mến, BS Lan Viên & BS Quỳnh Thư"
  - "Chăm sóc sức khỏe chủ động"
source:
  file: "02-he-vi-sinh-duong-ruot/07 - BỔ SUNG LỢI KHUẨN SAO CHO ĐÚNG CÁCH, SAO CHO CÓ LỢI.docx"
---
```

Slug (tên file MDX) — **không đổi**:
`00-chao-mung`, `01-vi-sao-viem-da-day-tai-di-tai-lai`, `02-giai-ma-thoi-quen`, `03-dinh-duong-phong-viem-loet-trao-nguoc`,
`04-suc-khoe-tinh-than-ban-do-co-the`, `05-vi-sao-dan-van-phong-roi-loan-tieu-hoa`, `06-loi-khuan-hieu-cho-dung`,
`07-bo-sung-loi-khuan-dung-cach`, `08-nuoi-duong-he-vi-sinh-ben-vung`, `09-giac-ngu-khong-lang-phi`, `10-ngu-khong-du-hay-roi-loan`,
`11-bo-cong-cu-bao-ve-giac-ngu`, `12-khi-nao-can-dieu-tri-giac-ngu`, `13-dinh-duong-trao-nguoc`, `14-dinh-duong-viem-loet-da-day-ta-trang`,
`15-dinh-duong-ibs`, `16-dinh-duong-tao-bon`, `bt-01-bai-tap-thuc-day-tieu-hoa`, `bt-02-doc-nhan-thuc-pham`, `bt-03-lam-loang-dom`.

## 3. Thân bài MDX

- Không viết lại tiêu đề H1 (trang tự hiện `title`). Bắt đầu bằng lời chào ("Bạn quý mến," …).
- Heading: `##` cho mục lớn, `###` cho mục con. Đổi heading VIẾT HOA sang viết thường đầu câu
  (giữ nguyên chữ viết tắt: IBS, WHO, FODMAP, LES, CBT-I, HP…). Giữ số thứ tự gõ tay nếu bài có ("## 3. Nguyên tắc dễ nhớ…").
- In đậm/nghiêng: dùng `**…**` / `*…*` như Markdown (bản nháp dùng `<strong>`, `<em>` — đổi lại cho gọn).
- **Không còn emoji** trên trang (build sẽ báo lỗi). Danh sách có emoji đầu dòng → `<IconList items={[{ icon: '…', text: '…' }]} />`;
  ☐ → `<Checklist id="<slug>-<tên>" items={[…]} />`; 🚩 → `<IconList variant="canh-bao" items={…} />`; ✅ → `variant="check"`.
- Link YouTube trong bài → `<YouTube id="…" />` đặt ngay sau đoạn nói về video (bỏ link "Link"/URL thô lặp).
  Giữ câu dẫn của bài, ví dụ: "Vừa ăn, vừa xem điện thoại, đọc sách, làm việc:" rồi `<YouTube id="3OsABPm05gA" />`.
- Link thường giữ `[chữ](url)`; bỏ tham số theo dõi. Link Google Sheet tới mẫu nhật ký → thay bằng `<ToolLink tool="…" />`
  (công cụ trên web) và giữ thêm link gốc trong câu nếu bài nhắc tới.
- Ảnh: `import imgN from '~/assets/lessons/<slug>/<file>';` ở đầu thân bài, rồi
  `<Figure src={imgN} alt="mô tả cụ thể nội dung ảnh" caption="…">…chữ trong ảnh gõ lại…</Figure>`.
  **alt bắt buộc**, mô tả thật nội dung ảnh. Nếu ảnh có chữ: gõ lại NGUYÊN VĂN vào thân `<Figure>` (Markdown).
  Ảnh chụp bảng (ví dụ thực đơn #13) → gõ lại thành bảng Markdown thật.
- Lời trích của bệnh nhân / câu hỏi mở bài → `<Callout type="trich-dan">…</Callout>` hoặc blockquote `>`.
- Đoạn "Chiêm nghiệm"/"Thực hành": câu hỏi chiêm nghiệm → frontmatter `reflection` (đừng lặp lại trong thân bài,
  nhưng giữ câu dẫn nếu có). Phần "Thực hành" → `<Callout type="thuc-hanh" title="Thực hành tuần này">…</Callout>`
  + `<ToolLink tool="…" />` nếu có công cụ tương ứng.
- Câu nhấn mạnh quan trọng → `<Callout type="ghi-nho">`; lưu ý → `type="luu-y"`; dấu hiệu cần đi khám → `type="canh-bao"`.
- Con số có trong bài → có thể thêm `<NumberStrip items={[{ value: '20–30', unit: 'g/ngày', label: 'chất xơ (WHO)', icon: 'chat-xo' }]} />`.
- Component khối (Callout, Figure, sơ đồ…) phải **đứng riêng dòng, có dòng trống trước và sau**. Bên trong Callout, để dòng trống
  quanh nội dung Markdown (xem bài mẫu).
- Thoát ký tự MDX trong chữ: `{ } < >` → `\{ \} \< \>` (ví dụ "\<140 mg"), hoặc viết "dưới 140 mg" nếu bài viết vậy.

Component dùng được trực tiếp trong MDX (không cần import): `Callout`, `Figure`, `YouTube`, `VideoPlayer`, `IconList`,
`Checklist`, `References`, `ToolLink`, `Icon`, `BeBung`, `NumberStrip` và **mọi sơ đồ** trong `src/components/diagrams/{c0,c1,c2,c3,c4,them,chung}/`.

```mdx
<References items={[{ text: 'WHO Healthy diet fact sheet', url: 'https://…' }, { text: 'Harvard T.H. Chan – The Nutrition Source' }]} />
<VideoPlayer file="bai-tap-kich-thich-tiet-dich-tieu-hoa.mp4" title="…" duration="3:52" />
```

## 4. Sơ đồ — mỗi bài ≥ 1 sơ đồ "ưu tiên A", thêm "ưu tiên B" nếu hợp

Mỗi sơ đồ là **một file** `src/components/diagrams/<chương>/<TenSoDo>.astro` (PascalCase, tiếng Việt không dấu, tên duy nhất
toàn site), bọc trong `<Diagram>` và dựng từ primitive trong `src/components/diagrams/primitives/`. Đặt sơ đồ **ngay sau
đoạn văn nó minh họa** và khai báo tên trong frontmatter `diagrams`.

```astro
---
import Diagram from '../primitives/Diagram.astro';
import Flow from '../primitives/Flow.astro';
---
<Diagram title="…" icon="…" hue="sage" kicker="Sơ đồ" caption="câu chữ trong bài…" from={['07-bo-sung-loi-khuan-dung-cach']}>
  <Flow numbered steps={[{ icon: 'quiz', title: '…', text: '…' }]} />
</Diagram>
```

`<Diagram>` props: `title`, `icon`, `hue` (dao | sage | lav | bo | ngoc | hong | do), `kicker` ("Sơ đồ" | "Minh họa" | "Thực hành" | "So sánh"…),
`caption`, `from` (danh sách slug nguồn), `interactive` (true nếu có thao tác bấm).

Kiểu dữ liệu `Node` dùng chung: `{ icon?, title, text?, items?: string[], hue?, tag? }` — `title/text/items` hỗ trợ `**đậm**`, `*nghiêng*`.

| Primitive | Dùng khi | Props chính |
|---|---|---|
| `Flow` | chuỗi bước A → B → C (ngang khi đủ rộng, dọc trên điện thoại; ≤ 5 bước ngang) | `steps: Node[]`, `numbered`, `vertical`, `variant` |
| `Cycle` | vòng lặp (3–6 bước) quay lại bước đầu | `nodes: Node[]`, `center?: {title, icon, text}`, `breakAt?: {after, label}` |
| `Branches` | một nguồn → nhiều nhánh (→ một kết quả): "thác" cơ chế, nguyên nhân → hệ quả | `root: Node`, `branches: Node[]`, `result?: Node`, `via?` |
| `Compare` | so sánh 2–4 cột; "đèn giao thông" thực phẩm | `columns: [{title, icon, hue, sub, items: (string \| {icon,text})[], note}]`, `vs`, `tone="den-giao-thong"`, `compact` |
| `Equation` | A + B = C | `terms: Node[]`, `ops?: string[]` |
| `Layers` | kim tự tháp / bậc thang / chồng tầng | `layers: Node[]` (trên → dưới; stairs: thấp → cao), `shape: pyramid\|stairs\|stack`, `baseLabel`, `topLabel`, `highlight` |
| `Timeline` | mốc thời gian / một ngày / các giai đoạn | `items: [{time, title, text, icon, hue}]` |
| `NumberStrip` | con số cần nhớ (chỉ số có trong bài) | `items: [{value, unit, label, icon, hue}]`, `title` |
| `Balance` ⚡ | cán cân hai phía, bấm để thêm/bớt | `left/right: {title, icon, hue, items:[{icon,text}], on?}`, `messages: {left,right,even}` |
| `Wheel` ⚡ | bánh xe nhiều phần, bấm xem chi tiết | `segments: [{title, icon, hue, text, links}]`, `center: {title, mood \| icon}` |
| `FlipCards` ⚡ | thẻ lật Nhầm tưởng ↔ Sự thật (hoặc Hỏi ↔ Đáp) | `cards: [{front, back, icon}]`, `frontLabel`, `backLabel` |
| `StepTree` ⚡ | cây quyết định từng bước | `nodes: {id: {q, hint, options:[{label,to}]} \| {result:{tone: ok\|warn\|stop, title, text, icon}}}`, `start` |
| `Clock24` | đồng hồ 24 giờ, cung thời gian + mốc | `arcs: [{from, to, label, hue}]` (giờ thập phân), `marks: [{at, label, icon}]`, `center` |

Hình minh họa **vẽ tay bằng SVG** (khi primitive không đủ, ví dụ giải phẫu): xem `chung/TrucNaoRuot.astro` làm mẫu —
viewBox cố định, màu chỉ dùng biến CSS (`var(--ink)`, `var(--dao-fill)`…), nét 3–4px bo tròn, nhân vật có mặt kawaii
(2 chấm mắt, miệng cong, má hồng `var(--cheek)`), mọi nhãn là `<text>` thật ≥ 14px trong viewBox ~360 rộng, có `role="img"` + `aria-label`,
và một chú giải HTML bên cạnh. Không dùng mã màu hex, không `id` trong SVG.

Quy tắc chữ trên sơ đồ: **chỉ dùng chữ/ý có trong bài** (được rút gọn, nhưng không thêm ý mới); số liệu chỉ khi bài có.

## 5. Icon

Chỉ dùng icon có sẵn trong `src/icons/` (tên file không có `.svg`). **Không tự vẽ icon mới.** Nếu thật sự thiếu, dùng icon gần nghĩa
nhất và ghi đề xuất icon mới vào cuối sổ biên tập của chương (mục "Đề xuất icon").

Danh sách hiện có: bac-ha bac-si ban-do banh-ngot bao-thuc bieu-do bong-den ca-phe ca cam can-bang can-nang canh-bao canh cap-nhat
cau-thang chan chat-xo checklist chuoi co-do co-the com cong-cu cuoi da-day dau-an dau den-ngu di-bo dia dien-thoai do-chien
dong-ho-cat dong-ho dong dung duong ghe gian-co giuong hoi-tho hop-thoai in ke khien khoai kim-chi la-thu lap-lai laptop lich
lien-ket loi-khuan lua mat-troi may-bay may-stress men-tieu-hoa men-vi-sinh menu mi-goi mo-rong muc-tieu mui-ten-phai
mui-ten-trai mui-ten-xuong muoi nao ngu-trua nguoi nha nhan nhat-ky nhiet-ke nhom noi nuoc-co-gas nuoc ot phoi play quiz rau
ruot ruou-bia sach sai sao socola sparkle sua-chua sua suy-nghi tai-len tai-xuong the-ghi-nho thien thong-tin thu-gon
thuc-quan thuoc-la tim-cuoi tim-kiem tim tra-sua trai-cay trang truc-nao-ruot trung video vien-thuoc xoa

## 6. Dữ liệu học tập đi kèm mỗi bài

Mọi câu trích `trich` phải xuất hiện **nguyên văn** trong file MDX của bài `bai` (sau khi đã sửa lỗi chính tả) — script
`scripts/check-quotes.mjs` sẽ kiểm tra.

**Quiz** — `src/data/quiz/<slug>.json`, 3–6 câu, chỉ hỏi điều bài nói, đáp án sai phải "hợp lý nhưng sai theo bài":

```json
{ "lesson": "<slug>", "questions": [
  { "id": "q1", "type": "single | multi | dung-sai", "prompt": "…", "options": [{ "id": "a", "text": "…" }],
    "answer": ["a"], "explain": "giải thích, có thể **đậm**", "source": { "bai": "<slug>", "trich": "câu nguyên văn ≥ 6 ký tự" } } ] }
```
(`dung-sai`: options `[{ "id": "d", "text": "Đúng" }, { "id": "s", "text": "Sai" }]`.)

**Thuật ngữ** — `src/data/thuat-ngu/<chương>.json` (c1, c2, c3, c4, them), mảng các mục:
```json
[{ "id": "probiotic", "term": "Probiotic", "aliases": ["men vi sinh", "lợi khuẩn bổ sung"], "en": "Probiotic",
   "short": "≤ 160 ký tự", "definition": "định nghĩa theo đúng câu chữ bài", "icon": "men-vi-sinh",
   "source": { "bai": "06-loi-khuan-hieu-cho-dung", "trich": "…" } }]
```
Chỉ đưa thuật ngữ mà bài **có giải thích**. `en` chỉ điền nếu bài có ghi tiếng Anh.

**Dấu hiệu cần đi khám** — `src/data/canh-bao/<slug>.json` (chỉ bài có danh sách dấu hiệu cảnh báo):
```json
[{ "group": "tieu-hoa | giac-ngu | dinh-duong", "title": "…", "level": "nen-kham | kham-som",
   "items": [{ "text": "nguyên văn", "source": { "bai": "<slug>", "trich": "…" } }], "note": "…" }]
```

**Sổ biên tập** — `docs/ghi-chu-bien-tap/<chương>.md`, bảng:

| Bài | Vị trí (mục/đoạn) | Loại | Bản gốc | Đã sửa thành | Trạng thái |
|---|---|---|---|---|---|

Loại: `chính tả` · `lặp từ` · `dấu câu` · `đánh số` · `link` · `định dạng` · `dữ liệu bảng` · `nghi vấn y khoa`.
Trạng thái: `đã sửa` · `giữ nguyên – cần BS xác nhận`. Cuối file: mục "Đề xuất icon" (nếu có).

## 7. Kiểm tra trước khi bàn giao

```bash
npx astro build            # phải không lỗi (thiếu alt, icon sai tên, MDX lỗi cú pháp đều làm build hỏng)
node scripts/check-dist.mjs
node scripts/check-content.mjs
```
Rồi mở trang (preview) ở 375px và 1280px để xem sơ đồ có vỡ không (script chụp: `node scripts/shoot.mjs <url> <prefix> 375 light 10 800`).
