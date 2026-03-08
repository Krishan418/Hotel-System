# ============================================
# backend/Dockerfile
# ============================================
#
# WHAT IS A DOCKERFILE?
#   A recipe for creating a Docker container.
#   Docker reads this file top-to-bottom to build a self-contained
#   environment that runs the backend on ANY machine the same way.
#
# HOW IT WORKS (layer by layer):
#   1. Start with a Node.js base image (pre-installed OS + Node)
#   2. Set our working directory inside the container
#   3. Copy and install npm dependencies
#   4. Copy the rest of the source code
#   5. Tell Docker which port the app uses
#   6. Define the command to start the server

# ── Stage: Use Node.js 20 LTS on Alpine Linux ──
# Alpine is a tiny Linux distro (~5MB) — keeps our image small
FROM node:20-alpine

# Set the working directory INSIDE the container
# All following commands run from /app
WORKDIR /app

# ── Copy package files FIRST (before source code) ──
# WHY? Docker layers are cached. If package.json didn't change,
# Docker reuses the cached layer and skips npm install.
# This makes rebuilds MUCH faster.
COPY package*.json ./

# Install production dependencies only
# --omit=dev skips nodemon and other dev tools (saves space)
RUN npm install --omit=dev

# ── Copy the rest of the source code ──
COPY . .

# Tell Docker this container listens on port 5000
EXPOSE 5000

# Start the backend server using Node directly (not nodemon)
# nodemon is for development on your machine; containers use node
CMD ["node", "server.js"]
