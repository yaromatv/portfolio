import type { Metadata } from 'next';
import Image from 'next/image';
import SmoothWheelArea from '@/components/SmoothWheelArea';

export const metadata: Metadata = {
  title: 'Yaroslav Matvieiev / About',
  description: 'Architekt i fullstack developer — Yaroslav Matvieiev',
};

interface TextSegment {
  type: 'text' | 'bold' | 'gray' | 'italic';
  content: string;
}

interface TextSection {
  heading: string;
  lines: TextSegment[][];
}

// ODSTĘP TEKSTU OD KRAWĘDZI JEGO TŁA — jedna wartość na wszystkie cztery krawędzie
// i obie orientacje ekranu. Skala Tailwinda: p-4 = 1rem, p-6 = 1.5rem, p-8 = 2rem, p-10 = 2.5rem.
const TEXT_PADDING = 'p-16';

// KOREKTA ODSTĘPU O WYSOKOŚĆ NAVBARU (navbar = h-8 = 2rem), dokładana do TEXT_PADDING:
// poziom: góra − 1 navbar (`-mt-8`), dół + 1 navbar (`mb-8`)
// pion: dół + 2 navbary (`mb-16`)
// Uwaga: w poziomie TEXT_PADDING nie może być mniejszy niż p-8, bo początek tekstu
// wyszedłby ponad górną krawędź panelu.
const NAVBAR_OFFSET = 'landscape:-mt-8 landscape:mb-8 portrait:mb-16';

// SZEROKOŚĆ PANELU Z TEKSTEM na ekranie poziomym. Obie wartości muszą być takie same:
// pierwsza ustawia szerokość panelu, druga odsuwa zdjęcie o tyle samo od lewej,
// żeby zdjęcie zajmowało dokładnie resztę ekranu i nie chowało się pod tekstem.
const PANEL_WIDTH = 'landscape:w-[40%]';
const PHOTO_OFFSET = 'landscape:left-[40%]';

// PRZESUNIĘCIE ZDJĘCIA W PRAWO na ekranie pionowym. Zmieniaj liczbę w `-35vw`:
// prawa krawędź zdjęcia wychodzi o tyle (w % szerokości ekranu) poza prawą krawędź ekranu,
// więc widać więcej lewej części zdjęcia. 0vw = zdjęcie równo do prawej krawędzi.
const PHOTO_SHIFT_PORTRAIT = 'portrait:object-[right_-43vw_top_50%]';

// Mockup typografii — treść tymczasowa, docelowy tekst "O mnie" wejdzie później.
const sections: TextSection[] = [
  {
    heading: 'O mnie',
    lines: [
      [
        { type: 'text', content: 'Architekt i fullstack developer ' },
        { type: 'bold', content: 'z Rotterdamu.' },
      ],
      [
        { type: 'text', content: 'Ponad ' },
        { type: 'bold', content: '10 lat doświadczenia' },
        { type: 'text', content: ' w ' },
        { type: 'italic', content: 'projektowaniu wnętrz' },
        { type: 'text', content: ' i archwizualizacji.' },
      ],
      [
        { type: 'gray', content: 'Współpraca z klientami w ' },
        { type: 'text', content: 'Polsce i Holandii.' },
      ],
      [
        {
          type: 'italic',
          content: '„Design is not just what it looks like — design is how it works.”',
        },
      ],
    ],
  },
  {
    heading: 'Umiejętności',
    lines: [
      [
        { type: 'bold', content: 'AutoCAD, SketchUp, V-Ray, ' },
        { type: 'text', content: 'Adobe Creative Suite.' },
      ],
      [
        { type: 'text', content: 'React, Node.js, ' },
        { type: 'gray', content: 'MongoDB, Express,' },
        { type: 'text', content: ' Redux Toolkit.' },
      ],
      [
        { type: 'text', content: 'Zarządzanie projektem ' },
        { type: 'italic', content: 'od koncepcji do realizacji.' },
      ],
      [{ type: 'gray', content: 'Zawsze uczę się czegoś nowego.' }],
    ],
  },
  {
    heading: 'Contact',
    lines: [
      [
        { type: 'bold', content: 'AutoCAD, SketchUp, V-Ray, ' },
        { type: 'text', content: 'Adobe Creative Suite.' },
      ],
      [
        { type: 'text', content: 'React, Node.js, ' },
        { type: 'gray', content: 'MongoDB, Express,' },
        { type: 'text', content: ' Redux Toolkit.' },
      ],
      [
        { type: 'text', content: 'Zarządzanie projektem ' },
        { type: 'italic', content: 'od koncepcji do realizacji.' },
      ],
      [{ type: 'gray', content: 'Zawsze uczę się czegoś nowego.' }],
    ],
  },
  {
    heading: 'Pronto',
    lines: [
      [
        { type: 'bold', content: 'AutoCAD, SketchUp, V-Ray, ' },
        { type: 'text', content: 'Adobe Creative Suite.' },
      ],
      [
        { type: 'text', content: 'React, Node.js, ' },
        { type: 'gray', content: 'MongoDB, Express,' },
        { type: 'text', content: ' Redux Toolkit.' },
      ],
      [
        { type: 'text', content: 'Zarządzanie projektem ' },
        { type: 'italic', content: 'od koncepcji do realizacji.' },
      ],
      [{ type: 'gray', content: 'Zawsze uczę się czegoś nowego.' }],
    ],
  },
  {
    heading: 'Giga',
    lines: [
      [
        { type: 'bold', content: 'AutoCAD, SketchUp, V-Ray, ' },
        { type: 'text', content: 'Adobe Creative Suite.' },
      ],
      [
        { type: 'text', content: 'React, Node.js, ' },
        { type: 'gray', content: 'MongoDB, Express,' },
        { type: 'text', content: ' Redux Toolkit.' },
      ],
      [
        { type: 'text', content: 'Zarządzanie projektem ' },
        { type: 'italic', content: 'od koncepcji do realizacji.' },
      ],
      [{ type: 'gray', content: 'Zawsze uczę się czegoś nowego.' }],
    ],
  },
];

