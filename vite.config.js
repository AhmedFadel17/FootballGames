import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [
    laravel({
      input: 'resources/js/index.tsx',
      refresh: true,
    }),
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  server: {
    host: '0.0.0.0', // 💡 Exposes Vite outside the Docker container
    port: 5173,
    hmr: {
      host: 'localhost', // 💡 Browser communicates back to host machine on port 5173
    },
    watch: {
      usePolling: true, // 💡 Essential for Windows/WSL2 file change detection inside Docker
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js'),
    },
  },
});
