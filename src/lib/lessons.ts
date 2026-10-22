import { getCollection, type CollectionEntry } from 'astro:content';
import { chapterById } from '~/data/chapters';

export type Lesson = CollectionEntry<'lessons'>;

export async function getLessons(): Promise<Lesson[]> {
  const all = await getCollection('lessons', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function lessonLabel(l: Lesson): string {
  if (l.data.kind === 'ban-tin' && l.data.so) return `Bản tin #${String(l.data.so).padStart(2, '0')}`;
  if (l.data.kind === 'gioi-thieu') return 'Thư chào mừng';
  return 'Bài thêm';
}

export function readingMinutes(body = ''): number {
  const words = body
    .replace(/^import .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[{}[\]()*_#>`|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 190));
}

export function chapterOf(l: Lesson) {
  return chapterById[l.data.chapter];
}
