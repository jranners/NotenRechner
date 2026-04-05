# DESIGN.md — NotenRechner Design System

> Ein strukturiertes Design-Dokument, das alle visuellen und interaktiven Entscheidungen dieser App beschreibt — damit das Design auf andere Projekte übertragen werden kann.

---

## 1. Grundprinzipien (Art Direction)

**Konzept:** Schlichtes, funktionales Tool für Studierende. Keine Ablenkungen — Daten und Interaktion stehen im Vordergrund.

**Ton:** Ruhig, neutral, präzise. Ähnlich wie Linear oder Vercel: dunkle Oberflächen, zurückhaltende Akzente, klare Hierarchie.

**Fünf Designsäulen:**
- **Farbe:** Neutral (Zinc-Skala), kein farblicher Akzent in der UI — Farbe nur für Status/State
- **Typografie:** System-Font-Stack (`font-sans` via Tailwind), keine Custom Fonts
- **Dichte:** Kompakt aber luftig — enge innere Abstände, großzügige Sections
- **Motion:** Funktional und dezent (Framer Motion, kurze Übergänge ≤ 200ms)
- **Imagery:** Keine Bilder, nur Icons (Material Symbols Outlined)

---

## 2. Farbpalette

Das gesamte Farbschema basiert ausschließlich auf der **Zinc-Skala von Tailwind CSS**, ergänzt durch native Dark-Mode-Unterstützung via `dark:`-Klassen.

### Light Mode

| Rolle                   | Tailwind-Klasse          | Hex-Wert    |
|-------------------------|--------------------------|-------------|
| Seitenhintergrund       | `bg-white`               | `#ffffff`   |
| Oberfläche / Sidebar    | `bg-zinc-50`             | `#fafafa`   |
| Karten / Panels         | `bg-white`               | `#ffffff`   |
| Primärtext              | `text-zinc-900`          | `#18181b`   |
| Sekundärtext / Muted    | `text-zinc-500`          | `#71717a`   |
| Faint / Labels          | `text-zinc-400`          | `#a1a1aa`   |
| Border / Divider        | `border-zinc-200`        | `#e4e4e7`   |
| Aktive Nav-Item BG      | `bg-zinc-200/50`         | transparent mix |
| Hover BG                | `hover:bg-zinc-100`      | `#f4f4f5`   |

### Dark Mode

| Rolle                   | Tailwind-Klasse                    | Hex-Wert    |
|-------------------------|------------------------------------|-------------|
| Seitenhintergrund       | `dark:bg-zinc-950`                 | `#09090b`   |
| Oberfläche / Sidebar    | `dark:bg-zinc-950`                 | `#09090b`   |
| Karten / Panels         | `dark:bg-zinc-900`                 | `#18181b`   |
| Primärtext              | `dark:text-zinc-100`               | `#f4f4f5`   |
| Sekundärtext / Muted    | `dark:text-zinc-400`               | `#a1a1aa`   |
| Border / Divider        | `dark:border-white/5`              | weiß 5% Alpha |
| Aktive Nav-Item BG      | `dark:bg-white/5`                  | weiß 5% Alpha |
| Hover BG                | `dark:hover:bg-white/[0.03]`       | weiß 3% Alpha |

> **Designprinzip:** In beiden Modi werden keine Akzentfarben (z. B. Blau, Teal) für interaktive Elemente verwendet. Die Aktivierung eines Elements wird allein durch Hintergrundverschiebung und Texthelligkeit signalisiert.

---

## 3. Typografie

### Font Family

