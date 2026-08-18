import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
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

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
}

export function getProjectImages(id: string): ProjectImage[] {
  const dir = path.join(process.cwd(), 'public', 'images', id);

  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((file) => {
    const filePath = path.join(dir, file);
    const buffer = fs.readFileSync(filePath);
    const dimensions = sizeOf(buffer);

    return {
      src: `/images/${id}/${file}`,
      width: dimensions.width ?? 1600,
      height: dimensions.height ?? 1200,
    };
  });
}
