FROM oven/bun:alpine AS base

FROM base as builder
WORKDIR /app
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build --debug

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

LABEL org.opencontainers.image.source https://github.com/Coeeter/aniways

CMD ["bun", "dist/index.js"]