import Image from 'next/image';
import { Project } from '@/types/project';

interface ProjectGalleryProps {
  project: Project;
  images: string[];
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

      <div className="flex flex-1 gap-4 overflow-x-auto px-6 py-6">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative h-full w-[80vw] flex-shrink-0 overflow-hidden rounded-md md:w-[60vw]"
          >
            <Image
              src={src}
              alt={`${project.title} - zdjecie ${i + 1}`}
              fill
              sizes="80vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
