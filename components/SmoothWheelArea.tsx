'use client';

import { useEffect, useRef } from 'react';
import { enableSmoothWheelScroll } from '@/lib/smoothWheel';

interface SmoothWheelAreaProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Kontener z własnym przewijaniem i tym samym wygładzaniem kółka myszy co lista projektów.
 * Osobny komponent kliencki, żeby strona, która go używa, mogła zostać Server Componentem.
 */
export default function SmoothWheelArea({ className, children }: SmoothWheelAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return enableSmoothWheelScroll(ref.current);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
