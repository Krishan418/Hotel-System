// ============================================
// vite.config.js — Vite Development Server Configuration
// ============================================
//
// WHY DO WE NEED THIS FOR DOCKER?
//   When running inside Docker, the browser talks to the frontend
//   container at localhost:5173. But API calls go to the backend
//   container (hotel_backend). Without a proxy, the fetch('/api/auth/login')
//   call would hit localhost:5173/api/... — the frontend server — which
//   doesn't know about API routes.
//
//   The PROXY tells Vite: "Any request starting with /api → forward
//   it to the backend container at http://backend:5000".
//
// WHEN RUNNING LOCALLY (without Docker):
//   The same proxy still works — just change the target to
//   http://localhost:5000 if you run backend manually.
//
// HOW THE PROXY WORKS:
//   Browser → GET /api/rooms → Vite dev server → backend:5000/api/rooms
//   So from React's perspective, ALL calls go to the same origin.
//   This avoids CORS issues completely!

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    // ── host: true ──
    // Makes the dev server listen on ALL network interfaces (0.0.0.0),
    // not just localhost. Required so Docker can forward traffic to Vite.
    host: true,

    // Port the Vite dev server runs on
    port: 5173,

    // ── proxy ──
    // Forwards /api/* requests to the backend.
    // This lets us write fetch('/api/rooms') in React without specifying
    // the full backend URL — Vite handles the forwarding.
    proxy: {
      '/api': {
        // In Docker: 'http://backend:5000' (using docker-compose service name)
        // Locally:   'http://localhost:5000'
        target: 'http://backend:5000',

        // changeOrigin: true → rewrites the Host header to match the target.
        // Required for most servers to accept proxied requests.
        changeOrigin: true,
      },
    },
  },
});
