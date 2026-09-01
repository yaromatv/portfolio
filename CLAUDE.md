@AGENTS.md

# CLAUDE.md

Ten plik jest czytany przez Claude Code na starcie każdej sesji w tym repo. Zawiera kontekst, zasady i konwencje projektu — nie generyczne porady o Next.js. Aktualizuj go, gdy zmienia się architektura lub podejmujesz nową decyzję projektową.

## Projekt

Portfolio architekta — **Yaroslav Matvieiev**. Status: **MVP**, obecnie budowana jest tylko podstrona `/portfolio` (lista projektów + widok rozwiniętego projektu). Strona "O mnie" jest odłożona na kolejną wersję po MVP.

Autor jest architektem i fullstack developerem (znajomość MERN: React, Node.js, MongoDB, Express, Redux Toolkit), umie samodzielnie czytać i poprawiać kod — nie trzeba tłumaczyć podstaw JS/React, ale warto tłumaczyć niuanse Next.js App Router i Framer Motion.

## Stack techniczny

- **Framework**: Next.js, App Router, TypeScript
- **Styling**: Tailwind CSS (plus `prettier-plugin-tailwindcss` do sortowania klas)
- **Font**: Elms Sans (Google Fonts)
- **Animacje**: Framer Motion — kluczowa technika to `layoutId` do animacji rozwijania pasów projektu w galerię
- **Obrazy**: `next/image`, lazy loading, `placeholder="blur"`
- **Hosting frontend**: Vercel (plan Hobby/free)
- **Repozytorium**: GitHub
- **Backend**: brak dedykowanego backendu. Dane trzymane w pliku JSON w repo. W przyszłości możliwe Next.js API routes tylko pod formularz kontaktowy.
- **Baza danych**: brak — wszystkie dane projektów żyją w `projects.json`

### Opcje z `create-next-app`

TypeScript: tak · ESLint: tak · React Compiler: nie · Tailwind: tak · katalog `src/`: nie (pliki w root) · App Router: tak

## Twarde zasady (Hard Rules)

