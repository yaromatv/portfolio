'use client';

import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import ProjectView from './ProjectView';

interface PortfolioListClientProps {
  projects: Project[];
  imagesByProject: Record<string, ProjectImage[]>;
  focusProjectId?: string;
}

export default function PortfolioListClient({
  projects,
  imagesByProject,
  focusProjectId,
}: PortfolioListClientProps) {
  return (
    <div className="flex flex-col gap-3 py-8">
      {projects.map((project) => (
        <ProjectView
          key={project.id}
          project={project}
          images={imagesByProject[project.id] ?? []}
          focusOnMount={project.id === focusProjectId}
        />
      ))}
    </div>
  );
}
