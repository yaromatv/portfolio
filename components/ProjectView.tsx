'use client';

import { useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import {
  getRememberedScrollLeft,
  getSharedInitialScrollLeft,
  hasRememberedScrollLeft,
  setRememberedScrollLeft,
  setSharedInitialScrollLeft,
} from '@/lib/galleryScrollMemory';
import ProjectInfo from './ProjectInfo';
import ProjectImageThumbnail from './ProjectImage';

interface ProjectViewProps {
  project: Project;
  images: ProjectImage[];
  focusOnMount?: boolean;
}

export default function ProjectView({ project, images, focusOnMount }: ProjectViewProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const firstImageRef = useRef<HTMLDivElement | null>(null);
  const imageWrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef({ isDown: false, startX: 0, startScrollLeft: 0, moved: false });

  // Wysokość paska liczona z sygnaturki zdjęcia poziomego (bez React state — mutacja DOM
  // musi być natychmiastowa i widoczna dla efektu centrowania scrolla poniżej, w tym samym passie).
  useLayoutEffect(() => {
    const landscapeImage = images.find((image) => image.width >= image.height) ?? images[0];
    if (!landscapeImage) return;

    const applyStripHeight = () => {
      const isScreenLandscape = window.innerWidth >= window.innerHeight;
      const height = isScreenLandscape
        ? window.innerHeight * 0.8
        : ((window.innerWidth * 0.8) / landscapeImage.width) * landscapeImage.height;

      if (sectionRef.current) sectionRef.current.style.height = `${height}px`;
      imageWrapperRefs.current.forEach((el) => {
        if (el) el.style.height = `${height}px`;
      });
    };

    applyStripHeight();
    window.addEventListener('resize', applyStripHeight);
    return () => window.removeEventListener('resize', applyStripHeight);
  }, [images]);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    if (hasRememberedScrollLeft(project.id)) {
      el.scrollLeft = getRememberedScrollLeft(project.id);
    } else {
      const shared = getSharedInitialScrollLeft();
      if (shared !== null) {
        el.scrollLeft = shared;
      } else {
        const firstImage = firstImageRef.current;
        if (firstImage) {
          const scrollerRect = el.getBoundingClientRect();
          const imageRect = firstImage.getBoundingClientRect();
          const offset =
            imageRect.left + imageRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2);
          el.scrollLeft += offset;
          setSharedInitialScrollLeft(el.scrollLeft);
        }
      }
    }

    if (focusOnMount) {
      sectionRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, [project.id, focusOnMount]);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setRememberedScrollLeft(project.id, el.scrollLeft);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest('a')) return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      isDown: true,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.isDown) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;
    el.scrollLeft = drag.current.startScrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.isDown = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) return;
    if (e.target instanceof HTMLElement && e.target.closest('a')) return;

    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    router.push(`/portfolio/${project.id}`, { scroll: false });
  };

  return (
    <section ref={sectionRef} className="flex h-[80dvh] w-full shrink-0 items-center">
      <div
        ref={scrollerRef}
        onClick={handleClick}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar flex h-full w-full cursor-grab touch-pan-y items-center gap-3 overflow-x-auto pl-[15vw] select-none active:cursor-grabbing"
      >
        <div className="w-56 shrink-0 self-start">
          <ProjectInfo project={project} />
        </div>

        {images.map((image, i) => (
          <ProjectImageThumbnail
            key={i}
            wrapperRef={(el) => {
              imageWrapperRefs.current[i] = el;
              if (i === 0) firstImageRef.current = el;
            }}
            image={image}
            alt={`${project.title} - zdjecie ${i + 1}`}
            fill
            sizes="80vw"
            wrapperClassName="h-[80dvh] shrink-0"
            className="pointer-events-none object-contain"
          />
        ))}
      </div>
    </section>
  );
}
