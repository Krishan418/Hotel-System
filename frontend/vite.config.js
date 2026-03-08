// ============================================
// vite.config.js — Vite Development Server Configuration
// ============================================
//
// WHY DO WE NEED A PROXY?
//   In development, React runs on port 5173 and Express on 5000.
//   Writing fetch('http://localhost:5000/api/rooms') would work locally,
//   but would break in Docker (where "localhost" refers to the container itself).
//
//   The proxy lets us write just: fetch('/api/rooms')
//   Vite forwards /api/* to the backend automatically.
//   This works in BOTH local development AND Docker.
//
// HOW THE TARGET IS CHOSEN:
//   Docker:  VITE_API_TARGET is set to 'http://backend:5000' in docker-compose.yml
//   Local:   VITE_API_TARGET is not set → fallback 'http://localhost:5000'

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    // ── host: true ──
    // Makes the dev server listen on ALL network interfaces (0.0.0.0).
    // Required for Docker — without it, traffic can't reach Vite from the host.
    host: true,

    // Port the Vite dev server listens on
    port: 5173,

    // ── proxy ──
    // Any request starting with /api gets forwarded to the backend.
    // The React code just writes fetch('/api/rooms') — Vite handles the rest.
    proxy: {
      '/api': {
        // Use VITE_API_TARGET if set (Docker), otherwise localhost (local dev)
        target: process.env.VITE_API_TARGET || 'http://localhost:5000',
        changeOrigin: true, // Rewrites the Host header — required by most servers
      },
    },
  },
});
