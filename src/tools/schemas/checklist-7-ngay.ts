import type { DiarySchema } from './types';

/** Dựng lại từ "04 - Checklist 7 ngày nhìn lại cơ thể và hệ tiêu hóa của bạn.xlsx" (sheet "Kiểm tra hàng ngày nào!" + "Tổng kết"). */
const scale10 = (id: string, label: string, anchors?: Record<number, string>) => ({ id, label, type: 'scale' as const, min: 1, max: 10, anchors });

export const checklist7Ngay: DiarySchema = {
  id: 'checklist-7-ngay',
  version: 1,
  days: 7,
  groups: [
    {
      id: 'tin-hieu', label: 'Tín hiệu cơ thể', hint: 'Cơ thể đã nói với bạn bằng những biểu hiện gì?', icon: 'da-day', hue: 'dao',
      fields: [
        { id: 'dau-hieu', label: 'Dấu hiệu nổi bật nhất hôm nay', type: 'text' },
        scale10('muc-do', 'Mức độ của dấu hiệu nổi bật nhất', { 1: 'Nhẹ, ít', 10: 'Nặng, khó chịu nhiều' }),
        { id: 'moi-nang', label: 'Dấu hiệu mới xuất hiện hoặc nặng hơn', type: 'text' },
        { id: 'nhe-giam', label: 'Dấu hiệu nhẹ hơn và giảm dần (1-10)', type: 'text' },
      ],
    },
    {
      id: 'dinh-duong', label: 'Dinh dưỡng & phản ứng', icon: 'com', hue: 'sage',
      fields: [
        { id: 'kho-chiu', label: 'Có điều gì có thể làm cho hệ tiêu hóa của bạn khó chịu hơn?', hint: 'thức ăn, stress, thiếu ngủ, nghiện chất, vận động...', type: 'textarea' },
        { id: 'an-gi', label: 'Bạn đã ăn gì hôm nay?', hint: 'ghi ngắn gọn', type: 'textarea' },
        { id: 'sau-an', label: 'Cơ thể phản ứng thế nào sau ăn?', hint: 'tiêu hoá, đầy bụng, buồn ngủ, tụt năng lượng...', type: 'textarea' },
        { id: 'di-tieu', label: 'Tình trạng đi tiêu/ tiểu của bạn thế nào', type: 'text' },
        { id: 'khac', label: 'Điều gì khác về dinh dưỡng mà bạn muốn chia sẻ', type: 'text' },
      ],
    },
    {
      id: 'nhip-song', label: 'Nhịp sống', icon: 'lich', hue: 'bo',
      fields: [
        { id: 'thay-doi', label: 'Hôm nay có thay đổi gì trong sinh hoạt hoặc môi trường không?', type: 'text' },
        { id: 'phan-ung', label: 'Cơ thể phản ứng với thay đổi đó thế nào?', type: 'text' },
      ],
    },
    {
      id: 'van-dong', label: 'Vận động', icon: 'di-bo', hue: 'lav',
      fields: [
        { id: 'muc-van-dong', label: 'Mức độ vận động của bạn trong ngày', type: 'choice', options: [{ value: 'cao', label: 'Cao' }, { value: 'tb', label: 'Trung bình' }, { value: 'thap', label: 'Thấp' }] },
        { id: 'tren-30', label: 'Thời lượng vận động của bạn hơn 30 phút', type: 'choice', options: [{ value: 'co', label: 'Có' }, { value: 'khong', label: 'Không' }] },
      ],
    },
    {
      id: 'giac-ngu', label: 'Giấc ngủ', icon: 'trang', hue: 'ngoc',
      fields: [
        { id: 'gio-ngu', label: 'Đêm qua bạn ngủ được mấy tiếng', type: 'number', unit: 'tiếng', step: 0.5, min: 0, max: 24 },
        scale10('sang-khoai', 'Mức độ sảng khoái của bạn sau khi ngủ dậy (1-10)'),
      ],
    },
    {
      id: 'nang-luong', label: 'Năng lượng & cảm xúc', icon: 'tim', hue: 'hong',
      fields: [
        scale10('stress', 'Mức độ stress chung của ngày hôm nay của bạn (1-10)'),
        scale10('nang-luong', 'Mức năng lượng tổng thể hôm nay của bạn (1-10)'),
        { id: 'cam-thay', label: 'Hôm nay bạn cảm thấy thế nào?', type: 'text' },
      ],
    },
    {
      id: 'quan-sat', label: 'Quan sát', icon: 'suy-nghi', hue: 'do',
      fields: [
        { id: 'nhan-ra', label: 'Điều bạn bắt đầu nhận ra', type: 'textarea' },
        { id: 'thanh-qua', label: 'Ghi nhận thành quả', type: 'textarea' },
        { id: 'thach-thuc', label: 'Thách thức bạn đang gặp', type: 'textarea' },
      ],
    },
  ],
  charts: [
    { field: 'muc-do', label: 'Mức độ dấu hiệu nổi bật', hue: 'dao' },
    { field: 'gio-ngu', label: 'Số tiếng ngủ', hue: 'ngoc' },
    { field: 'sang-khoai', label: 'Sảng khoái sau ngủ dậy', hue: 'lav' },
    { field: 'stress', label: 'Mức độ stress', hue: 'do' },
    { field: 'nang-luong', label: 'Mức năng lượng', hue: 'bo' },
  ],
  summary: {
    title: 'Tổng kết',
    colA: 'Điều đang lặp lại',
    colB: 'Quan sát nổi bật',
    rows: [
      { id: 'trieu-chung', label: 'Triệu chứng xuất hiện nhiều' },
      { id: 'mon-an', label: 'Những món ăn dễ gây phản ứng' },
      { id: 'di-tieu', label: 'Tình trạng đi tiêu - đi tiểu của bạn' },
      { id: 'yeu-to', label: 'Các yếu tố dễ làm cơ thể nhạy hơn' },
      { id: 'nhip-song', label: 'Nhịp sống của bạn' },
      { id: 'van-dong', label: 'Tình trạng vận động' },
      { id: 'giac-ngu', label: 'Giấc ngủ của bạn' },
      { id: 'nang-luong', label: 'Mức năng lượng nhìn chung' },
      { id: 'nhan-ra', label: 'Điều bạn nhận ra' },
      { id: 'dieu-chinh', label: 'Điều bạn muốn bắt đầu điều chỉnh' },
    ],
    closing:
      'Checklist 7 ngày nhìn lại cơ thể này không giúp bạn chẩn bệnh hay chữa bệnh nhưng nó như một tấm bản đồ để bạn có thể nhìn thấy rõ hơn những mô thức phản ứng của cơ thể mình, của hệ tiêu hóa của mình, hi vọng nó sẽ giúp bạn sáng rõ hơn, thấu hiểu hơn về chính một người bạn lặng lẽ đồng hành cùng bạn suốt cuộc đời này: cơ thể của bạn',
  },
};
