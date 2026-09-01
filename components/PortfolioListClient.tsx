'use client';

import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import ProjectStripDesktop from './ProjectStripDesktop';

interface PortfolioListClientProps {
  projects: Project[];
  imagesByProject: Record<string, ProjectImage[]>;
}

export default function PortfolioListClient({ projects, imagesByProject }: PortfolioListClientProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project) => (
        <ProjectStripDesktop
          key={project.id}
          project={project}
          images={imagesByProject[project.id] ?? []}
        />
      ))}
    </div>
  );
}
