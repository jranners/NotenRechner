# Grade Tracker M.Sc. Economics

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/framer--motion-black.svg?style=for-the-badge&logo=framer&logoColor=blue)

A premium, localized, and local-first Progressive Web Application (PWA) designed specifically for students in the M.Sc. Economics program to track their academic progress, visualize constraints, and simulate target grades.

## 🌟 Features

- **Local-First Architecture:** No backend, no external databases. 100% of your data operates and is persisted via your browser's `localStorage` for complete privacy.
- **Advanced Target Grade Simulation:** Dynamically calculates remaining ECTS and outputs the mathematically optimal path required to hit your target grade (M.Sc. GPA). 
- **Cross-Area Validation:** Enforces strict curriculum rules based on area limitations (Core, Specializations, Electives) ensuring you never over-allocate ECTS credits.
- **PWA & Mobile Ready:** Fully installable as a standalone app on iOS and Android with immersive native-like swipe gestures powered by Framer Motion. 
- **Dark/Light Mode:** Seamless, system-synced semantic appearance themes carefully tuned for high-end UI aesthetics.
- **Internationalization (i18n):** Native toggle support for complete translation covering `English` and `Deutsch`.

## 🛠 Tech Stack

- **Frontend Framework:** React 19 via Vite
- **Styling:** Tailwind CSS (Dark Mode manually governed via Context)
- **Animation Engine:** Framer Motion
- **Service Worker / PWA:** `vite-plugin-pwa`

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Local Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository_url>
   cd NotenRechner
   ```

2. Install all dependencies utilizing NPM (Force legacy peer dev dependencies required for current specific setup):
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server locally:
   ```bash
   npm run dev
   ```

4. Build for deployment locally:
   ```bash
   npm run build
   ```

## 🏗 Architecture Overview

- **State Management (`AppConfigContext` & `StoreContext`):** The primary data layers abstracting operations like tracking credits/grades and configuring the aesthetic view. Synchronized passively with `localStorage`.
- **Heuristic Path Simulator (`Simulator.jsx`):** Emphasizes remaining ECTS count against distinct module weights (specifically Master Thesis = 30 ECTS, Module = 6 ECTS). Iterates through `[1.0, 1.3, ... 4.0]` combinations to yield actionable discrete grade advice minimizing variance. 

## 🛡 Privacy 

This application functions with absolute data autonomy. No user analytics are collected, and external network calls don't occur. Your study progress backups serialize to standard `.json`, manually exportable via the Backup panel.
