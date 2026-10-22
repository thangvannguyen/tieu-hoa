export type Hue = 'dao' | 'sage' | 'lav' | 'bo' | 'ngoc' | 'hong' | 'do';
export type Pillar = 'dinh-duong' | 'giac-ngu' | 'van-dong' | 'stress' | 'nghien-chat' | 'quan-he';
export type Mood = 'vui' | 'lo-lang' | 'buon-ngu' | 'dau' | 'khoe' | 'suy-nghi';
/** trích nguyên văn từ một bài để chứng minh nội dung có trong nguồn */
export interface Source { bai: string; trich: string }
