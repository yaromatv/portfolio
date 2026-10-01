import Image from 'next/image';
import { ProjectImage as ProjectImageData } from '@/lib/utils';

interface ProjectImageProps {
  image: ProjectImageData;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  wrapperRef?: React.Ref<HTMLDivElement>;
  preload?: boolean;
  loading?: 'eager' | 'lazy';
}

export default function ProjectImage({
  image,
  alt,
  fill,
  sizes,
  className,
  wrapperClassName,
  wrapperStyle,
  wrapperRef,
  preload,
  loading,
}: ProjectImageProps) {
  if (fill) {
    return (
      <div
        ref={wrapperRef}
        style={{ aspectRatio: `${image.width} / ${image.height}`, ...wrapperStyle }}
        className={`relative ${wrapperClassName ?? ''}`}
      >
        <Image
          src={image.src}
          alt={alt}
          fill
          sizes={sizes}
          className={className}
          preload={preload}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <Image
      src={image.src}
      alt={alt}
      width={image.width}
      height={image.height}
      className={className}
      preload={preload}
      loading={loading}
    />
  );
}