```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Tailwind-Klasse: `font-sans` (Standard). Keine externe Schrift wird geladen.

### Schriftgrößen (verwendete Tokens)

| Element                   | Größe        | Tailwind         |
|---------------------------|--------------|------------------|
| App-Titel (Header)        | 14px / 0.875rem | `text-sm font-semibold` |
| App-Untertitel (Subtitle) | 10px          | `text-[10px] uppercase tracking-widest` |
| Sidebar-Nav-Item          | 14px          | `text-sm`        |
| Body / Modultext          | 14px          | `text-sm`        |
| Sekundärer Body           | 12px          | `text-xs`        |
| GPA / Kennzahl            | monospace num | `tabular-nums`   |
| Bottom-Nav-Label          | 9px           | `text-[9px]`     |

> **Mindestgröße:** 9px für Bottom-Nav-Labels (mobile only). Alle anderen Texte ≥ 12px.

### Font Weight

- `font-semibold` (600) — Titel, aktive States, Kennzahlen
- `font-medium` (500) — Labels, Modulnamen
- keine explizite Angabe (400) — Body, Descriptions

### Letter Spacing

- Kategorieüberschriften (Uppercase-Labels): `uppercase tracking-widest` (sehr weiter Buchstabenabstand)
- Normaler Text: Standard (`tracking-tight` für Titel)

---

## 4. Abstände (Spacing)

Alle Abstände basieren auf dem **4px-Raster** von Tailwind.

| Kontext                              | Wert          | Tailwind       |
|--------------------------------------|---------------|----------------|
| Sidebar-Padding                      | 20px / 24px   | `p-5 pt-6`     |
| Nav-Item Padding                     | 10px 12px     | `px-3 py-2.5`  |
| Nav-Item Gap (Icon + Text)           | 12px          | `gap-3`        |
| Section-Padding (Mobile)             | 20px          | `px-5`         |
| Section-Padding (Desktop)            | 32px          | `p-8`          |
| Zwischen Nav-Items                   | 2px           | `space-y-0.5`  |
| Divider-Abstand                      | 12px oben/unten | `my-3`       |
| Card-Padding                         | 16px          | `p-4`          |

---

## 5. Border Radius

| Element                    | Radius       | Tailwind          |
|----------------------------|--------------|-------------------|
| Nav-Items / Buttons        | 8px          | `rounded-lg`      |
| Karten / Panels (groß)     | 16px         | `rounded-2xl`     |
| Modals (Bottom Sheet)      | 24px oben    | `rounded-t-3xl`   |
| Inputs                     | 8–12px       | `rounded-xl`      |
| Badges / Tags              | 9999px       | `rounded-full`    |

---

## 6. Schatten & Elevation

Das Design verzichtet weitgehend auf Schatten. Elevation wird primär durch **Hintergrundfarbenverschiebung** (`bg-zinc-50` → `bg-zinc-900`) kommuniziert.

Ausnahmen:
- Modals / Bottom Sheets: `shadow-2xl` (Tailwind), `backdrop-blur-xl` für Glasmorphism-Effekt
- Header (mobile): `bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl` — Frosted-Glass-Header

---

## 7. Icons

**Icon-System:** [Material Symbols Outlined](https://fonts.google.com/icons) (Variable Font)

```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
```

### Icon-States (Variable Font Axes)

| State      | `fontVariationSettings`                              |
|------------|------------------------------------------------------|
| Inaktiv    | `'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`         |
| Aktiv      | `'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24`         |

> Das Füllen des Icons (FILL 0 → 1) ist das primäre Signal für den aktiven Zustand in der Navigation — keine Farbe.

### Icon-Größen

| Kontext                  | Größe  | Klasse / Style          |
|--------------------------|--------|-------------------------|
| Sidebar Nav              | 18px   | `text-[18px]`           |
| Mobile Bottom Nav        | 24px   | `fontSize: '24px'`      |
| Header / Settings Button | 20px   | `text-[20px]`           |
| Modale Aktionen          | 20–24px | situativ              |

---

## 8. Layout-Struktur

### Grundgerüst

```
┌─────────────────────────────────────────────────────┐
│  Mobile: Header (blur, safe-area-inset-top)          │
├─────────────────────────────────────────────────────┤
│  Desktop: Sidebar (w-56 / lg:w-64)  │  Main Content │
│  - App-Titel + Subtitle             │  (overflow-y)  │
│  - Global GPA                       │               │
│  - Area-Nav (5 Tabs)                │               │
│  - Divider                          │               │
│  - Tools-Nav (2 Tabs)               │               │
│  - Settings (bottom)                │               │
├─────────────────────────────────────────────────────┤
│  Mobile: Bottom Navigation Bar                       │
└─────────────────────────────────────────────────────┘
```

### Breakpoints

| Breakpoint | Tailwind  | Verhalten                          |
|------------|-----------|------------------------------------|
| < 768px    | (default) | Mobile: Top-Header + Bottom-Nav    |
| ≥ 768px    | `md:`     | Desktop: Sidebar + kein Bottom-Nav |

### Viewport-Verhalten

- **Kein Overflow** auf Root-Ebene: `overflow: hidden` auf `html`, `body`, `#root`
- **Einzige Scroll-Region:** `<main>` mit `overflow-y-auto` und `.no-scrollbar`
- **`100dvh`** statt `100vh` für korrekte Höhe auf iOS

---

## 9. Motion & Animation

