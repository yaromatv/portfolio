'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Co powiększa kursor. Pasek projektu jest klikalny w całości, ale zajmuje niemal cały
 * ekran — powiększenie byłoby wtedy stanem domyślnym, więc celujemy w plakietkę z tytułem
 * (`data-cursor="link"`) i w linki/przyciski, gdy się pojawią.
 */
const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-cursor="link"]';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const point = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const recheckHover = useRef(false);
  // Kropka zaczyna przezroczysta i zapala się dopiero przy ruchu myszy, więc na dotyku
  // pozostaje niewidoczna sama z siebie — nie ma czego warunkować przy renderze.
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Na dotyku nie ma natywnego kursora, który mielibyśmy zastąpić.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const draw = () => {
      frame.current = 0;
      const el = dotRef.current;
      if (el) el.style.transform = `translate3d(${point.current.x}px, ${point.current.y}px, 0)`;

      if (recheckHover.current) {
        recheckHover.current = false;
        const under = document.elementFromPoint(point.current.x, point.current.y);
        setHovering(!!under?.closest(INTERACTIVE_SELECTOR));
      }
    };

    const schedule = () => {
      if (!frame.current) frame.current = requestAnimationFrame(draw);
    };

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      point.current = { x: e.clientX, y: e.clientY };
      setVisible(true);
      setHovering(e.target instanceof Element && !!e.target.closest(INTERACTIVE_SELECTOR));
      schedule();
    };

    // Przewijanie podsuwa pod nieruchomy kursor inny element, więc stan hoveru trzeba
    // przeliczyć z pozycji. Faza przechwytująca, bo zdarzenia scroll nie bąbelkują —
    // inaczej ominęłyby nas poziome przewinięcia pasków.
    const handleScroll = () => {
      recheckHover.current = true;
      schedule();
    };

    const hide = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('blur', hide);
    document.documentElement.addEventListener('mouseleave', hide);
    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('blur', hide);
      document.documentElement.removeEventListener('mouseleave', hide);
      document.removeEventListener('scroll', handleScroll, { capture: true });
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-50 will-change-transform"
    >
      {/* Pozycję ustawia rodzic (transform co klatkę), tu zostaje samo powiększenie —
          dzięki temu animowana jest osobna właściwość `scale` i nie walczy z pozycją.
          Średnica po najechaniu = rozmiar bazowy × scale, czyli 14 px × 1.857 ≈ 26 px.
          Zmieniając rozmiar bazowy przelicz `scale`, jeśli powiększony ma zostać ten sam. */}
      <div
        className={`h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-[scale,background-color,opacity] duration-180 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hovering ? 'bg-cursor-hover scale-[1.8]' : 'bg-cursor scale-100'
        } ${visible ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
