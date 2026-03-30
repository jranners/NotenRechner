# Masterplan: NotenRechner (M.Sc. Economics)

Dieses Dokument dient als Single Source of Truth für die Architektur und den Entwicklungsfortschritt der NotenRechner PWA.

## 1. Studienstruktur & ECTS-Limits
Gemäß Prüfungsordnung (MPO WiSo 2021-2025) und dem zugehörigen Modulhandbuch (Economics) gelten folgende exakte Vorgaben für die Studienstruktur:

- **Basisbereich:** exakt 24 LP (ausschließlich Pflichtmodule)
- **Schwerpunktbereich:** exakt 30 LP
- **Ergänzungsbereich Economics:** exakt 24 LP
- **Ergänzungsbereich MSS** (Methoden und Nachbardisziplinen): exakt 12 LP
- **Masterarbeit:** exakt 30 LP
- **Gesamtnote:** Gewichteter Durchschnitt der Bereichsnoten. Die Gewichtung entspricht den Soll-LP des Bereichs an den Gesamt-LP (120).

## 2. Berechnungs- & Architekturlogik (State Management)
- **Lokale Persistenz:** 100% Client-Side via Web Storage API (LocalStorage). Es existiert kein Backend. Das Datenmodell wird JSON-Export und Import unterstützen, um Backups zu ermöglichen.
- **Diskretes Notensystem:** Erlaubte Werte für Modulnoten sind ausschließlich: `1.0`, `1.3`, `1.7`, `2.0`, `2.3`, `2.7`, `3.0`, `3.3`, `3.7`, `4.0` sowie `unbenotet`. Unbenotete Module zählen regulär für die LP-Summe, der Algorithmus muss sie jedoch aus der Durchschnittsberechnung exkludieren.
- **Cross-Area-Lock:** Viele Module sind laut Handbuch mehreren Bereichen zugeordnet. Wird ein Modul in einem speziellen Bereich absolviert oder gewählt, so muss die globale Filterlogik dieses Modul in Echtzeit aus dem Auswahlpool aller anderen Bereiche entfernen, um Mehrfachanrechnungen zu verhindern.
- **Hard-Lock:** Ist das LP-Maximum eines Bereichs (z. B. exakt 24 LP) durch die gewählten Module erreicht ($LP_{current} = LP_{max}$), wird die UI-Funktion "Modul hinzufügen" für diesen spezifischen Bereich strikt gesperrt und deaktiviert.
- **Noten-Simulator (Heuristik):** Zur Berechnung der Zielnote verwendet die Applikation eine lineare Gleichung, um den erforderlichen Rest-Durchschnitt ($G_{req}$) zu ermitteln. Daraufhin errechnet der Algorithmus eine varianzminimierte Kombination aus den diskreten Einzelnoten (1.0 bis 4.0) und präsentiert diese dem User als realistischen, erreichbaren Pfad in der UI.

## 3. UI-Integration (Stitch Assets)
- **Design System:** "Neon Academic".
- **Farbpalette:** Dark Mode mit der Primary Color `#3b82f6`.
- **Typografie:** "Manrope" für Headlines, "Inter" für den Body-Text.
- **Assets:** Die HTML/CSS-Vorlagen aus `stitch_assets/` (Setup, Basisbereich Dashboard, Modul Bearbeiten, Noten-Simulator, Bereich Abgeschlossen, Daten Backup) bilden die exakte Vorlage für die React-Komponenten. Das Design wird mittels Tailwind CSS strikt implementiert.

## 4. Entwicklungs-Roadmap (Step-by-Step Plan)
Die Umsetzung erfolgt in klar abgegrenzten Phasen:

- [x] **Phase 1:** Initiale Dokumentation (`project.md` erstellen).
- [x] **Phase 2:** Projekt-Scaffolding (Vite, React, Tailwind) und Datenmodellierung (statische JSON-Struktur der Module aus dem Handbuch in `src/data.js`).
- [x] **Phase 3:** Globales State Management (Context API) inkl. ECTS-Validierung, Cross-Area-Lock und LocalStorage-Hook.
- [x] **Phase 4:** Transformation der statischen Stitch-HTML-Assets in dynamische React-Komponenten.
- [x] **Phase 5:** Implementierung des Noten-Simulators (Heuristik-Algorithmus).
- [x] **Phase 6:** Data Mutation (Edit & Delete Operations).
- [x] **Phase 7:** Persistence Backup (Manual JSON File I/O).
