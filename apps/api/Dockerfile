# ==========================================
# BUNKERSTROY ENTERPRISE API DOCKERFILE
# Multi-stage production build (Node.js 22 Alpine)
# ==========================================

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache openssl libc6-compat

# --- 1. Dependencies stage ---
FROM base AS dependencies
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/db/package.json ./packages/db/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY apps/api/package.json ./apps/api/

RUN pnpm install --frozen-lockfile

# --- 2. Build stage ---
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/db/node_modules ./packages/db/node_modules
COPY --from=dependencies /app/packages/types/node_modules ./packages/types/node_modules
COPY --from=dependencies /app/apps/api/node_modules ./apps/api/node_modules

COPY . .

# Generate Prisma Client & Build Packages
RUN pnpm --filter @bunkerstroy/db exec prisma generate
RUN pnpm --filter @bunkerstroy/types run build
RUN pnpm --filter @bunkerstroy/api run build

# --- 3. Production Runner stage ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl libc6-compat curl

# Create non-root user
RUN addgroup --system --gid 1001 bunkergroup && \
    adduser --system --uid 1001 bunkeruser

COPY --from=builder --chown=bunkeruser:bunkergroup /app/node_modules ./node_modules
COPY --from=builder --chown=bunkeruser:bunkergroup /app/packages/db ./packages/db
COPY --from=builder --chown=bunkeruser:bunkergroup /app/packages/types ./packages/types
COPY --from=builder --chown=bunkeruser:bunkergroup /app/apps/api/dist ./apps/api/dist
COPY --from=builder --chown=bunkeruser:bunkergroup /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder --chown=bunkeruser:bunkergroup /app/apps/api/package.json ./apps/api/package.json

USER bunkeruser

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

WORKDIR /app/apps/api
CMD ["node", "dist/main.js"]