- Domyślnie **Server Components**. Dodawaj `"use client"` tylko gdy komponent faktycznie potrzebuje hooków (`useState`, `useEffect`), obsługi zdarzeń lub Framer Motion.
- Styling wyłącznie **Tailwind CSS** — nie używaj CSS Modules, styled-components ani inline `style={}` bez wyraźnego powodu (np. dynamiczne wartości z JS, np. `layoutId` transform).
- Obrazy tylko przez `next/image`, nigdy `<img>`.
- Nie wprowadzaj Cloudinary ani żadnego zewnętrznego CDN do obrazów — decyzja podjęta: projektów jest do ~10, `next/image` na Vercel Hobby wystarczy (limit 5000 transformacji/miesiąc, 1000 unikalnych obrazów źródłowych na projekt).
- Nie dodawaj bazy danych ani ORM — dane projektów żyją w statycznym `projects.json` w repo.
- Przed uznaniem zadania za zakończone uruchom: `npm run build`, `npm run lint`, `tsc --noEmit`. Nie oceniaj poprawności kodu tylko na podstawie diffu.
- Formatowanie kodu: Prettier z `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `tabWidth: 2`, `printWidth: 100`, plugin `prettier-plugin-tailwindcss`. Format-on-save jest włączony w VS Code — nie nadpisuj tego stylu ręcznie innym formatowaniem.

## Struktura danych — `projects.json`

Schema pojedynczego projektu:

| Pole       | Typ             | Uwagi                                                                                                            |
| ---------- | --------------- | ---------------------------------------------------------------------------------------------------------------- |
| `id`       | `string`        | Unikalny slug, używany w URL `/portfolio/id`                                                                     |
| `title`    | `string`        | Nazwa projektu                                                                                                   |
| `location` | `string`        | Lokalizacja                                                                                                      |
| `year`     | `number`        | Rok                                                                                                              |
| `month`    | `number (1-12)` | Miesiąc                                                                                                          |
| `role`     | `string[]`      | Lista ról autora w projekcie, np. `["Architect", "Archviz", "Project Manager"]`                                  |
| `tools`    | `string[]`      | Użyte narzędzia (np. AutoCAD, SketchUp, V-Ray)                                                                   |
| `rating`   | `number 0-10`   | Wpisywane ręcznie, **niewidoczne na stronie** — podstawa sortowania "Relevance"                                  |
| `images`   | `string[]`      | Ścieżki/URLe do zdjęć, od 3 do kilkunastu                                                                        |
| `awards`   | `string[]`      | **Opcjonalne** — wyświetlane na stronie TYLKO jeśli tablica nie jest pusta. Pole zawsze podawane w bazie danych. |

Przykład:

```json
{
  "id": "ayurveda-living",
  "title": "Ayurveda Living",
  "location": "Rotterdam, Netherlands",
  "year": 2022,
  "month": 6,
  "role": ["Architect", "Archviz", "Project Manager"],
  "tools": ["AutoCAD", "SketchUp", "V-Ray"],
  "rating": 8,
  "images": ["/images/ayurveda-1.jpg", "/images/ayurveda-2.jpg"],
  "awards": []
}
```

## Specyfikacja UX — `/portfolio`

### Routing

- `/portfolio` — lista projektów
- `/portfolio/nazwa-projektu` — rozwinięty projekt
- Technika: **Intercepting Routes + Parallel Routes** (wzorzec modal jak Instagram/Unsplash)
- Wejście w projekt dodaje wpis do historii przeglądarki — przycisk "wstecz" musi działać
- Bezpośredni link `/portfolio/nazwa-projektu` od razu otwiera widok rozwinięty tego projektu; reszta listy doładowuje się w tle

### Desktop

- Widok domyślny: pionowa lista, każdy projekt to poziomy pas kilku miniaturek. Pierwsze obrazki każdego projektu na starcie są wycentrowane mniej więcej na środku ekranu wzdłuż osi pionowej (jak w typowej pionowej liście). Kiedy wchodzimy w pas projektu (rozwinięcie), można przewijać zdjęcia w boki, a sam pas rozciąga się do obu bocznych krawędzi ekranu. Plakietka z tekstem (tytuł/lokalizacja/rok itp.) przewija się razem ze zdjęciami w pasie — zachowuje się jak dodatkowy element "na pozycji obrazka 0", czyli tuż przed pierwszym zdjęciem, nie jako statyczny nagłówek nad pasem.
- Klik na pas płynnie rozwija go (animacja `layoutId` Framer Motion) do **~90% wysokości ekranu**, nie na pełny ekran — u góry i u dołu ma zostać widoczny mały, obcięty fragment obrazków sąsiednich projektów (górnego i dolnego), żeby zachować poczucie bycia wewnątrz głównej pionowej listy, a nie w oddzielnym pełnoekranowym widoku.
- Scroll pionowy (myszka/trackpad) zawsze steruje pionową listą. **Jeśli projekt jest rozwinięty, pierwszy scroll zwija go z powrotem do pasa, kolejny scroll przewija listę.** To nie jest zwykłe zagnieżdżone przewijanie — wymaga własnej logiki przechwytywania scrolla.
- Przesuwanie zdjęć w rozwiniętym projekcie **tylko** przez klik+drag albo gest poziomy trackpada (`deltaX`) — **nigdy** przez zwykły scroll kołem myszy.
- **Zachowanie pozycji scrolla poziomego przy zwijaniu**: jeśli użytkownik przesunął już poziomo obrazki w rozwiniętym projekcie i wychodzi z niego scrollem pionowym, projekt się pomniejsza — ale nie do początkowego (100%) rozmiaru pasa, a do **200% początkowego rozmiaru**. Dzięki temu widać na pierwszy rzut oka, które projekty na liście zostały już przeglądnięte (są większe niż nieotwierane). Pozycja poziomego przewijania zdjęć **musi zostać zapamiętana** — po ponownym rozwinięciu tego projektu galeria ma wrócić w to samo miejsce, w którym została zostawiona, a nie resetować się do stanu początkowego. Wymaga trzymania stanu przewinięcia poziomego oraz stanu "odwiedzony/rozmiar" per-projekt (np. w komponencie nadrzędnym listy albo w kontekście/store), niezależnie od aktualnego stanu rozwinięcia/zwinięcia.

### Mobile

- Widok domyślny: od razu pełnoekranowe, zbliżone pasy (bez etapu zwiniętej miniatury jak na desktopie)
- Swipe pionowy: przełącza między projektami
- Swipe poziomy: przełącza między zdjęciami w obrębie jednego projektu

### Sortowanie

- Jeden przycisk podzielony na dwie opcje, w prawym górnym rogu strony
- Domyślne: **Relevance** (sortowanie po `rating`, ukryte przed użytkownikiem)
- Alternatywne: **Year** (sortowanie chronologiczne, użyj `year` + `month`)

### Obrazy

- Lazy loading + `placeholder="blur"` przez `next/image`
- Powód: część projektów ma nawet kilkanaście zdjęć — nie ładować wszystkiego naraz

### SEO

- Meta title/description generowane automatycznie z `title` + `location` + `year` każdego projektu

## Deployment

- Projekt Vercel: `yaroslavmatvieiev`, publiczny URL: `yaroslavmatvieiev.vercel.app`
- Custom domain: brak na razie — zostajemy na darmowej domenie `.vercel.app`
- Auto-deploy: każdy `git push` do `main` automatycznie wdraża nową wersję na Vercel
- Standardowy workflow commitowania:
  ```
  git add .
  git commit -m "opis zmian"
  git push
  ```

## Konfiguracja edytora (VS Code)

`.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "js/ts.tsdk.path": "node_modules/typescript/lib"
}
```

Rekomendowane rozszerzenia: Prettier, ESLint, Error Lens, GitLens, ES7+ React/Redux/React-Native Snippets, Path Intellisense, Tailwind CSS IntelliSense, Auto Rename Tag, Pretty TypeScript Errors.

`.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`.prettierignore`: `node_modules`, `.next`, `public`, `package-lock.json`

