/** Các component dùng trực tiếp trong file .mdx (không cần import). */
import BaseLink from './lesson/BaseLink.astro';
import Callout from './lesson/Callout.astro';
import Figure from './lesson/Figure.astro';
import YouTube from './lesson/YouTube.astro';
import VideoPlayer from './lesson/VideoPlayer.astro';
import IconList from './lesson/IconList.astro';
import Checklist from './lesson/Checklist.astro';
import References from './lesson/References.astro';
import ToolLink from './lesson/ToolLink.astro';
import Icon from './ui/Icon.astro';
import BeBung from './ui/BeBung.astro';
import NumberStrip from './diagrams/primitives/NumberStrip.astro';

// mọi sơ đồ theo chương: src/components/diagrams/<chương>/<TenSoDo>.astro
const diagramMods = import.meta.glob<any>('./diagrams/{c0,c1,c2,c3,c4,them,chung}/*.astro', { eager: true, import: 'default' });
export const diagrams: Record<string, any> = Object.fromEntries(
  Object.entries(diagramMods).map(([p, m]) => [p.split('/').pop()!.replace(/\.astro$/, ''), m]),
);

export const mdxComponents = {
  a: BaseLink,
  Callout,
  Figure,
  YouTube,
  VideoPlayer,
  IconList,
  Checklist,
  References,
  ToolLink,
  Icon,
  BeBung,
  NumberStrip,
  ...diagrams,
};
