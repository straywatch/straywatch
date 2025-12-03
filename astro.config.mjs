import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  adapter: netlify(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@lib': '/src/lib',
        '@hooks': '/src/hooks'
      }
    },
    server: {
      allowedHosts: true
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000
  }
});
