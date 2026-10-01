'use client';

import { useEffect, useRef } from 'react';
import { ProjectImage as ProjectImageData } from '@/lib/utils';

interface ProjectVideoProps {
  video: ProjectImageData;
  label: string;
  className?: string;
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
  wrapperRef?: React.Ref<HTMLDivElement>;
}

export default function ProjectVideo({
  video,
  label,
  className,
  wrapperClassName,
  wrapperStyle,
  wrapperRef,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Film gra tylko, gdy jest na ekranie — poza nim nie pobiera danych ani nie dekoduje klatek.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Odrzucenie play() (np. tryb oszczędzania energii na iOS) zostawia pierwszą klatkę.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ aspectRatio: `${video.width} / ${video.height}`, ...wrapperStyle }}
      className={`relative ${wrapperClassName ?? ''}`}
    >
      <video
        ref={videoRef}
        src={video.src}
        aria-label={label}
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        className={`absolute inset-0 h-full w-full ${className ?? ''}`}
      />
    </div>
  );
}
