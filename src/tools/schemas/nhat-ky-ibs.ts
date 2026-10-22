import type { DiarySchema } from './types';
import { checklist7Ngay } from './checklist-7-ngay';

/** Dựng lại từ "15 - IBS_ Mẫu nhật ký.xlsx". Các lỗi dropdown của file gốc đã sửa — xem docs/ghi-chu-bien-tap/cong-cu.md */
export const nhatKyIbs: DiarySchema = {
  id: 'nhat-ky-ibs',
  version: 1,
  days: 10,
  daysOptions: [7, 10, 14],
  groups: [
    {
      id: 'tin-hieu', label: 'Tín hiệu cơ thể', hint: 'Cơ thể đã nói với bạn bằng những biểu hiện gì?', icon: 'da-day', hue: 'dao',
      fields: [
        { id: 'day-hoi', label: 'Mức độ đầy hơi, chướng bụng của bạn hôm nay', type: 'scale', min: 0, max: 10, anchors: { 0: 'Không đầy hơi', 1: 'Thoải mái, nhẹ bụng, không đầy hơi', 5: '5- 6 Hơi đầy hơi sau ăn', 10: 'Cực kỳ đầy hơi, chướng bụng' } },
        { id: 'xi-hoi', label: 'Mức độ xì hơi', type: 'scale', min: 0, max: 10 },
        { id: 'di-kem', label: 'Dấu hiệu đi kèm, mô tả chi tiết tình trạng tiêu hóa', type: 'textarea' },
        { id: 'moi-nang', label: 'Dấu hiệu mới xuất hiện hoặc nặng hơn', type: 'text' },
        { id: 'nhe-giam', label: 'Dấu hiệu nhẹ hơn và giảm dần', type: 'text' },
      ],
    },
    {
      id: 'dinh-duong', label: 'Dinh dưỡng', icon: 'com', hue: 'sage',
      fields: [
        { id: 'an-gi', label: 'Bạn đã ăn gì hôm nay?', hint: 'ghi ngắn gọn', type: 'textarea' },
        { id: 'mon-anh-huong', label: 'Có món ăn nào ảnh hưởng đến tình trạng tiêu hóa của bạn?', type: 'text' },
        { id: 'di-tieu', label: 'Tình trạng đi tiêu của bạn thế nào', type: 'choice', options: [{ value: 'binh-thuong', label: 'Bình thường' }, { value: 'hon-hop', label: 'Hỗn hợp' }, { value: 'bon', label: 'Bón' }, { value: 'tieu-chay', label: 'Tiêu chảy' }] },
      ],
    },
    {
      id: 'nhip-song', label: 'Nhịp sống', icon: 'lich', hue: 'bo',
      fields: [
        { id: 'thay-doi', label: 'Hôm nay có thay đổi gì trong sinh hoạt hoặc môi trường không?', type: 'choice', options: [{ value: 'khong', label: 'Không' }, { value: 'it', label: 'Có thay đổi ít' }, { value: 'nhieu', label: 'Có thay đổi nhiều' }] },
      ],
    },
    {
      id: 'van-dong', label: 'Vận động', icon: 'di-bo', hue: 'lav',
      fields: [
        { id: 'muc-van-dong', label: 'Mức độ vận động của bạn trong ngày', type: 'choice', options: [{ value: 'cao', label: 'Cao' }, { value: 'tb', label: 'Trung bình' }, { value: 'thap', label: 'Thấp' }] },
        { id: 'thoi-luong', label: 'Thời lượng vận động của bạn hơn 30 phút', type: 'choice', options: [{ value: 'tren', label: '> 30 phút' }, { value: 'duoi', label: '< 30 phút' }] },
      ],
    },
    {
      id: 'giac-ngu', label: 'Giấc ngủ', icon: 'trang', hue: 'ngoc',
      fields: [
        { id: 'gio-ngu', label: 'Đêm qua bạn ngủ được mấy tiếng', type: 'choice', options: [{ value: 'duoi-6', label: '< 6 tiếng' }, { value: '6-7', label: '6-7 tiếng' }, { value: 'tren-7', label: '> 7 tiếng' }] },
        { id: 'sang-khoai', label: 'Mức độ sảng khoái của bạn sau khi ngủ dậy (1-10)', type: 'scale', min: 1, max: 10, anchors: { 1: 'Cực kỳ uể oải', 5: '5- 6 Tạm ổn', 10: 'Cực kỳ sảng khoái' } },
      ],
    },
    {
      id: 'nang-luong', label: 'Năng lượng & cảm xúc', icon: 'tim', hue: 'hong',
      fields: [
        { id: 'stress', label: 'Mức độ stress chung của ngày hôm nay của bạn (1-10)', type: 'scale', min: 1, max: 10, anchors: { 1: 'Thoải mái, không stress', 5: 'Tạm ổn', 6: 'Hơi stress', 7: 'Stress trung bình', 8: 'Stress khá nhiều', 9: 'Stress nhiều', 10: 'Vô cùng stress' } },
        { id: 'nang-luong', label: 'Mức năng lượng tổng thể hôm nay của bạn (1-10)', type: 'scale', min: 1, max: 10, anchors: { 1: 'Năng lượng cạn kiệt', 5: '5- 6 Năng lượng trung bình', 10: 'Năng lượng cực cao' } },
        { id: 'cam-thay', label: 'Hôm nay bạn cảm thấy thế nào?', type: 'text' },
      ],
    },
    {
      id: 'ghi-chu', label: 'Ghi chú', icon: 'ke', hue: 'do',
      fields: [
        { id: 'ghi-chu', label: 'Ghi chú khác', hint: 'thuốc/ thực phẩm/ các thói quen - lối sống - bối cảnh mà bạn nghĩ có thể ảnh hưởng đến vấn đề mình quan sát', type: 'textarea' },
      ],
    },
  ],
  charts: [
    { field: 'day-hoi', label: 'Đầy hơi, chướng bụng', hue: 'dao' },
    { field: 'xi-hoi', label: 'Xì hơi', hue: 'bo' },
    { field: 'sang-khoai', label: 'Sảng khoái sau ngủ dậy', hue: 'lav' },
    { field: 'stress', label: 'Mức độ stress', hue: 'do' },
    { field: 'nang-luong', label: 'Mức năng lượng', hue: 'sage' },
  ],
  summary: { ...checklist7Ngay.summary!, closing: undefined },
};
