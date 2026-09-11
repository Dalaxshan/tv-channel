# ── deps ──────────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── builder ───────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

ARG MONGODB_URI
ARG MONGODB_DB_NAME
ARG YOUTUBE_API_KEY
ARG YOUTUBE_CHANNEL_ID
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WEB3FORMS_KEY
ARG ADMIN_JWT_SECRET
ARG AUTH_COOKIE_NAME
ARG R2_ACCOUNT_ID
ARG R2_ACCESS_KEY_ID
ARG R2_SECRET_ACCESS_KEY
ARG R2_BUCKET_NAME
ARG R2_ENDPOINT
ARG R2_PUBLIC_URL

ENV MONGODB_URI=$MONGODB_URI \
    MONGODB_DB_NAME=$MONGODB_DB_NAME \
    YOUTUBE_API_KEY=$YOUTUBE_API_KEY \
    YOUTUBE_CHANNEL_ID=$YOUTUBE_CHANNEL_ID \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_WEB3FORMS_KEY=$NEXT_PUBLIC_WEB3FORMS_KEY \
    ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET \
    AUTH_COOKIE_NAME=$AUTH_COOKIE_NAME \
    R2_ACCOUNT_ID=$R2_ACCOUNT_ID \
    R2_ACCESS_KEY_ID=$R2_ACCESS_KEY_ID \
    R2_SECRET_ACCESS_KEY=$R2_SECRET_ACCESS_KEY \
    R2_BUCKET_NAME=$R2_BUCKET_NAME \
    R2_ENDPOINT=$R2_ENDPOINT \
    R2_PUBLIC_URL=$R2_PUBLIC_URL

RUN bun run build

# ── runner ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser  -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/public          ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
