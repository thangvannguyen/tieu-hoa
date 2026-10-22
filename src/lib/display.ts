/** Giao diện (data-style), cỡ chữ (data-size) và chế độ màu (data-theme) trên <html>. */
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

export function applyDisplay(p: { style?: StyleId; size?: SizeId; theme?: 'light' | 'dark' }) {
  const root = document.documentElement;
  if (p.style && p.style !== 'mac-dinh') root.dataset.style = p.style;
  else delete root.dataset.style;
  if (p.size === 'nho' || p.size === 'to') root.dataset.size = p.size;
  else delete root.dataset.size;
  if (p.theme === 'light' || p.theme === 'dark') root.dataset.theme = p.theme;
  else delete root.dataset.theme;
  document.dispatchEvent(new CustomEvent('bev:display-changed'));
}
