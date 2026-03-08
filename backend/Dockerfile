# ============================================
# Backend Dockerfile
# ============================================
# This tells Docker how to create a container for the backend.

# Use Node.js 20 (LTS = Long Term Support = stable)
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (for better Docker caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the server with nodemon (for development)
CMD ["npm", "run", "dev"]
