import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import ProjectInfo from './ProjectInfo';
import Image from 'next/image';

interface ProjectStripProps {
  project: Project;
  images: ProjectImage[];
}

export default function ProjectStrip({ project, images }: ProjectStripProps) {
  const thumbnails = images.slice(0, 4);

  return (
    <div className="flex items-center gap-6 py-6">
      <div className="w-56 shrink-0">
        <ProjectInfo project={project} />
      </div>

      <div className="flex flex-1 gap-3 overflow-hidden">
        {thumbnails.map((image, i) => (
          <div
            key={i}
            className="relative flex h-40 shrink-0 items-center justify-center overflow-hidden bg-neutral-50"
          >
            <Image
              src={image.src}
              alt={`${project.title} - zdjecie ${i + 1}`}
              width={image.width}
              height={image.height}
              className="h-40 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
