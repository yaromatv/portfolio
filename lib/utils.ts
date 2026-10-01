import fs from 'fs';
import path from 'path';
import sizeOf from 'image-size';
import { Project } from '@/types/project';
import { getMp4Size } from './videoSize';

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
  type: 'image' | 'video';
  src: string;
  width: number;
  height: number;
}

export function getProjectImages(id: string): ProjectImage[] {
  const dir = path.join(process.cwd(), 'public', 'images', id);

  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((file) => /\.(jpe?g|png|webp|mp4)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return files.map((file) => {
    const filePath = path.join(dir, file);
    const src = `/images/${id}/${file}`;

    if (/\.mp4$/i.test(file)) {
      const size = getMp4Size(filePath);
      return { type: 'video', src, width: size?.width ?? 1920, height: size?.height ?? 1080 };
    }

    const buffer = fs.readFileSync(filePath);
    const dimensions = sizeOf(buffer);

    return {
      type: 'image',
      src,
      width: dimensions.width ?? 1600,
      height: dimensions.height ?? 1200,
    };
  });
}
