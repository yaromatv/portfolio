import fs from 'fs';
import path from 'path';
import { Project } from '@/types/project';

export function sortByRelevance(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.rating - a.rating);
}

export function sortByYear(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export type SortMode = 'relevance' | 'year';

export function sortProjects(projects: Project[], mode: SortMode): Project[] {
  return mode === 'relevance' ? sortByRelevance(projects) : sortByYear(projects);
}

export function getProjectImages(id: string): string[] {
  const dir = path.join(process.cwd(), 'public', 'images', id);

  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((file) => `/images/${id}/${file}`);
}
