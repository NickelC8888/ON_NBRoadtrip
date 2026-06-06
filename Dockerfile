# ── Stage 1: Build Vite frontend + compile native modules ────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Production server ────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copy all node_modules from builder (includes compiled better-sqlite3 binary)
COPY --from=builder /app/node_modules ./node_modules
COPY server/ ./server/
COPY --from=builder /app/dist ./dist

# Data volume mount point for SQLite file
RUN mkdir -p /app/data

EXPOSE 3001
CMD ["node", "server/index.js"]
