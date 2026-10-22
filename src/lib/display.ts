/** Giao diện (data-style), cỡ chữ (data-size), chế độ màu (data-theme), thanh tiện ích (data-bottombar), nút lên đầu trang trên di động (data-totop-mobile) trên <html>. */
export type StyleId = 'mac-dinh' | 'de-doc' | 'don-gian' | 'tuong-phan';
export type SizeId = 'nho' | 'vua' | 'to';

export const STYLES: { value: StyleId; label: string; desc: string }[] = [
  { value: 'mac-dinh', label: 'Dễ thương', desc: 'Màu pastel, icon sticker, Bé Bụng và hình vẽ — như hiện tại.' },
  { value: 'de-doc', label: 'Dễ đọc', desc: 'Như một trang sách: nền trắng, chữ đen rõ, ít màu và trang trí để tập trung vào chữ.' },
  { value: 'don-gian', label: 'Đơn giản', desc: 'Giữ màu kem nhẹ nhàng nhưng bỏ bóng đổ, họa tiết, hình trang trí và hiệu ứng.' },
  { value: 'tuong-phan', label: 'Tương phản cao', desc: 'Đen – trắng rõ nét, viền đậm, link gạch chân; hợp khi mắt mỏi hay nắng chói.' },
];

export const SIZES: { value: SizeId; label: string; scale: number }[] = [
  { value: 'nho', label: 'Nhỏ', scale: 0.875 },
  { value: 'vua', label: 'Vừa', scale: 1 },
  { value: 'to', label: 'To', scale: 1.125 },
];

/** Máy tính bảng trở xuống (màn hình hẹp hoặc màn hình cảm ứng) — dùng chung cho CSS và JS. */
export const MOBILE_QUERY = '(max-width: 1060px), (pointer: coarse) and (max-width: 1366px)';

/** Cỡ chữ mặc định khi người dùng chưa chọn: máy tính bảng trở xuống → Nhỏ, laptop trở lên → Vừa. */
export const defaultSize = (): SizeId => (matchMedia(MOBILE_QUERY).matches ? 'nho' : 'vua');

export function applyDisplay(p: { style?: StyleId; size?: SizeId; theme?: 'light' | 'dark'; bottomBar?: boolean; totopMobile?: boolean }) {
  const root = document.documentElement;
  if (p.style && p.style !== 'mac-dinh') root.dataset.style = p.style;
  else delete root.dataset.style;
  // chỉ đặt thuộc tính khi người dùng đã chọn; chưa chọn thì CSS tự dùng mặc định theo thiết bị
  if (p.size === 'nho' || p.size === 'vua' || p.size === 'to') root.dataset.size = p.size;
  else delete root.dataset.size;
  if (p.theme === 'light' || p.theme === 'dark') root.dataset.theme = p.theme;
  else delete root.dataset.theme;
  if (p.bottomBar === false) root.dataset.bottombar = 'off';
  else delete root.dataset.bottombar;
  if (p.totopMobile === true) root.dataset.totopMobile = 'on';
  else delete root.dataset.totopMobile;
  document.dispatchEvent(new CustomEvent('bev:display-changed'));
}
