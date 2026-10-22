import type { DiarySchema } from './types';

/** Nhật ký giấc ngủ — 6 câu mỗi sáng + các câu trong ngày (bản tin #09), 3 câu hỏi mở rộng (bản tin #10). */
export const nhatKyGiacNgu: DiarySchema = {
  id: 'nhat-ky-giac-ngu',
  version: 1,
  days: 7,
  daysOptions: [7, 14],
  groups: [
    {
      id: 'buoi-sang', label: 'Mỗi sáng, ghi lại sáu thông tin', icon: 'mat-troi', hue: 'bo',
      fields: [
        { id: 'len-giuong', label: '1. Tôi lên giường lúc mấy giờ?', type: 'time' },
        { id: 'ngu-duoc', label: '2. Tôi ước tính ngủ được lúc mấy giờ?', type: 'time' },
        { id: 'thuc-day', label: '3. Tôi thức dậy lần cuối lúc mấy giờ?', type: 'time' },
        { id: 'roi-giuong', label: '4. Tôi rời giường lúc mấy giờ?', type: 'time' },
        { id: 'chat-luong', label: '5. Tôi đánh giá chất lượng giấc ngủ từ 0 đến 10 điểm.', type: 'scale', min: 0, max: 10 },
        { id: 'tinh-tao', label: '6. Tôi đánh giá mức tỉnh táo từ 8 giờ sáng đến 5 giờ chiều từ 0 đến 10 điểm.', type: 'scale', min: 0, max: 10 },
      ],
    },
    {
      id: 'trong-ngay', label: 'Trong ngày, ghi thêm', icon: 'laptop', hue: 'lav',
      fields: [
        { id: 'ngu-trua', label: 'Có ngủ trưa không? Bao lâu?', type: 'text' },
        { id: 'caffeine', label: 'Ly caffeine cuối cùng được dùng lúc mấy giờ?', type: 'time' },
        { id: 'buon-ngu', label: 'Có buồn ngủ trong cuộc họp, khi đọc tài liệu hoặc khi lái xe không?', type: 'text' },
        { id: 'hieu-qua', label: 'Khung giờ nào làm việc hiệu quả nhất?', type: 'text' },
        { id: 'sai-sot', label: 'Khung giờ nào dễ sai sót hoặc trì hoãn nhất?', type: 'text' },
      ],
    },
  ],
  durations: [
    { label: 'Thời gian nằm trên giường', from: 'len-giuong', to: 'roi-giuong' },
    { label: 'Thời gian ngủ ước tính', from: 'ngu-duoc', to: 'thuc-day' },
  ],
  charts: [
    { field: 'chat-luong', label: 'Chất lượng giấc ngủ (0–10)', hue: 'lav' },
    { field: 'tinh-tao', label: 'Mức tỉnh táo 8h–17h (0–10)', hue: 'bo' },
  ],
  summary: {
    title: '3 câu hỏi ngắn về giấc ngủ (bản tin #10)',
    colA: 'Câu hỏi',
    colB: 'Câu trả lời của bạn',
    rows: [
      { id: 'thoi-luong', label: '1. Thời lượng: Bạn thường ngủ được bao nhiêu giờ mỗi đêm?' },
      { id: 'chat-luong', label: '2. Chất lượng: Ngủ có sâu? Người ngủ cùng có than phiền? Cảm giác có sảng khoái khi thức dậy? Ban ngày có buồn ngủ, mệt mỏi, kém tập trung?' },
      { id: 'thoi-diem', label: '3. Thời điểm: Lịch ngủ có đều không? Quá sớm? Quá trễ?' },
    ],
    closing: 'Mục tiêu của bài thực hành không phải là tạo ra một tuần hoàn hảo. Mục tiêu là phát hiện thói quen ngủ của bản thân.',
  },
};
