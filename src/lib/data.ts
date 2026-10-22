/** Dữ liệu học tập (quiz, thuật ngữ, dấu hiệu cảnh báo, ma trận so sánh) — kiểm tra bằng Zod lúc build. */
import { z } from 'astro/zod';

export const source = z.object({ bai: z.string(), trich: z.string().min(6) });
export type Source = z.infer<typeof source>;

const option = z.object({ id: z.string(), text: z.string() });
export const quizSchema = z.object({
  lesson: z.string(),
  questions: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(['single', 'multi', 'dung-sai']),
        prompt: z.string(),
        options: z.array(option).min(2),
        answer: z.array(z.string()).min(1),
        explain: z.string(),
        source,
      }),
    )
    .min(1),
});
export type Quiz = z.infer<typeof quizSchema>;

export const glossarySchema = z.array(
  z.object({
    id: z.string(),
    term: z.string(),
    aliases: z.array(z.string()).default([]),
    en: z.string().optional(),
    short: z.string().max(160),
    definition: z.string(),
    icon: z.string().optional(),
    source,
  }),
);
export type GlossaryEntry = z.infer<typeof glossarySchema>[number];

export const redFlagSchema = z.object({
  group: z.enum(['tieu-hoa', 'giac-ngu', 'dinh-duong']),
  title: z.string(),
  level: z.enum(['nen-kham', 'kham-som']),
  items: z.array(z.object({ text: z.string(), source })),
  note: z.string().optional(),
});
export type RedFlagGroup = z.infer<typeof redFlagSchema>;

function load<T>(mods: Record<string, unknown>, schema: z.ZodType<T>, label: string): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [path, mod] of Object.entries(mods)) {
    const name = path.split('/').pop()!.replace(/\.json$/, '');
    const parsed = schema.safeParse(mod);
    if (!parsed.success) throw new Error(`${label} ${path} không hợp lệ:\n${parsed.error.message}`);
    out[name] = parsed.data;
  }
  return out;
}

export const quizzes = load(import.meta.glob('/src/data/quiz/*.json', { eager: true, import: 'default' }), quizSchema, 'Quiz');
const sortKey = (t: string) => t.replace(/^[“”"'%(\s]+/, '');
export const glossary = Object.values(
  load(import.meta.glob('/src/data/thuat-ngu/*.json', { eager: true, import: 'default' }), glossarySchema, 'Thuật ngữ'),
)
  .flat()
  .sort((a, b) => sortKey(a.term).localeCompare(sortKey(b.term), 'vi'));
export const redFlags = Object.values(
  load(import.meta.glob('/src/data/canh-bao/*.json', { eager: true, import: 'default' }), z.array(redFlagSchema), 'Cảnh báo'),
).flat();
