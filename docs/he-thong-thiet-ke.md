# Hệ thống thiết kế “dễ thương” — Bụng Êm, Việc Ổn

Mục tiêu: một web học **ấm áp, dễ thương nhưng gọn gàng**, nhất quán giữa chữ, icon, sơ đồ và công cụ — ở cả chế độ sáng và tối.

## Màu (src/styles/tokens.css)

| Token | Sáng | Dùng cho |
|---|---|---|
| `--bg` / `--bg-2` | `#fff9f0` / `#fff3e3` | nền kem |
| `--surface` / `--surface-2` | `#ffffff` / `#fff7ec` | thẻ, ô nhập |
| `--ink` / `--ink-2` / `--ink-3` | `#4a3b35` / `#6b5850` / `#8c776c` | chữ nâu ấm (không dùng đen tuyền), viền nét |
| `--line` / `--line-2` | `#eddfcd` / `#dcc7b0` | viền nhạt |
| `--cheek` | `#f59c9c` | má hồng của nhân vật |

Mỗi **hue** có 3 mức `-fill` (nền pastel), base (khối/đường), `-ink` (chữ, đạt tương phản ≥ 4.5:1):

| Hue | Dùng cho | base |
|---|---|---|
| `dao` (đào) | Chương 1 · Dạ dày | `#f4a988` |
| `sage` | Chương 2 · Vi sinh | `#8cc7a1` |
| `lav` (lavender) | Chương 3 · Giấc ngủ | `#a9b4e8` |
| `bo` (vàng bơ) | Chương 4 · Dinh dưỡng | `#f5d17a` |
| `ngoc` (xanh ngọc) | Bài thêm | `#7cc6c6` |
| `hong` | Chào mừng, chiêm nghiệm | `#f2a7b8` |
| `do` | cảnh báo, “đi khám” | `#e8786d` |

Đặt `data-hue="sage"` trên một phần tử → mọi component bên trong dùng `--h-fill / --h / --h-ink` của hue đó.
Dark mode: định nghĩa lại cùng token (theo `prefers-color-scheme` và nút chuyển `data-theme`).

## Chữ

- Tiêu đề: **Nunito** (bo tròn, đậm 800–900). Thân bài: **Be Vietnam Pro** 17px / 1.7 — hiển thị dấu tiếng Việt chuẩn.
- Tự host qua `@fontsource` (import file theo trọng lượng, không import riêng subset vietnamese).

## Hình khối

- Bo góc: 8 / 12 / 20 / 28px. Viền 2px `--ink` + bóng “offset” `0 3–4px 0 var(--ink)` cho thẻ nổi (cảm giác sticker).
- Nút: viên thuốc tròn, viền đậm, bóng offset; nhấn thì “lún” xuống.
- Nền chấm bi nhẹ cho khung sơ đồ, đường phân cách lượn sóng, blob mềm ở hero.

## Icon (src/icons/*.svg)

- `viewBox="0 0 24 24"`, `fill="none" stroke="currentColor" stroke-width="1.75"`, đầu nét & góc bo tròn.
- Lớp **sticker**: một bản sao hình chính, lệch ~1.3px xuống phải, `class="ic-sticker"` (tô `--ic-fill`, mặc định `--h-fill`).
- Nhân vật (dạ dày, ruột, lợi khuẩn, đồ ăn, trăng, mây stress…) có **mặt kawaii**: 2 chấm mắt `ic-ink`, miệng cong, má `ic-blush`.
- Cấm: mã màu hex, `id`, `<text>`, `<image>`, thuộc tính `style`. Icon < 20px tự ẩn lớp sticker và má hồng.
- Dùng: `<Icon name="loi-khuan" size={28} />`; xem toàn bộ ở trang `/bieu-tuong/`.

## Linh vật “Bé Bụng” (src/components/ui/BeBung.astro)

Chiếc dạ dày tròn, 6 biểu cảm: `vui`, `khoe`, `suy-nghi`, `lo-lang`, `dau` (có đốm lửa), `buon-ngu`. Luôn giữ màu đào kiểu sticker
(viền trắng) ở cả dark mode. Dùng ở hero, chiêm nghiệm, quiz, 404, các trang phụ.

