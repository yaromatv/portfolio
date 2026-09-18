'use client';

import { useEffect } from 'react';
import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import { enableSmoothWheelScroll } from '@/lib/smoothWheel';
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
  // Jedna obsługa kółka na całą listę — scroll pionowy dotyczy strony, nie pojedynczego paska.
  useEffect(() => enableSmoothWheelScroll(), []);

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
