# Bụng Êm, Việc Ổn — Sổ tay học Tiêu hóa

Web học tập (tĩnh) dựng từ chuỗi bản tin y khoa **“Bụng Êm, Việc Ổn”** của **BS. Phan Thị Lan Viên**
(cùng BS. Quỳnh Thư, ThS.BS. Diễm Khuê): 16 bản tin + thư chào mừng + bài thêm, có sơ đồ minh họa cho từng bài,
bộ icon SVG tự vẽ, quiz, thuật ngữ và các công cụ thực hành (nhật ký, checklist) chạy ngay trên trình duyệt.

🌐 https://thangvannguyen.github.io/tieu-hoa/

> Thông tin tham khảo, không thay thế tư vấn y khoa.

## Cấu trúc repo

```
tai-lieu-goc/      file gốc (.docx, .xlsx) xếp theo chương — xem tai-lieu-goc/MUC-LUC.md
public/videos/     2 video mp4 (đã chuyển moov lên đầu để phát ngay)
src/content/lessons/   mỗi bài học là một file .mdx
src/components/diagrams/   sơ đồ: primitives/ (khung dùng chung) + c0…c4, them, chung (theo chương)
src/icons/         bộ icon SVG tự vẽ (lưới 24, nét 1.75, lớp sticker pastel)
src/data/          quiz, thuật ngữ, dấu hiệu cảnh báo, công cụ, dữ liệu YouTube
scripts/           chuyển docx → MDX, lấy dữ liệu YouTube, kiểm tra nội dung/dist, chụp màn hình
docs/              hướng dẫn biên tập, hệ thống thiết kế, sổ biên tập (các chỗ đã sửa + câu hỏi cho BS)
```

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:4321/tieu-hoa/
npm run build      # build + tạo chỉ mục tìm kiếm Pagefind
npm run preview
npm run build:ci   # như CI: type check + build + kiểm tra dist + kiểm tra nội dung
```

Thêm/sửa bài: đọc `docs/huong-dan-bien-tap.md`. Mỗi lần push lên `main`, GitHub Actions tự build và deploy.
