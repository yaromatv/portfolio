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
  // Opcjonalny adres — segment staje się wtedy klikalnym linkiem.
  href?: string;
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

// NAGŁÓWEK SEKCJI — rozmiar i styl. Rozmiar: text-base / text-lg / text-xl / text-2xl,
// grubość: font-medium / font-semibold / font-bold, dodatkowo np. `uppercase`, `tracking-wide`.
const HEADING_STYLE = 'text-xl font-bold';

// ODSTĘP MIĘDZY NAGŁÓWKIEM A PIERWSZĄ LINIJKĄ TEKSTU pod nim.
const HEADING_GAP = 'mt-4';

// LINKI (email, LinkedIn) — ta sama reakcja na hover co w navbarze.
const LINK_STYLE = 'transition-colors hover:text-gray-400';

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
    heading: ' ',
    lines: [
      [
        { type: 'text', content: 'I’m Yaroslav Matvieiev, an ' },
        { type: 'bold', content: 'architect, interior designer and 3D visualization specialist' },
        { type: 'text', content: ' based in Kraków, Poland.' },
      ],
      [
        { type: 'text', content: 'I studied architecture in ' },
        { type: 'text', content: 'Kraków, Amsterdam and the Basque Country' },
        {
          type: 'text',
          content: ', and have worked on projects in Poland, Italy and the Netherlands.',
        },
      ],
      [
        { type: 'text', content: 'For four years I ' },
        { type: 'text', content: 'led visualization at MWM Architekci' },
        {
          type: 'text',
          content: ', where I twice rebuilt the studio’s rendering workflow from the ground up.',
        },
      ],
      [
        {
          type: 'text',
          content:
            'My background in computer science drives a constant search for better tools and faster, higher-quality workflows.',
        },
      ],
    ],
  },
  {
    heading: 'WHAT I DO',
    lines: [
      [
        { type: 'bold', content: 'Architectural visualization' },
        {
          type: 'text',
          content:
            ' / images for competitions, investors and marketing, using classic and AI-assisted workflows',
        },
      ],
      [
        { type: 'bold', content: 'Architecture' },
        {
          type: 'text',
          content:
            ' / concept design, competition entries, capacity studies and construction documentation',
        },
      ],
      [
        { type: 'bold', content: 'Interior design' },
        {
          type: 'text',
          content:
            ' / full-scope projects, from concept to completion, for residential common areas, commercial and cultural spaces as well as private clients',
        },
      ],
      [
        { type: 'bold', content: '3D modeling' },
        { type: 'text', content: ' / including modeling existing buildings from point cloud data' },
      ],
    ],
  },
  {
    heading: 'EXPERIENCE',
    lines: [
      [
        { type: 'bold', content: '2019 – present / Architect & Interior Designer' },
        { type: 'text', content: ' / Independent practice' },
      ],
      [{ type: 'gray', content: 'Architecture and interiors for private clients' }],
      [
        { type: 'bold', content: '2022 – 2026 / Architect, 3D Generalist & Lead Visualizer' },
        { type: 'text', content: ' / MWM Architekci, Rzeszów' },
      ],
      [
        {
          type: 'gray',
          content:
            'Led visualization across residential, commercial, public and cultural projects; interior design, concepts and competitions',
        },
      ],
      [
        { type: 'bold', content: '2022 / Architect, Project & Construction Manager' },
        { type: 'text', content: ' / Apartment, Rotterdam' },
      ],
      [
        { type: 'bold', content: '2021 / Junior Architect' },
        { type: 'text', content: ' / OP Architekten, Kraków' },
      ],
      [
        { type: 'bold', content: '2020 / 3D Visualization Artist, Junior Architect' },
        { type: 'text', content: ' / ATELIER9, Ciabaudo, Italy' },
      ],
    ],
  },
  {
    heading: 'RECOGNITION',
    lines: [
      [
        { type: 'bold', content: '2026 / Honorable mention' },
        { type: 'text', content: ', SARP Competition #1093, ' },
        { type: 'italic', content: 'Jamno Multimodal Transfer Hub' },
        { type: 'text', content: ', Koszalin' },
      ],
      [
        { type: 'bold', content: '2026 / Honorable mention' },
        { type: 'text', content: ', SARP Competition #398, ' },
        { type: 'italic', content: 'Energia Inowrocławia' },
        { type: 'text', content: ' Culture & Education Center, Inowrocław' },
      ],
      [{ type: 'gray', content: 'Both entries were developed with the MWM Architekci team' }],
    ],
  },
  {
    heading: 'EDUCATION',
    lines: [
      [
        { type: 'bold', content: '2016 – 2021 / MSc Eng. Architecture' },
        {
          type: 'text',
          content:
            ' / Cracow University of Technology, with Erasmus exchanges at Amsterdam University of Applied Sciences and the University of the Basque Country',
        },
      ],
      [
        { type: 'bold', content: '2012 – 2016 / Computer Science' },
        {
          type: 'text',
          content:
            ' / Cracow University of Technology; Taras Shevchenko National University of Kyiv',
        },
      ],
    ],
  },
  {
    heading: 'TOOLS',
    lines: [
      [
        { type: 'bold', content: 'BIM & CAD: ' },
        { type: 'text', content: 'Revit, ArchiCAD, AutoCAD, Bentley MicroStation' },
      ],
      [
        { type: 'bold', content: '3D modeling: ' },
        { type: 'text', content: 'SketchUp + LayOut, Rhino + Grasshopper, 3ds Max' },
      ],
      [
        { type: 'bold', content: 'Rendering: ' },
        { type: 'text', content: 'Corona, V-Ray, D5 Render, Twinmotion' },
      ],
      [
        { type: 'bold', content: 'AI visualization: ' },
        { type: 'text', content: 'ComfyUI' },
      ],
      [
        { type: 'bold', content: 'Post-production: ' },
        { type: 'text', content: 'Adobe Photoshop, Lightroom, Premiere Pro' },
      ],
    ],
  },
  {
    heading: 'CONTACT',
    lines: [
      [{ type: 'text', content: 'Open to new opportunities and collaborations' }],
      [
        { type: 'bold', content: 'Email: ' },
        { type: 'text', content: 'yaromatv@gmail.com', href: 'mailto:yaromatv@gmail.com' },
      ],
      [
        { type: 'bold', content: 'LinkedIn: ' },
        {
          type: 'text',
          content: 'linkedin.com/in/yaroslavmatvieiev',
          href: 'https://www.linkedin.com/in/yaroslavmatvieiev',
        },
      ],
      [{ type: 'gray', content: 'CV available on request' }],
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
                <h2 className={`${HEADING_STYLE} ${sectionIndex === 0 ? '' : 'mt-10'}`}>
                  {section.heading}
                </h2>
                {section.lines.map((line, index) => (
                  // odstęp MIĘDZY LINIJKAMI tekstu — zmieniaj `mt-2.5`;
                  // pierwsza linijka pod nagłówkiem ma osobny odstęp HEADING_GAP
                  <p key={index} className={index === 0 ? HEADING_GAP : 'mt-2.5'}>
                    {line.map((segment, segmentIndex) =>
                      segment.href ? (
                        <a
                          key={segmentIndex}
                          href={segment.href}
                          {...(segment.href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                          className={`${segmentClassName(segment.type)} ${LINK_STYLE}`}
                        >
                          {segment.content}
                        </a>
                      ) : (
                        <span key={segmentIndex} className={segmentClassName(segment.type)}>
                          {segment.content}
                        </span>
                      )
                    )}
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
