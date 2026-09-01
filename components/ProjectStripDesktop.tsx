import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import ProjectInfo from './ProjectInfo';
import ProjectImageThumbnail from './ProjectImage';

interface ProjectStripDesktopProps {
  project: Project;
  images: ProjectImage[];
}

export default function ProjectStripDesktop({ project, images }: ProjectStripDesktopProps) {
  const thumbnails = images.slice(0, 4);

  return (
    <div className="flex items-start gap-3 py-4 pl-[15vw]">
      <div className="w-56 flex-shrink-0">
        <ProjectInfo project={project} />
      </div>

      <div className="flex gap-3">
        {thumbnails.map((image, i) => (
          <ProjectImageThumbnail
            key={i}
            image={image}
            alt={`${project.title} - zdjecie ${i + 1}`}
            fill
            sizes="25vw"
            wrapperClassName="h-40 shrink-0"
            className="object-contain"
          />
        ))}
      </div>
    </div>
  );
}