## Sơ đồ

- Primitive dùng chung trong `src/components/diagrams/primitives/` (Flow, Cycle, Branches, Compare, Equation, Layers, Timeline,
  NumberStrip, Balance⚡, Wheel⚡, FlipCards⚡, StepTree⚡, Clock24) — dựng bằng HTML/CSS + icon, tự xếp dọc trên điện thoại
  (container query).
- Hình minh họa vẽ tay bằng SVG khi cần giải phẫu / cảnh: viewBox cố định, màu bằng biến CSS, nét 3–4px, chữ là `<text>` thật ≥ 14px.
- Mỗi sơ đồ bọc trong `<Diagram>` (tiêu đề, icon, chú thích, nguồn “Theo bản tin #…”).
- Chỉ dùng chữ/ý có trong bài gốc. Xem `docs/huong-dan-bien-tap.md`.

## Trợ năng

- Tương phản chữ ≥ 4.5:1, focus ring 3px rõ ràng, mọi thao tác bấm bằng `<button>`/input thật, dùng được bằng bàn phím.
- Sơ đồ tĩnh có tiêu đề + chú thích; sơ đồ tương tác có trạng thái `aria-pressed` / `aria-live`.
- Tôn trọng `prefers-reduced-motion`.

## Cài đặt hiển thị (nút ⚙ trên thanh đầu trang)

Lưu trong `bev:v1:prefs` (localStorage), áp dụng sớm trong `<head>` để không nháy giao diện. Code: `src/lib/display.ts`,
`src/components/ui/SettingsDialog.astro`, CSS: `src/styles/themes.css`.

| Thuộc tính trên `<html>` | Giá trị | Ý nghĩa |
|---|---|---|
| `data-style` | *(không có)* = **Dễ thương** (mặc định) · `de-doc` · `don-gian` · `tuong-phan` | Phong cách. Không giao diện nào đổi cỡ chữ. |
| `data-size` | `nho` (87,5%) · *(không có)* = **Vừa** (100%, mặc định) · `to` (112,5%) | Cỡ chữ cho mọi giao diện — mọi kích thước dùng `rem` nên co giãn đều. |
| `data-theme` | *(không có)* = theo máy · `light` · `dark` | Chế độ màu, kết hợp được với mọi giao diện. |
| `data-bottombar` | *(không có)* = bật (mặc định) · `off` | Thanh tiện ích cố định ở đáy màn hình trên điện thoại / máy tính bảng (≤ 1060px hoặc màn hình cảm ứng ≤ 1366px): Trang chủ · Bài học · Tìm kiếm · Ôn tập · Công cụ. Tự ẩn khi đang gõ chữ. |
| `data-totop-mobile` | *(không có)* = ẩn (mặc định) · `on` | Nút Lên đầu trang trên điện thoại / máy tính bảng. Trên máy tính luôn hiện. |

- **Dễ đọc**: trang "học chữ là chính" — nền trắng (tối: xám đen trung tính), chữ đen rõ, tiêu đề cùng font thân bài, không chữ nghiêng,
  icon chỉ còn nét, bỏ hình trang trí ở hero, bỏ bóng sticker.
- **Đơn giản**: giữ bảng màu kem + pastel và icon sticker, nhưng bỏ bóng đổ, họa tiết chấm, hình trang trí và chuyển động.
- **Tương phản cao**: đen/trắng, viền đậm, link nội dung gạch chân, focus vàng/đen dày.
- Nút **Lên đầu trang** (góc dưới bên phải, vòng tròn = tiến độ đọc): luôn có trên máy tính; trên điện thoại / máy tính bảng mặc định ẩn, bật được trong cài đặt; tự nhích lên trên thanh tiện ích khi thanh đang hiện.
- Khi thêm component mới: chỉ dùng token (`--bg`, `--surface`, `--ink…`, `--edge`, `--edge-shadow`, `--h…`) và `rem` thì tự đúng cho mọi giao diện và cỡ chữ.
