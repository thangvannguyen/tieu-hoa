export const authors = {
  'lan-vien': { name: 'BS. Phan Thị Lan Viên', short: 'BS Lan Viên' },
  'quynh-thu': { name: 'BS. Quỳnh Thư', short: 'BS Quỳnh Thư' },
  'diem-khue': { name: 'ThS.BS. Diễm Khuê', short: 'ThS.BS Diễm Khuê' },
} as const;
export type AuthorId = keyof typeof authors;
