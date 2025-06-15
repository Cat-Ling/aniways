FROM oven/bun:alpine AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile server \
  ./src/index.ts

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/server ./server

EXPOSE 1234

LABEL org.opencontainers.image.source=https://github.com/Coeeter/aniways

CMD ["./server"]