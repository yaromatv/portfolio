'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { Project } from '@/types/project';
import { ProjectImage } from '@/lib/utils';
import { createVelocityTracker, glide, Glide } from '@/lib/momentum';
import { cancelWheelMomentum } from '@/lib/smoothWheel';
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const firstImageRef = useRef<HTMLDivElement | null>(null);
  const touchStart = useRef({ x: 0, y: 0 });
  const pointerVelocity = useRef(createVelocityTracker());
  const glideRef = useRef<Glide | null>(null);
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

  useEffect(() => () => glideRef.current?.stop(), []);

  // Dotyk obsługuje sama przeglądarka (brak touch-action: pan-y na kontenerze): daje to
  // bezwładność i gumowanie identyczne jak przy scrollu pionowym, oraz natywne blokowanie
  // osi. Te listenery są pasywne — służą tylko do odróżnienia swipe'a od tapnięcia.
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    drag.current.moved = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) drag.current.moved = true;
  };

  const handleScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setRememberedScrollLeft(project.id, el.scrollLeft);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Dotyk przewija natywnie — ręczne przeciąganie jest potrzebne tylko myszy.
    if (e.pointerType === 'touch') return;
    if (e.target instanceof HTMLElement && e.target.closest('a')) return;
    const el = scrollerRef.current;
    if (!el) return;
    // Złapanie paska w trakcie dobiegu zatrzymuje go w miejscu — jak palec na ekranie.
    glideRef.current?.stop();
    cancelWheelMomentum();
    pointerVelocity.current.reset();
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

    pointerVelocity.current.push(e.clientX);
    e.preventDefault();
    if (Math.abs(dx) > 3) state.moved = true;
    el.scrollLeft = state.startScrollLeft - dx;
  };

  // Puszczenie przycisku w ruchu nie zatrzymuje paska od razu — jedzie dalej z prędkością
  // gestu i wygasa, tak jak po swipie palcem czy rzucie na touchpadzie.
  const startGlide = (el: HTMLDivElement) => {
    const startScrollLeft = el.scrollLeft;
    glideRef.current = glide({
      // Zawartość jedzie w stronę przeciwną do kursora: kursor w prawo = scrollLeft maleje.
      velocity: -pointerVelocity.current.velocity(),
      onFrame: (offset) => {
        const next = startScrollLeft + offset;
        el.scrollLeft = next;
        // Pasek dobił do krańca — dalszy dobieg nic już nie zmieni.
        return Math.abs(el.scrollLeft - next) < 1;
      },
    });
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (el?.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    const state = drag.current;
    if (el && state.isDown && state.axis === 'x' && state.moved) startGlide(el);
    state.isDown = false;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) return;
    if (e.target instanceof HTMLElement && e.target.closest('a')) return;

    // Natywne pushState zamiast router.push: przechwycony modal renderuje null, więc
    // nawigacja Next.js służyłaby tylko zmianie adresu, a pociągałaby za sobą pobranie
    // RSC i przerysowanie całej listy — na iOS objawiało się to zniknięciem zdjęć na
    // moment. Next.js synchronizuje pushState z routerem, więc przycisk wstecz działa.
    window.history.pushState(null, '', `/portfolio/${project.id}`);
    // Dobieg kółka ustawia scrollTop co klatkę i przerwałby płynne dosuwanie projektu.
    cancelWheelMomentum();
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        // Chrome startuje natywny drag'n'drop tekstu/obrazka na wciśniętym przycisku myszy
        // i przejmuje wtedy gest naszemu przeciąganiu.
        onDragStart={(e) => e.preventDefault()}
        className="no-scrollbar flex h-full w-full items-center gap-3 overflow-x-auto pl-6 select-none"
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
