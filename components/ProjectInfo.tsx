import { Project } from '@/types/project';
import ProjectAwards from './ProjectAwards';

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="flex h-full flex-col items-end justify-start pr-6 text-right">
      <h3 className="text-base font-medium text-neutral-900 dark:text-white">{project.title}</h3>
      <p className="mt-1 text-xs tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
        {project.location}
      </p>
      <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
        {project.role.join(', ')}
      </p>
      <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
        {project.tools.join(', ')}
      </p>
      <ProjectAwards awards={project.awards} />
    </div>
  );
}
