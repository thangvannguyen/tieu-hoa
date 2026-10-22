import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ base: './src/content/lessons', pattern: '*.mdx' }),
  schema: z.object({
    kind: z.enum(['gioi-thieu', 'ban-tin', 'bai-them']),
    /** số bản tin gốc (1–16) */
    so: z.number().int().min(1).max(16).optional(),
    order: z.number(),
    chapter: z.enum(['c0', 'c1', 'c2', 'c3', 'c4', 'them']),
    title: z.string(),
    /** tiêu đề nguyên văn trong file gốc */
    titleOriginal: z.string(),
    subtitle: z.string().optional(),
    summary: z.string().max(300),
    keyPoints: z.array(z.string()).min(2).max(6),
    authors: z.array(z.enum(['lan-vien', 'quynh-thu', 'diem-khue'])).min(1),
    published: z.string().optional(),
    icon: z.string(),
    mascot: z.enum(['vui', 'lo-lang', 'buon-ngu', 'dau', 'khoe', 'suy-nghi']).default('vui'),
    pillars: z.array(z.enum(['dinh-duong', 'giac-ngu', 'van-dong', 'stress', 'nghien-chat', 'quan-he'])).default([]),
    /** tên các component sơ đồ dùng trong bài (kiểm tra mỗi bài ≥ 1) */
    diagrams: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    /** câu hỏi "Chiêm nghiệm" nguyên văn */
    reflection: z.array(z.string()).default([]),
    /** lời chào cuối + chữ ký nguyên văn */
    signoff: z.array(z.string()).default([]),
    source: z.object({ file: z.string() }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { lessons };
