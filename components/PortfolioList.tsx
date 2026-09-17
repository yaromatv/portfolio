import projectsData from '@/data/projects.json';
import { Project } from '@/types/project';
import { sortByRelevance, getProjectImages, ProjectImage } from '@/lib/utils';
import PortfolioListClient from './PortfolioListClient';

interface PortfolioListProps {
  focusProjectId?: string;
}

export default function PortfolioList({ focusProjectId }: PortfolioListProps) {
  const projects = projectsData as unknown as Project[];
  const sorted = sortByRelevance(projects);

  const imagesByProject = sorted.reduce<Record<string, ProjectImage[]>>((acc, project) => {
    acc[project.id] = getProjectImages(project.id);
    return acc;
  }, {});

  return (
    <PortfolioListClient
      projects={sorted}
      imagesByProject={imagesByProject}
      focusProjectId={focusProjectId}
    />
  );
}
