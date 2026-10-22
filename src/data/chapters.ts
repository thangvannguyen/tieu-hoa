import type { Hue } from '~/lib/types';

export interface Chapter {
  id: 'c0' | 'c1' | 'c2' | 'c3' | 'c4' | 'them';
  so: number;
  title: string;
  short: string;
  hue: Hue;
  icon: string;
  /** câu mô tả lấy nguyên văn từ thư chào mừng (bài 00) */
  description: string;
}

export const chapters: Chapter[] = [
  {
    id: 'c0', so: 0, title: 'Bắt đầu', short: 'Bắt đầu', hue: 'hong', icon: 'la-thu',
    description: 'Chào mừng bạn đến với hành trình giúp giữ ổn định hệ tiêu hóa trong đời sống bận rộn.',
  },
  {
    id: 'c1', so: 1, title: 'Hiểu dạ dày & thói quen', short: 'Dạ dày', hue: 'dao', icon: 'da-day',
    description: 'Chuỗi bài viết giúp nhân viên văn phòng hiểu đúng vì sao dạ dày chưa ổn để điều chỉnh lại nhịp sống, giữ hiệu suất và sức khỏe lâu dài.',
  },
  {
    id: 'c2', so: 2, title: 'Hệ vi sinh đường ruột', short: 'Vi sinh', hue: 'sage', icon: 'loi-khuan',
    description: 'Chuỗi bài giúp nuôi dưỡng hệ vi sinh đường ruột - chìa khóa vàng giúp cải thiện sức khỏe hệ tiêu hóa nói riêng và sức đề kháng của cơ thể nói chung.',
  },
  {
    id: 'c3', so: 3, title: 'Giấc ngủ', short: 'Giấc ngủ', hue: 'lav', icon: 'trang',
    description: 'Chuỗi bài về cải thiện chất lượng giấc ngủ dành cho nhân viên văn phòng bận rộn.',
  },
  {
    id: 'c4', so: 4, title: 'Dinh dưỡng phục hồi bệnh lý', short: 'Dinh dưỡng', hue: 'bo', icon: 'com',
    description: 'Dinh dưỡng phục hồi bệnh lý đường tiêu hóa thường gặp: trào ngược dạ dày - thực quản, viêm loét dạ dày, hội chứng ruột kích thích, táo bón.',
  },
  {
    id: 'them', so: 5, title: 'Bài thêm', short: 'Bài thêm', hue: 'ngoc', icon: 'sao',
    description: 'Bài tập vận động, kỹ năng đọc nhãn thực phẩm và video chia sẻ thêm của BS Lan Viên.',
  },
];

export const chapterById = Object.fromEntries(chapters.map((c) => [c.id, c])) as Record<Chapter['id'], Chapter>;
