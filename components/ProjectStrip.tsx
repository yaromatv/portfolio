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
    <div className="flex items-start gap-3 py-4 pl-[15vw]">
      <div className="w-56 flex-shrink-0">
        <ProjectInfo project={project} />
      </div>

      <div className="flex gap-3">
        {thumbnails.map((image, i) => (
          <div
            key={i}
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
            className="relative h-40 flex-shrink-0"
          >
            <Image
              src={image.src}
              alt={`${project.title} - zdjecie ${i + 1}`}
              fill
              sizes="25vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
