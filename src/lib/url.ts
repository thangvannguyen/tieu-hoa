/** Ghép đường dẫn nội bộ với base `/tieu-hoa/` và luôn có dấu `/` ở cuối trang. */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function url(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  let p = path.startsWith('/') ? path : `/${path}`;
  if (p.startsWith(BASE + '/') || p === BASE) p = p.slice(BASE.length) || '/';
  const [pathname, rest = ''] = p.split(/(?=[?#])/);
  const isFile = /\.[a-z0-9]+$/i.test(pathname);
  const withSlash = isFile || pathname.endsWith('/') ? pathname : `${pathname}/`;
  return `${BASE}${withSlash}${rest}`;
}

/** Đường dẫn tới file tĩnh trong public/ (video, poster…) */
export function asset(path: string): string {
  return `${BASE}/${path.replace(/^\/+/, '')}`;
}
