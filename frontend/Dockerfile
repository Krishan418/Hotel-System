# ============================================
# Frontend Dockerfile
# ============================================
# This tells Docker how to create a container for the React app.

# Use Node.js 20 (LTS)
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start the development server
# --host flag makes it accessible outside the container
CMD ["npm", "run", "dev", "--", "--host"]
