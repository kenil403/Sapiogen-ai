# syntax=docker/dockerfile:1.6

# ============ Stage 1: dependencies ============
FROM node:22-alpine AS deps
WORKDIR /app

# Install deps based on lockfile for reproducible builds
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# ============ Stage 2: build ============
FROM node:22-alpine AS builder
WORKDIR /app

ENV NODE_ENV=production
# Build-time site URL (overridable via --build-arg)
ARG PUBLIC_SITE_URL=https://sapiogenai.com
ENV PUBLIC_SITE_URL=${PUBLIC_SITE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Prune to production dependencies for the runtime image
RUN npm prune --omit=dev

# ============ Stage 3: runtime ============
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4321

# Non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy only what the server needs
COPY --from=builder --chown=app:app /app/dist ./dist
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./package.json

USER app

EXPOSE 4321

# Healthcheck hitting the Astro API route
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" >/dev/null 2>&1 || exit 1

CMD ["node", "./dist/server/entry.mjs"]
