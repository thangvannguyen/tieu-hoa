import type { Hue } from '~/lib/types';

export interface Opt { value: string; label: string }

interface Base { id: string; label: string; hint?: string }
export type Field =
  | (Base & { type: 'select' | 'choice'; options: Opt[] })
  | (Base & { type: 'scale'; min: number; max: number; anchors?: Record<number, string> })
  | (Base & { type: 'text' | 'textarea' | 'time'; placeholder?: string })
  | (Base & { type: 'number'; unit?: string; step?: number; min?: number; max?: number; placeholder?: string });

export interface Group { id: string; label: string; hint?: string; icon: string; hue: Hue; fields: Field[] }

export interface DiarySchema {
  id: string;
  /** tăng khi đổi cấu trúc dữ liệu */
  version: number;
  days: number;
  daysOptions?: number[];
  groups: Group[];
  /** các trường số để vẽ biểu đồ nhỏ ở phần Tổng kết */
  charts?: { field: string; label: string; hue: Hue }[];
  /** phép tính thời lượng (giờ) giữa hai trường time */
  durations?: { label: string; from: string; to: string }[];
  summary?: { title: string; colA?: string; colB?: string; rows: { id: string; label: string }[]; closing?: string };
}
