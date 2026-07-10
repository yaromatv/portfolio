import projectsData from '@/data/projects.json';
import { Project } from '@/types/project';
import { sortByRelevance, getProjectImages } from '@/lib/utils';
import ProjectStrip from './ProjectStrip';

export default function PortfolioList() {
  const projects = projectsData as unknown as Project[];
  const sorted = sortByRelevance(projects);

  return (
    <div className="flex flex-col divide-y divide-neutral-200">
      {sorted.map((project) => (
        <ProjectStrip key={project.id} project={project} images={getProjectImages(project.id)} />
      ))}
    </div>
  );
}
