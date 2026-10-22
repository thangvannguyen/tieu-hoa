/**
 * Lưu dữ liệu của người học ngay trên trình duyệt (localStorage).
 *
 * - Mọi khoá đều có tiền tố `bev:v1:` vì mọi trang *.github.io của cùng tài khoản dùng chung một vùng lưu.
 * - Đọc/ghi đều bọc try/catch; nếu trình duyệt chặn lưu trữ thì dùng bộ nhớ tạm và báo cho người dùng.
 * - Ghi được gom lại (300ms) và lưu nốt khi rời trang.
 */
export const PREFIX = 'bev:v1:';
const memory = new Map<string, string>();
let available: boolean | null = null;

export function storageAvailable(): boolean {
  if (available !== null) return available;
  try {
    const k = PREFIX + '__test';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

function rawGet(key: string): string | null {
  if (storageAvailable()) {
    try {
      return localStorage.getItem(PREFIX + key);
    } catch {
      /* rơi xuống bộ nhớ tạm */
    }
  }
  return memory.get(key) ?? null;
}

function rawSet(key: string, value: string | null) {
  if (value === null) memory.delete(key);
  else memory.set(key, value);
  if (!storageAvailable()) return;
  try {
    if (value === null) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, value);
  } catch {
    available = false;
    document.dispatchEvent(new CustomEvent('bev:storage-unavailable'));
  }
}

export function read<T>(key: string, fallback: T): T {
  const raw = rawGet(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const pending = new Map<string, unknown>();
let timer: ReturnType<typeof setTimeout> | undefined;

function flush() {
  clearTimeout(timer);
  timer = undefined;
  for (const [key, value] of pending) rawSet(key, value === undefined ? null : JSON.stringify(value));
  pending.clear();
}

export function write<T>(key: string, value: T, { immediate = false } = {}) {
  pending.set(key, value);
  memory.set(key, JSON.stringify(value));
  if (immediate) return flush();
  clearTimeout(timer);
  timer = setTimeout(flush, 300);
}

export function remove(key: string) {
  pending.delete(key);
  rawSet(key, null);
}

if (typeof window !== 'undefined') {
  addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => document.visibilityState === 'hidden' && flush());
}

/** Lắng nghe thay đổi từ tab khác */
export function onExternalChange(key: string, cb: (value: unknown) => void) {
  addEventListener('storage', (e) => {
    if (e.key === PREFIX + key) {
      try {
        cb(e.newValue == null ? null : JSON.parse(e.newValue));
      } catch {
        /* bỏ qua */
      }
    }
  });
}

export function listKeys(): string[] {
  const keys = new Set<string>(memory.keys());
  if (storageAvailable()) {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k?.startsWith(PREFIX)) keys.add(k.slice(PREFIX.length));
      }
    } catch {
      /* bỏ qua */
    }
  }
  return [...keys].filter((k) => !k.startsWith('__'));
}

/** Ngày theo giờ máy (không dùng toISOString — múi giờ UTC+7 sẽ lệch ngày trước 7 giờ sáng). */
export function localDate(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateVi(iso: string): string {
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
}

// ---------- tiện ích theo chủ đề ----------
export interface Prefs { theme?: 'light' | 'dark'; lastBackup?: string; lastLesson?: string }
export const prefs = {
  get: () => read<Prefs>('prefs', {}),
  set: (p: Prefs) => write('prefs', p, { immediate: true }),
};

export interface Progress {
  lessons: Record<string, { done: boolean; at: string }>;
  quiz: Record<string, { best: number; total: number; at: string }>;
}
export const progress = {
  get: () => read<Progress>('progress', { lessons: {}, quiz: {} }),
  set: (p: Progress) => write('progress', p, { immediate: true }),
};

// ---------- sao lưu ----------
export interface Backup { app: 'bung-em-viec-on'; v: 1; exportedAt: string; keys: Record<string, unknown> }

export function exportAll(prefix = ''): Backup {
  const keys: Record<string, unknown> = {};
  for (const k of listKeys()) if (k.startsWith(prefix)) keys[k] = read(k, null);
  return { app: 'bung-em-viec-on', v: 1, exportedAt: new Date().toISOString(), keys };
}

export function importAll(data: unknown): number {
  if (!data || typeof data !== 'object') throw new Error('File không đúng định dạng.');
  const b = data as Partial<Backup>;
  if (b.app !== 'bung-em-viec-on' || b.v !== 1 || !b.keys || typeof b.keys !== 'object') {
    throw new Error('Đây không phải file sao lưu của web Bụng Êm, Việc Ổn.');
  }
  let n = 0;
  for (const [k, v] of Object.entries(b.keys)) {
    if (typeof k !== 'string' || !/^[a-z0-9:_-]{1,80}$/i.test(k)) continue;
    write(k, v, { immediate: true });
    n++;
  }
  return n;
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** CSV có BOM để Excel đọc đúng tiếng Việt; chặn ô bị hiểu nhầm thành công thức. */
export function toCSV(rows: (string | number | null | undefined)[][]): string {
  const cell = (v: string | number | null | undefined) => {
    let s = v == null ? '' : String(v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return '﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n');
}

export async function requestPersist() {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch {
    /* bỏ qua */
  }
  return false;
}
