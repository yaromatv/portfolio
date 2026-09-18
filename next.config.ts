const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Testowanie na telefonie wymaga wejścia po adresie sieciowym, a nie localhost. Bez tego
  // Next blokuje /_next/webpack-hmr jako cross-origin, klient HMR nie łączy się i cyklicznie
  // przeładowuje stronę (miganie, gubienie pozycji przewinięcia). Dotyczy tylko trybu dev.
  allowedDevOrigins: ['192.168.0.196', '192.168.0.*'],
};

export default nextConfig;
