const modules = import.meta.glob<any>('/src/icons/*.svg', { eager: true, import: 'default' });

export const icons: Record<string, any> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.svg$/, ''), mod]),
);
export const iconNames = Object.keys(icons).sort();
export const hasIcon = (name: string) => name in icons;
