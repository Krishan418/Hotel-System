# ============================================
# frontend/Dockerfile
# ============================================
#
# This builds and serves the React + Vite app.
#
# TWO MODES:
#   Development (default): `npm run dev` — fast refresh, no build step
#   Production:            multi-stage build → nginx serves static files
#
# For this project we use DEVELOPMENT mode because:
#   - You're still building and testing the app
#   - Hot module replacement (HMR) lets you see changes instantly
#
# HOW TO SWITCH TO PRODUCTION:
#   Uncomment the production section at the bottom and
#   comment out the development section.

# ── Node.js 20 LTS on Alpine Linux ──
FROM node:20-alpine

WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./

# Install all dependencies (including dev tools like vite)
RUN npm install

# Copy the rest of the source code
COPY . .

# Vite's dev server listens on port 5173
EXPOSE 5173

# Start Vite dev server
# --host 0.0.0.0 → makes it accessible from outside the container
# Without --host, Docker can't forward traffic to Vite
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
