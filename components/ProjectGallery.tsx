import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import ProjectImageThumbnail from './ProjectImage';

interface ProjectGalleryProps {
  project: Project;
  images: ProjectImage[];
}

export default function ProjectGallery({ project, images }: ProjectGalleryProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-medium text-neutral-900">{project.title}</h2>
          <p className="text-xs tracking-wide text-neutral-400 uppercase">{project.location}</p>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4 overflow-x-auto px-6 py-6">
        {images.map((image, i) => (
          <div key={i} className="relative flex h-full shrink-0 items-center justify-center">
            <ProjectImageThumbnail
              image={image}
              alt={`${project.title} - zdjecie ${i + 1}`}
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
