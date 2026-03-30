import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/grades/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Grade Tracker M.Sc. Economics',
        short_name: 'Grades',
        description: 'PWA zur Studienplanung und Notenberechnung',
        theme_color: '#09090b', // zinc-950
        background_color: '#09090b',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg', // Vorläufiges Icon, falls vorhanden
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});
