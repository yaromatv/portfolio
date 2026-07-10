import { Project } from '@/types/project';
import ProjectInfo from './ProjectInfo';
import Image from 'next/image';

interface ProjectStripProps {
  project: Project;
  images: string[];
}

export default function ProjectStrip({ project, images }: ProjectStripProps) {
  const thumbnails = images.slice(0, 4);

  return (
    <div className="flex items-center gap-6 py-6">
      <div className="w-56 shrink-0">
        <ProjectInfo project={project} />
      </div>

      <div className="flex flex-1 gap-3 overflow-hidden">
        {thumbnails.map((src, i) => (
          <div key={i} className="relative h-40 w-56 shrink-0 overflow-hidden rounded-md">
            <Image
              src={src}
              alt={`${project.title} - zdjecie ${i + 1}`}
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