function segmentClassName(type: TextSegment['type']) {
  switch (type) {
    case 'bold':
      return 'font-bold';
    case 'gray':
      return 'text-gray-500';
    case 'italic':
      return 'italic';
    default:
      return '';
  }
}

export default function AboutPage() {
  return (
    <main className="relative h-[calc(100vh-2rem)] overflow-hidden">
      {/* poziom: zdjęcie zajmuje tylko obszar na prawo od panelu z tekstem, przez co
          mieści się na pełnej wysokości ekranu i jest wykadrowane do środka tego obszaru,
          zamiast być docinane u góry i u dołu na całej szerokości ekranu */}
      <div className={`absolute inset-0 ${PHOTO_OFFSET}`}>
        <Image
          src="/images/me.jpg"
          alt="Yaroslav Matvieiev"
          fill
          preload
          sizes="(orientation: landscape) 60vw, 100vw"
          className={`object-cover object-right ${PHOTO_SHIFT_PORTRAIT}`}
        />
      </div>

      {/* pion: cała szerokość ekranu, półprzezroczyste białe tło nad zdjęciem
          poziom: 40% szerokości po lewej, tło strony (białe / w dark mode czarne) —
          pod panelem nie ma tu zdjęcia, więc biel/70 dawałaby w dark mode szary
          `no-scrollbar` (app/globals.css) chowa pasek przewijania
          kolor tekstu: w pionie zawsze czarny (tło jest zawsze jasne), w poziomie wg motywu */}
      <SmoothWheelArea
        className={`no-scrollbar landscape:bg-background absolute inset-y-0 left-0 w-full overflow-y-auto overscroll-contain bg-white/75 text-left portrait:text-neutral-900 ${PANEL_WIDTH}`}
      >
        {/* min-h-full + justify-center: tekst jest wyśrodkowany, gdy się mieści,
            a gdy jest dłuższy niż ekran — rośnie w dół i scrolluje się od góry */}
        <div className={`flex min-h-full flex-col justify-center ${TEXT_PADDING}`}>
          <div className={NAVBAR_OFFSET}>
            {sections.map((section, sectionIndex) => (
              <div key={section.heading}>
                {/* odstęp MIĘDZY SEKCJAMI — zmieniaj `mt-10` */}
                <h2 className={`text-lg font-semibold ${sectionIndex === 0 ? '' : 'mt-10'}`}>
                  {section.heading}
                </h2>
                {section.lines.map((line, index) => (
                  // odstęp MIĘDZY LINIJKAMI tekstu — zmieniaj `mt-4`
                  <p key={index} className="mt-4">
                    {line.map((segment, segmentIndex) => (
                      <span key={segmentIndex} className={segmentClassName(segment.type)}>
                        {segment.content}
                      </span>
                    ))}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </SmoothWheelArea>
    </main>
  );
}
