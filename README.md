# Bụng Êm, Việc Ổn — Sổ tay học Tiêu hóa

Web học tập (tĩnh) dựng từ chuỗi bản tin y khoa **“Bụng Êm, Việc Ổn”** của **BS. Phan Thị Lan Viên**
(cùng BS. Quỳnh Thư, ThS.BS. Diễm Khuê).

🌐 **https://thangvannguyen.github.io/tieu-hoa/**

> Thông tin tham khảo, không thay thế tư vấn y khoa.

## Có gì trên web

- **20 bài học** theo 4 chặng của chuỗi bản tin (dạ dày & thói quen → hệ vi sinh → giấc ngủ → dinh dưỡng phục hồi bệnh lý) + thư chào mừng + 3 bài thêm.
- **58 sơ đồ / hình minh họa** — mỗi bài ít nhất một; có sơ đồ tương tác (cán cân, bánh xe, cây quyết định, thẻ lật, đồng hồ giấc ngủ…).
- **125 icon SVG tự vẽ** cùng một phong cách + linh vật **Bé Bụng** 6 biểu cảm (xem trang `/bieu-tuong/`).
- **9 công cụ thực hành** thay cho file Excel / bảng trong bài: Checklist 7 ngày, Nhật ký IBS, Nhật ký giấc ngủ, chấm tim thói quen, kịch bản ngủ A/B (đồng hồ 24h), phiếu chuẩn bị đi khám, thực đơn, nhật ký lợi khuẩn, kế hoạch 7 ngày — dữ liệu lưu trên máy người dùng, có sao lưu / xuất CSV / in.
- **Ôn tập**: 105 câu quiz, thẻ ghi nhớ 58 thuật ngữ; trang **Khi nào cần đi khám**, **So sánh dinh dưỡng 4 bệnh lý**; tìm kiếm (gõ không dấu cũng được); chế độ sáng / tối.

## Nguyên tắc biên tập

Giữ nguyên ý và câu chữ của bác sĩ, chỉ sửa lỗi rõ ràng; **không thêm kiến thức y khoa mới**. Mọi chỗ sửa và mọi nghi vấn
chuyên môn nằm trong [`docs/ghi-chu-bien-tap/`](docs/ghi-chu-bien-tap/README.md) — có danh sách các mục cần bác sĩ xác nhận.

## Cấu trúc repo

```
tai-lieu-goc/              file gốc (.docx, .xlsx) xếp theo chương — xem tai-lieu-goc/MUC-LUC.md
public/videos/             2 video mp4 (+ poster SVG)
src/content/lessons/       mỗi bài học là một file .mdx
src/components/diagrams/   primitives/ (khung sơ đồ dùng chung) + c0…c4, them, chung (sơ đồ từng chương)
src/components/tools/      các công cụ thực hành;  src/tools/schemas/ — cấu hình nhật ký
src/icons/                 icon SVG (lưới 24, nét 1.75, lớp sticker pastel)
src/data/                  quiz, thuật ngữ, dấu hiệu cảnh báo, so sánh dinh dưỡng, thực đơn mẫu, YouTube
scripts/                   chuyển docx → MDX, đọc xlsx, lấy dữ liệu YouTube, các bước kiểm tra, chụp màn hình
docs/                      hướng dẫn biên tập, hệ thống thiết kế, sổ biên tập
```

## Chạy trên máy

```bash
npm install
npm run dev          # http://localhost:4321/tieu-hoa/
npm run build        # build + tạo chỉ mục tìm kiếm Pagefind
npm run preview
npm run build:ci     # như CI: type check + build + kiểm tra dist + kiểm tra nội dung
```

Kiểm tra thêm (chạy với `npm run preview` đang mở):

```bash
python3 -I scripts/check_fidelity.py          # so từng câu docx gốc với trang đã build
node scripts/qa-axe.mjs http://localhost:4321/tieu-hoa light   # trợ năng (axe)
npx html-validate "dist/**/*.html"
```

Thêm / sửa bài: đọc [`docs/huong-dan-bien-tap.md`](docs/huong-dan-bien-tap.md) và [`docs/he-thong-thiet-ke.md`](docs/he-thong-thiet-ke.md).
Mỗi lần push lên `main`, GitHub Actions tự build, kiểm tra và deploy lên GitHub Pages.