**Bibliothek:** [Framer Motion](https://www.framer.com/motion/)

### Seitenübergänge (Tab-Wechsel)

```js
// Area-Tabs (swipeable)
initial: { opacity: 0, x: 30 }
animate: { opacity: 1, x: 0 }
exit:    { opacity: 0, x: -30 }
transition: { duration: 0.2, ease: 'easeOut' }

// Utility-Tabs (kein Slide)
initial: { opacity: 0 }
animate: { opacity: 1 }
transition: { duration: 0.15 }
```

### Touch / Swipe

- Horizontales Swipe-Gesten zwischen Area-Tabs via `drag="x"` auf Framer Motion
- Threshold: `80px` Auslösung
- `dragElastic: 0.08` — leichte Gummibandwirkung

### Button-Tap (Mobile)

```js
whileTap={{ scale: 0.85 }}
```

> Jeder interaktive Button im Bottom-Nav gibt haptisches visuelles Feedback durch leichte Verkleinerung.

### CSS Transitions

```css
transition-colors duration-200
```

Alle Farb-State-Übergänge (hover, active, dark mode) verwenden `200ms ease`.

---

## 10. Modale & Overlays

- **Bottom Sheet auf Mobile** — Modals schieben von unten ein (`AnimatePresence` + `motion.div`)
- **Backdrop:** `bg-zinc-950/60 dark:bg-black/70 backdrop-blur-sm`
- **Sheet-Radius:** `rounded-t-3xl` (oben abgerundet)
- **Scroll innerhalb der Modal:** `overflow-y-auto max-h-[90dvh]`
- **Safe Area:** `pb-safe` für iOS-Home-Indikator

---

## 11. iOS / Mobile Besonderheiten

```css
/* Auto-Zoom auf Inputs verhindern */
input, textarea, select, button {
  font-size: 16px !important;
  -webkit-text-size-adjust: 100%;
}

/* Safe Area Insets */
:root {
  --sat: env(safe-area-inset-top, 0px);
  --sab: env(safe-area-inset-bottom, 0px);
  --sal: env(safe-area-inset-left, 0px);
  --sar: env(safe-area-inset-right, 0px);
}

/* Double-Tap Zoom deaktivieren */
button, a, [role="button"] {
  touch-action: manipulation;
}

/* Tap-Highlight entfernen */
-webkit-tap-highlight-color: transparent;
```

---

## 12. Komponenten-Übersicht

| Komponente          | Beschreibung                                                  |
|---------------------|---------------------------------------------------------------|
| `Dashboard`         | Modulübersicht je Bereich, GPA-Anzeige, Modulkarten           |
| `Simulator`         | GPA-Simulator mit hypothetischen Noten                        |
| `Backup`            | Export/Import-UI für Notendaten                               |
| `Onboarding`        | Erster Start: Studiengang-Auswahl, Multi-Step-Flow            |
| `SettingsModal`     | Bottom Sheet: Sprache, Studiengang, Dark Mode                 |
| `AddModuleModal`    | Bottom Sheet: Modul hinzufügen via SearchableSelect           |
| `DeleteModal`       | Bestätigungsdialog für Modul-Löschung                         |
| `SearchableSelect`  | Durchsuchbares Dropdown für Modulauswahl                      |

---

## 13. Design auf andere Apps übertragen

Um dieses Design auf ein anderes Projekt anzuwenden, folge diesen Schritten:

### Tailwind-Config

```js
// tailwind.config.js
export default {
  darkMode: 'class', // 'dark'-Klasse via JS togglen
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

### Base CSS (index.css)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  html {
    @apply bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100;
    -webkit-tap-highlight-color: transparent;
  }
  input, textarea, select, button {
    font-size: 16px !important;
    -webkit-text-size-adjust: 100%;
  }
  button, a, [role="button"] {
    touch-action: manipulation;
  }
  :root {
    --sat: env(safe-area-inset-top, 0px);
    --sab: env(safe-area-inset-bottom, 0px);
    --sal: env(safe-area-inset-left, 0px);
    --sar: env(safe-area-inset-right, 0px);
  }
}

@layer utilities {
  .pt-safe { padding-top: calc(1rem + var(--sat)); }
  .pb-safe { padding-bottom: max(0.5rem, env(safe-area-inset-bottom)); }
  .px-safe { padding-left: calc(1rem + var(--sal)); padding-right: calc(1rem + var(--sar)); }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
}
```

### App-Shell (React)

```jsx
// Grundgerüst der App
<div className="h-[100dvh] w-screen overflow-hidden flex flex-col
  bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans
  transition-colors duration-200">

  {/* Mobile Header */}
  <header className="md:hidden flex items-center justify-between px-4
    pb-4 border-b border-zinc-200 dark:border-white/5 shrink-0
    bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl"
    style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
    {/* ... */}
  </header>

  {/* Desktop Sidebar + Content */}
  <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
    <aside className="hidden md:flex flex-col w-56 lg:w-64
      bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-white/5">
      {/* Sidebar Nav */}
    </aside>
    <main className="flex-1 overflow-y-auto no-scrollbar">
      {/* Content */}
    </main>
  </div>

  {/* Mobile Bottom Nav */}
  <nav className="md:hidden flex items-center justify-around w-full z-40
    bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-white/5
    pt-1.5 shrink-0"
    style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
    {/* Nav Items */}
  </nav>
</div>
```

### Nav-Item-Muster (aktiv/inaktiv)

```jsx
<button
  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
    isActive
      ? 'bg-zinc-200/50 dark:bg-white/5 text-zinc-900 dark:text-zinc-100'
      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/[0.03]'
  }`}
>
  <span className="material-symbols-outlined text-[18px]"
    style={{ fontVariationSettings: isActive
      ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24"
    }}>
    {icon}
  </span>
  {label}
</button>
```

---

## 14. Abhängigkeiten

| Paket              | Zweck                              |
|--------------------|------------------------------------|
| `tailwindcss`      | Utility-First CSS Framework        |
| `framer-motion`    | Animationen und Gesten             |
| `react`            | UI-Framework                       |
| Material Symbols   | Icon-System (Google CDN)           |

---

*Dieses Dokument wurde automatisch aus dem Quellcode von [NotenRechner](https://github.com/jranners/NotenRechner) extrahiert.*