## Kolejność prac (roadmap MVP)

1. ~~Zdecydować pole `month` vs pełna data, napisać `projects.json`, zbudować statyczny komponent listy desktopowej~~ — **zrobione**. Pozostało do zweryfikowania: czy obecna statyczna struktura komponentów (dane, typy, podział na `ProjectRow`/`ProjectList` itp.) jest wspólna i wystarczająca do zrealizowania **jednocześnie** wersji mobilnej i desktopowej bez duplikacji logiki — kod ma być krótki, ale przede wszystkim czytelny. Zanim przejdziesz do animacji, poproś Claude Code o przegląd tej struktury pod kątem: (a) czy layout mobile/desktop rozjeżdża się przez media queries w JSX czy przez osobne komponenty, (b) czy typy danych są w jednym miejscu (`types.ts`) i reużywane, (c) czy nie ma zduplikowanej logiki renderowania miniatur między wariantami.
2. Skonfigurować Intercepting Routes + Parallel Routes + SEO meta tagi.
3. Dodać Framer Motion i animacje `layoutId` (rozwijanie pasa do ~90% ekranu, pomniejszenie do 200% po zwinięciu, zachowanie pozycji scrolla poziomego)
4. Dodać logikę sortowania Relevance/Year
5. Zbudować wariant mobilny (media query) — jeśli nie został już objęty wspólną strukturą w kroku 1
6. Dodać lazy loading + blur placeholder na obrazkach

Strona "O mnie" — dopiero po MVP. Nie wrzucać całego CV, tylko przerobioną wersję marketingową.

## Jak pracować z Claude Code w tym repo

- Podawaj konkretne, wąskie prompty odnoszące się do konkretnych plików (np. `components/ProjectRow.tsx`), nie ogólne "zrób lepiej".
- Przy animacjach podawaj parametry fizyki od razu (np. `stiffness: 300, damping: 20`), żeby uniknąć wielu rund poprawek.
- Po każdej zmianie odpalaj `npm run build && npm run lint && tsc --noEmit`.
- Po zamknięciu większego zadania (np. gotowa animacja rozwijania) czyść kontekst (`/clear`) przed kolejnym etapem z roadmapy.
- Nie zgaduj decyzji oznaczonych jako "otwarte pytanie" w tym pliku — zapytaj użytkownika.
