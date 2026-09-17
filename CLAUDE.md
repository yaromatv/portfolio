@AGENTS.md

# CLAUDE.md

Ten plik jest czytany przez Claude Code na starcie każdej sesji w tym repo. Zawiera kontekst, zasady i konwencje projektu — nie generyczne porady o Next.js. Aktualizuj go, gdy zmienia się architektura lub podejmujesz nową decyzję projektową.

## Projekt

Portfolio architekta — **Yaroslav Matvieiev**. Status: **MVP**, obecnie budowana jest tylko podstrona `/portfolio` (lista projektów). Strona "O mnie" jest odłożona na kolejną wersję po MVP.

Autor jest architektem i fullstack developerem (znajomość MERN: React, Node.js, MongoDB, Express, Redux Toolkit), umie samodzielnie czytać i poprawiać kod — nie trzeba tłumaczyć podstaw JS/React, ale warto tłumaczyć niuanse Next.js App Router i Framer Motion.

## Stack techniczny

- **Framework**: Next.js, App Router, TypeScript
- **Styling**: Tailwind CSS (plus `prettier-plugin-tailwindcss` do sortowania klas)
- **Font**: Elms Sans (Google Fonts)
- **Animacje**: Framer Motion — do płynnego wyrównywania projektu na kliknięcie (scroll pionowy) i drobnych przejść; bez `layoutId` do rozwijania pasów (koncepcja usunięta, patrz sekcja UX)
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
- Klikniecie na projekt dodaje wpis do historii przeglądarki — przycisk "wstecz" musi działać
- Bezpośredni link `/portfolio/nazwa-projektu` od razu otwiera cala liste w miejscu tego projektu; reszta listy doładowuje się w tle

### Widok (jedna wersja na wszystkie urządzenia)

> Jedna wspólna logika interakcji dla desktopu i mobile, oparta o zasady mobilne.

- Widok domyślny na każdym urządzeniu i rozmiarze ekranu: pionowa lista projektów, każdy projekt od razu jako zbliżony, praktycznie pełnoekranowy pas. Plakietka z tekstem (tytuł/lokalizacja/rok itp.) przewija się razem ze zdjęciami jako dodatkowy element "na pozycji obrazka 0", tuż przed pierwszym zdjęciem.
  Ale po pierwszym otwarciu strony poziome pasy zdjec projektow sa ustawione tak ze na poziomym srodku ekranu jest 1sze zdjecie pierwszego projektu (a tekst po lewej od niego).
  1sze zdjecia pozostalych projektow sa dorownane lewa krawedzia do 1szego zdjecia pierwszego projektu
  Rozmiar zdjec:
  Ekran pionowy: zeby poziome zdjecia miescily sie na 80% szerokosci ekranu
  Ekran poziomy: zeby poziome zdjecia miescily sie na 80% wysokosci ekranu
- **Oś pionowa (między projektami)**: zwykłe, swobodne przewijanie listy (kółko myszy/trackpad na desktopie, swipe na dotyku) — bez automatycznego snapowania w trakcie przewijania. Kliknięcie na widoczny projekt dosuwa/wyrównuje go do osi pionowej ekranu (i zmienia adres w przegladarce na link do tego konkretnego proejktu); jeśli to jeden z krańcowych elementów listy i nie da się go dosunąć dokładnie na środek, lista przewija się tylko tyle, ile się da.
- **Oś pozioma (zdjęcia w obrębie projektu)**: przesuwanie **tylko** przez klik+drag albo gest poziomy trackpada/swipe dotykowy (`deltaX`) — **nigdy** przez zwykły scroll kołem myszy (pionowy `deltaY` ma zawsze przewijać listę, nie zdjęcia).
- Oba gesty są **rozłączne, nie diagonalne** — nie da się jednym ruchem jednocześnie przewinąć listę i przesunąć zdjęcia. Aplikacja rozpoznaje dominującą oś ruchu na starcie gestu i przypisuje go do jednej z dwóch osi.
- **Pozycja poziomego przewinięcia zdjęć jest zapamiętywana per-projekt**, niezależnie od tego, czy projekt jest aktualnie widoczny na ekranie — po powrocie do niego (przewinięcie listy z powrotem lub wejście przez link `/portfolio/nazwa-projektu`) galeria wraca w to samo miejsce, w którym została zostawiona.

### Sortowanie (aktualnie nie realizowane)

- Jeden przycisk podzielony na dwie opcje, w prawym górnym rogu strony
- Domyślne: **Relevance** (sortowanie po `rating`, ukryte przed użytkownikiem)
- Alternatywne: **Year** (sortowanie chronologiczne, użyj `year` + `month`)

### Obrazy

- Lazy loading + `placeholder="blur"` przez `next/image`
- Wszystkie obrazki laduja sie w tle, ale w pierwszej kolejnosci sasiednie od przegladanego projekty

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

2. Skonfigurować Intercepting Routes + Parallel Routes + SEO meta tagi.
3. Zbudować jeden wspólny komponent widoku projektu (pełnoekranowy pas, bez wariantu desktop/mobile) i logikę gestów: swobodny scroll pionowy między projektami + klik = wyrównanie do osi ekranu, przeciąganie/`deltaX` poziomo = przewijanie zdjęć, rozłączność obu osi, zapamiętywanie pozycji poziomej per-projekt.
4. Dodać lazy loading + blur placeholder na obrazkach

Strona "O mnie" — dopiero po MVP. Nie wrzucać całego CV, tylko przerobioną wersję marketingową.

## Jak pracować z Claude Code w tym repo

- Podawaj konkretne, wąskie prompty odnoszące się do konkretnych plików (np. `components/ProjectRow.tsx`), nie ogólne "zrób lepiej".
- Przy animacjach podawaj parametry fizyki od razu (np. `stiffness: 300, damping: 20`), żeby uniknąć wielu rund poprawek.
- Po każdej zmianie odpalaj `npm run build && npm run lint && tsc --noEmit`.
- Po zamknięciu większego zadania (np. gotowa animacja rozwijania) czyść kontekst (`/clear`) przed kolejnym etapem z roadmapy.
- Nie zgaduj decyzji oznaczonych jako "otwarte pytanie" w tym pliku — zapytaj użytkownika.
