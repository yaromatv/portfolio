'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
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
  const drag = useRef({
    isDown: false,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    moved: false,
    axis: null as 'x' | 'y' | null,
  });

  // Wysokość paska liczona z proporcji zdjęcia poziomego, w czystym CSS (patrz .project-strip
  // w globals.css) — dzięki temu jest poprawna już w HTML z serwera, bez czekania na hydrację.
  const landscapeImage = images.find((image) => image.width >= image.height) ?? images[0];
  const stripHeightStyle = landscapeImage
    ? ({
        '--ref-w': landscapeImage.width,
        '--ref-h': landscapeImage.height,
      } as React.CSSProperties)
    : undefined;

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

  // Dotyk na natywnych zdarzeniach touch, a nie Pointer Events: na iOS WebKit decyduje
  // o przeznaczeniu gestu już przy pierwszym ruchu palca i anuluje pointer events
  // (pointercancel), przez co przeciąganie zatrzymywało się po kilku pikselach. Tylko
  // preventDefault na nie-pasywnym touchmove skutecznie odbiera gest przeglądarce —
  // React rejestruje onTouchMove jako pasywny, więc listener musi być ręczny.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let axis: 'x' | 'y' | null = null;
    let active = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        active = false;
        return;
      }
      active = true;
      axis = null;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollLeft = el.scrollLeft;
      drag.current.moved = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!active || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // Próg celowo niski: decyzja o osi musi zapaść, zanim WebKit sam uzna gest
      // za przewijanie strony, bo wtedy preventDefault jest już bezskuteczny.
      if (axis === null) {
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (axis === 'y') return;

      e.preventDefault();
      drag.current.moved = true;
      el.scrollLeft = startScrollLeft - dx;
    };

    const onTouchEnd = () => {
      active = false;
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    el.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setRememberedScrollLeft(project.id, el.scrollLeft);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Dotyk ma własną obsługę na natywnych zdarzeniach touch (patrz useEffect niżej) —
    // Pointer Events na iOS są anulowane przez WebKit w trakcie gestu.
    if (e.pointerType === 'touch') return;
    if (e.target instanceof HTMLElement && e.target.closest('a')) return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      isDown: true,
      startX: e.clientX,
      startY: e.clientY,
      startScrollLeft: el.scrollLeft,
      moved: false,
      axis: null,
    };
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const el = scrollerRef.current;
    const state = drag.current;
    if (!el || !state.isDown) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (state.axis === null) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    // Oś pionowa: oddajemy gest natywnemu scrollowi strony.
    if (state.axis === 'y') return;

    e.preventDefault();
    if (Math.abs(dx) > 3) state.moved = true;
    el.scrollLeft = state.startScrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    drag.current.isDown = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) return;
    if (e.target instanceof HTMLElement && e.target.closest('a')) return;

    // Nawigacja najpierw, płynny scroll dopiero w kolejnej klatce — w Safari re-render
    // wywołany przez router.push potrafi przerwać trwającą animację scrollIntoView
    // (skok zamiast płynnego ruchu + mignięcie obrazków).
    router.push(`/portfolio/${project.id}`, { scroll: false });
    requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <section
      ref={sectionRef}
      style={stripHeightStyle}
      className="project-strip flex w-full shrink-0 items-center"
    >
      <div
        ref={scrollerRef}
        onClick={handleClick}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        // Chrome startuje natywny drag'n'drop tekstu/obrazka na wciśniętym przycisku myszy
        // i przejmuje wtedy gest naszemu przeciąganiu.
        onDragStart={(e) => e.preventDefault()}
        className="no-scrollbar flex h-full w-full cursor-grab touch-pan-y items-center gap-3 overflow-x-auto pl-6 select-none active:cursor-grabbing"
      >
        <div className="w-56 shrink-0 self-start">
          <ProjectInfo project={project} />
        </div>

        {images.map((image, i) => (
          <ProjectImageThumbnail
            key={i}
            wrapperRef={(el) => {
              if (i === 0) firstImageRef.current = el;
            }}
            image={image}
            alt={`${project.title} - zdjecie ${i + 1}`}
            fill
            sizes="80vw"
            wrapperClassName="project-strip shrink-0"
            wrapperStyle={stripHeightStyle}
            className="pointer-events-none object-contain"
          />
        ))}
      </div>
    </section>
  );
}
