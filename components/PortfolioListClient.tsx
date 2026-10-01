'use client';

import { useEffect } from 'react';
import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import { cancelWheelMomentum, enableSmoothWheelScroll } from '@/lib/smoothWheel';
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

  // Wejściowy projekt to ten z linku bezpośredniego, a bez linku — pierwszy na liście.
  // Jego pierwsze zdjęcie jest realnym LCP strony, więc dostaje preload.
  const entryProjectId = focusProjectId ?? projects[0]?.id;

  const handleBackToTop = () => {
    // Natywne pushState z tego samego powodu co przy kliknięciu w projekt (patrz ProjectView).
    if (window.location.pathname !== '/portfolio') {
      window.history.pushState(null, '', '/portfolio');
    }
    // Dobieg kółka ustawia scrollTop co klatkę i przerwałby płynny powrót na górę.
    cancelWheelMomentum();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project, index) => (
        <ProjectView
          key={project.id}
          project={project}
          images={imagesByProject[project.id] ?? []}
          focusOnMount={project.id === focusProjectId}
          isEntryProject={project.id === entryProjectId}
          isFirstInList={index === 0}
        />
      ))}
      <button
        type="button"
        onClick={handleBackToTop}
        className="self-center py-6 text-sm landscape:pb-10 tracking-wide transition-colors hover:text-gray-400"
      >
        BACK TO TOP
      </button>
    </div>
  );
}
