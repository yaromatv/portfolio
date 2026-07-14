import { Project } from '@/types/project';
import ProjectAwards from './ProjectAwards';

interface ProjectInfoProps {
  project: Project;
}

export default function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <div className="flex h-full flex-col justify-center pr-6">
      <h3 className="text-base font-medium text-neutral-900 dark:text-white">{project.title}</h3>
      <p className="mt-1 text-xs tracking-wide text-neutral-400 uppercase dark:text-neutral-500">
        {project.location}
      </p>
      <ProjectAwards awards={project.awards} />
    </div>
  );
}
