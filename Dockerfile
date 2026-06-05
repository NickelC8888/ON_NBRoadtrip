# ── Stage 1: Build Vite frontend ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Production server ────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Only install production deps (skips vite, tailwind, etc.)
COPY package*.json ./
RUN npm ci --omit=dev

COPY server/ ./server/
COPY --from=builder /app/dist ./dist

# Data volume mount point for SQLite file
RUN mkdir -p /app/data

EXPOSE 3001
CMD ["node", "server/index.js"]
