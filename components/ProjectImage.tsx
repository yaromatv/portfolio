import Image from 'next/image';
import { ProjectImage as ProjectImageData } from '@/lib/utils';

interface ProjectImageProps {
  image: ProjectImageData;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  wrapperClassName?: string;
}

export default function ProjectImage({
  image,
  alt,
  fill,
  sizes,
  className,
  wrapperClassName,
}: ProjectImageProps) {
  if (fill) {
    return (
      <div
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
        className={`relative ${wrapperClassName ?? ''}`}
      >
        <Image src={image.src} alt={alt} fill sizes={sizes} className={className} />
      </div>
    );
  }

  return (
    <Image src={image.src} alt={alt} width={image.width} height={image.height} className={className} />
  );
}
