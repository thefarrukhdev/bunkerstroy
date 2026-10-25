# ==========================================
# BUNKERSTROY ADMIN DASHBOARD DOCKERFILE
# Multi-stage production build (Vite + Nginx Alpine)
# ==========================================

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN apk add --no-cache libc6-compat

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY apps/admin/package.json ./apps/admin/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter @bunkerstroy/types run build
RUN pnpm --filter @bunkerstroy/admin run build

# --- Production Nginx Runner ---
FROM nginx:1.27-alpine AS runner

COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

RUN echo 'server {' \
  '    listen 80;' \
  '    server_name _;' \
  '    root /usr/share/nginx/html;' \
  '    index index.html;' \
  '    location / {' \
  '        try_files $uri $uri/ /index.html;' \
  '    }' \
  '    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {' \
  '        expires 30d;' \
  '        add_header Cache-Control "public, no-transform";' \
  '    }' \
  '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
