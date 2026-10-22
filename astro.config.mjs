// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://thangvannguyen.github.io',
  base: '/tieu-hoa',
  trailingSlash: 'always',
  // Astro 7 mặc định 'jsx' sẽ xoá khoảng trắng giữa các thẻ inline viết trên nhiều dòng → dính chữ.
  compressHTML: true,
  integrations: [mdx(), sitemap()],
  image: { layout: 'constrained', responsiveStyles: true },
  // CSS nhỏ (~25KB) → nhúng thẳng vào HTML để không chặn hiển thị
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
