import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // Configure proper MIME types for service worker and manifest
    middlewareMode: false,
  },
  plugins: [react()
    ,
    VitePWA({
      // Enable PWA in development mode
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html'
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Containers',
        short_name: 'CNS',
        description: 'Comtainers management system',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024, // 6 MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              }
            }
          }
        ]
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

})
