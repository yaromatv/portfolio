/**
 * Wygładzanie pionowego scrolla kółkiem myszy. Kółko wysyła skokowe "kliknięcia" po ~100 px
 * i przeglądarka przeskakuje o nie natychmiast — obok inercyjnego touchpada i swipe'a wygląda
 * to szarpanie. Tutaj każde kliknięcie dokłada dystans do celu, a strona dojeżdża do niego
 * wykładniczo, więc tempo narasta i wygasa jak przy gestach dotykowych.
 *
 * Zdarzenia z touchpada zostawiamy przeglądarce — mają już natywną inercję i przechwycenie
 * ich pogorszyłoby płynność.
 */

import { prefersReducedMotion } from './momentum';

// --- Parametry fizyki -------------------------------------------------------------------
// Stała czasowa dojazdu do celu: im większa, tym dłuższy i bardziej "ślizgający się" dobieg.
// 110 ms daje ruch wyraźnie płynny, ale wciąż reagujący natychmiast na kolejne kliknięcia.
const TIME_CONSTANT_MS = 300;
// Ile razy dłuższy dystans niż raportuje zdarzenie (1 = tyle samo, ile przeskoczyłaby
// przeglądarka bez wygładzania).
const DISTANCE_SCALE = 2.5;
// Poniżej tego dystansu do celu animacja jest niewidoczna.
const EPSILON_PX = 0.5;
// Przerwa, po której kolejne `wheel` uznajemy za nowy gest i klasyfikujemy od nowa.
const GESTURE_GAP_MS = 140;
// Przeliczniki dla deltaMode innego niż piksele (Firefox raportuje kółko w liniach).
const LINE_PX = 32;
const PAGE_RATIO = 0.9;

let target: number | null = null;
let frame = 0;
let lastFrameAt = 0;
let lastWheelAt = 0;
let gestureIsMouse: boolean | null = null;

function maxScroll(): number {
  return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
}

/**
 * Rozróżnienie kółka od touchpada. Klasyfikacja jest zamrażana na czas jednego gestu:
 * touchpad wysyła serię zdarzeń, z których pojedyncze mogą przypadkiem wyglądać jak
 * kliknięcie kółka.
 */
function isMouseWheel(e: WheelEvent): boolean {
  const now = performance.now();
  if (gestureIsMouse !== null && now - lastWheelAt < GESTURE_GAP_MS) {
    lastWheelAt = now;
    return gestureIsMouse;
  }

  let verdict: boolean;
  if (e.deltaMode !== 0) {
    verdict = true; // linie/strony zamiast pikseli — tak raportowane jest kółko myszy
  } else if (e.deltaX !== 0) {
    verdict = false; // ruch po dwóch osiach naraz potrafi tylko touchpad
  } else {
    // Chrome/Safari: jedno kliknięcie kółka to zawsze wielokrotność 120 w starym
    // `wheelDeltaY`, a touchpad daje drobne, nierówne kroki.
    const legacy = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
    verdict =
      typeof legacy === 'number' && legacy !== 0
        ? Math.abs(legacy) % 120 === 0
        : Math.abs(e.deltaY) >= 40 && Number.isInteger(e.deltaY);
  }

  gestureIsMouse = verdict;
  lastWheelAt = now;
  return verdict;
}

function pixelDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * LINE_PX;
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight * PAGE_RATIO;
  return e.deltaY;
}

function stopGlide(): void {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  target = null;
}

function tick(): void {
  if (target === null) return;
  const now = performance.now();
  const dt = Math.min(now - lastFrameAt, 50);
  lastFrameAt = now;

  // Cel przycinamy co klatkę, bo wysokość dokumentu rośnie w miarę doładowywania zdjęć.
  target = Math.max(0, Math.min(maxScroll(), target));
  const current = window.scrollY;
  const distance = target - current;

  if (Math.abs(distance) < EPSILON_PX) {
    window.scrollTo(0, target);
    stopGlide();
    return;
  }

  window.scrollTo(0, current + distance * (1 - Math.exp(-dt / TIME_CONSTANT_MS)));
  frame = requestAnimationFrame(tick);
}

/** Przerywa dobieg — np. gdy stronę przewija coś innego (klik w projekt, przeciąganie). */
export function cancelWheelMomentum(): void {
  stopGlide();
  gestureIsMouse = null;
}

/** Podpina obsługę pod okno; zwraca funkcję odpinającą. */
export function enableSmoothWheelScroll(): () => void {
  const onWheel = (e: WheelEvent) => {
    // ctrl+wheel to zoom przeglądarki, a `defaultPrevented` oznacza, że zdarzeniem zajął
    // się już ktoś inny.
    if (e.ctrlKey || e.defaultPrevented || prefersReducedMotion()) return;

    if (!isMouseWheel(e)) {
      stopGlide(); // touchpad przejmuje ruch — nasz dobieg tylko by z nim walczył
      return;
    }

    const delta = pixelDelta(e);
    if (delta === 0) return;

    e.preventDefault();
    const base = target ?? window.scrollY;
    target = Math.max(0, Math.min(maxScroll(), base + delta * DISTANCE_SCALE));
    if (!frame) {
      lastFrameAt = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };

  window.addEventListener('wheel', onWheel, { passive: false });
  return () => {
    window.removeEventListener('wheel', onWheel);
    cancelWheelMomentum();
  };
}
