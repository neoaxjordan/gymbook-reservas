# ── Stage 1: build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ── Stage 2: production ─────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Usuario no-root (requerimiento de la prueba)
RUN addgroup -S gymbook && adduser -S gymbook -G gymbook

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

USER gymbook

EXPOSE 3000

CMD ["node", "dist/index.js"]