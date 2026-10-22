import { url } from './url';

/** Markdown rất nhỏ cho chuỗi trong props: **đậm**, *nghiêng*, [link](url). Thoát HTML trước. */
export function inline(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_m, t, u) => `<a href="${u.startsWith('/') ? url(u) : u}">${t}</a>`);
}
