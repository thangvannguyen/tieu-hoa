import type { Hue } from '~/lib/types';

export interface ToolInfo {
  id: string;
  title: string;
  short: string;
  icon: string;
  hue: Hue;
  /** bài gốc */
  lesson: string;
  /** file gốc (nếu được dựng lại từ Excel) */
  xlsx?: string;
}

export const tools: ToolInfo[] = [
  { id: 'checklist-7-ngay', title: 'Checklist 7 ngày – Bản đồ cơ thể', short: 'Mỗi ngày vài phút quan sát tín hiệu cơ thể, ăn uống, nhịp sống, vận động, giấc ngủ, năng lượng & cảm xúc.', icon: 'ban-do', hue: 'dao', lesson: '04-suc-khoe-tinh-than-ban-do-co-the', xlsx: '04 - Checklist 7 ngày nhìn lại cơ thể và hệ tiêu hóa của bạn.xlsx' },
  { id: 'cham-tim-thoi-quen', title: 'Chấm tim thói quen', short: 'Chấm “trái tim động lực” cho từng thói quen và chọn một thói quen để bắt đầu tuần này.', icon: 'tim', hue: 'hong', lesson: '02-giai-ma-thoi-quen' },
  { id: 'nhat-ky-loi-khuan-5-ngay', title: 'Nhật ký 5 ngày bổ sung lợi khuẩn', short: 'Ghi lại sản phẩm/món đã dùng, lượng dùng và bụng phản ứng ra sao.', icon: 'sua-chua', hue: 'sage', lesson: '07-bo-sung-loi-khuan-dung-cach' },
  { id: 'ke-hoach-7-ngay-vi-sinh', title: 'Kế hoạch 7 ngày duy trì hệ vi sinh', short: 'Mỗi ngày: mình đã thêm gì để nuôi lợi khuẩn, đã giảm gì, bụng hôm nay thế nào.', icon: 'loi-khuan', hue: 'sage', lesson: '08-nuoi-duong-he-vi-sinh-ben-vung' },
  { id: 'nhat-ky-giac-ngu', title: 'Nhật ký giấc ngủ', short: 'Mỗi sáng ghi giờ lên giường, giờ ngủ được, giờ thức dậy, chất lượng ngủ và mức tỉnh táo.', icon: 'trang', hue: 'lav', lesson: '09-giac-ngu-khong-lang-phi' },
  { id: 'kich-ban-giac-ngu', title: 'Thiết kế hai kịch bản ngủ A/B', short: 'Lên kế hoạch cho ngày làm việc bình thường và ngày tăng ca / làm đêm.', icon: 'dong-ho', hue: 'lav', lesson: '11-bo-cong-cu-bao-ve-giac-ngu' },
  { id: 'chuan-bi-kham-giac-ngu', title: 'Phiếu chuẩn bị buổi khám giấc ngủ', short: 'Chuẩn bị 5 phần thông tin để buổi khám giấc ngủ hiệu quả hơn.', icon: 'bac-si', hue: 'lav', lesson: '12-khi-nao-can-dieu-tri-giac-ngu' },
  { id: 'thuc-don-cua-toi', title: 'Thực đơn của tôi', short: 'Dựa trên thực đơn mẫu, tự điều chỉnh thực đơn một ngày cho phù hợp với mình.', icon: 'com', hue: 'bo', lesson: '13-dinh-duong-trao-nguoc' },
  { id: 'nhat-ky-ibs', title: 'Nhật ký tình trạng tiêu hóa (IBS)', short: 'Theo dõi mỗi ngày tín hiệu cơ thể, ăn uống, đi tiêu, nhịp sống, vận động, giấc ngủ và cảm xúc.', icon: 'nhat-ky', hue: 'bo', lesson: '15-dinh-duong-ibs', xlsx: '15 - IBS_ Mẫu nhật ký.xlsx' },
];

export const toolById: Record<string, ToolInfo> = Object.fromEntries(tools.map((t) => [t.id, t]));
