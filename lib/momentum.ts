/**
 * Kinetyka gestów myszy: pomiar prędkości w trakcie przeciągania i wygaszanie ruchu po
 * puszczeniu przycisku. Dotyk i touchpad mają własną, natywną inercję przeglądarki —
 * ten moduł jest wyłącznie dla myszy.
 */

// --- Parametry fizyki (tu się stroi "czucie" gestu) -------------------------------------
// Stała czasowa wygaszania: dystans dobiegu to mniej więcej v0 * TIME_CONSTANT_MS.
export const GLIDE_TIME_CONSTANT_MS = 300;
// Skala rzutu: 1.0 = pełny dobieg wynikający z prędkości, mniej = krótszy, bardziej "trzymany".
export const GLIDE_FACTOR = 0.85;
// Poniżej tej prędkości (px/ms) traktujemy gest jako odłożenie, nie rzut.
const MIN_VELOCITY = 0.06;
// Okno próbek, z którego liczymy prędkość puszczenia — bierzemy końcówkę ruchu (flick),
// a nie średnią z całego gestu.
const VELOCITY_WINDOW_MS = 90;
// Gest zatrzymany na dłużej niż tyle przed puszczeniem nie rzuca wcale.
const STALE_SAMPLE_MS = 60;

export interface Glide {
  stop(): void;
}

const NOOP_GLIDE: Glide = { stop() {} };

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

interface Sample {
  t: number;
  v: number;
}

export interface VelocityTracker {
  reset(): void;
  push(value: number): void;
  /** Prędkość w px/ms; dodatnia, gdy wartość rosła. */
  velocity(): number;
}

export function createVelocityTracker(): VelocityTracker {
  const samples: Sample[] = [];

  return {
    reset() {
      samples.length = 0;
    },
    push(value) {
      const t = performance.now();
      samples.push({ t, v: value });
      while (samples.length > 2 && t - samples[0].t > VELOCITY_WINDOW_MS) samples.shift();
    },
    velocity() {
      if (samples.length < 2) return 0;
      const now = performance.now();
      const last = samples[samples.length - 1];
      if (now - last.t > STALE_SAMPLE_MS) return 0;
      const first = samples[0];
      const dt = last.t - first.t;
      if (dt <= 0) return 0;
      return (last.v - first.v) / dt;
    },
  };
}

interface GlideOptions {
  /** Prędkość startowa w px/ms, w kierunku, w którym ma jechać animowana wartość. */
  velocity: number;
  /**
   * Dostaje przesunięcie liczone od pozycji startowej. Zwrócenie `false` kończy animację
   * (np. gdy doszliśmy do krańca zakresu).
   */
  onFrame: (offset: number) => boolean | void;
  timeConstant?: number;
  factor?: number;
}

/**
 * Wykładniczy dobieg: offset(t) = A * (1 - e^(-t/τ)). Ten sam model, co natywna inercja
 * touchpada — ruch startuje z prędkością gestu i gładko zanika, bez skokowej zmiany tempa
 * w momencie puszczenia przycisku.
 */
export function glide({
  velocity,
  onFrame,
  timeConstant = GLIDE_TIME_CONSTANT_MS,
  factor = GLIDE_FACTOR,
}: GlideOptions): Glide {
  if (!Number.isFinite(velocity) || Math.abs(velocity) < MIN_VELOCITY) return NOOP_GLIDE;
  if (prefersReducedMotion()) return NOOP_GLIDE;

  const amplitude = velocity * timeConstant * factor;
  const start = performance.now();
  let frame = 0;
  let running = true;

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(frame);
  };

  const tick = () => {
    const remaining = amplitude * Math.exp(-(performance.now() - start) / timeConstant);
    // Ostatni ułamek piksela i tak jest niewidoczny — dociągamy do końca i kończymy.
    if (Math.abs(remaining) < 0.5) {
      onFrame(amplitude);
      running = false;
      return;
    }
    if (onFrame(amplitude - remaining) === false) {
      running = false;
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return { stop };
}
