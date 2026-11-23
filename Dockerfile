# ---- Stage 1: build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем исходники (node_modules исключён через .dockerignore).
COPY . .

# Устанавливаем зависимости и собираем.
RUN npm ci --no-audit --no-fund
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Переносим только собранный сервер Nitro.
COPY --from=builder /app/.output .output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
