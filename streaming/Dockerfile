FROM oven/bun:slim AS base

# Install Puppeteer dependencies + Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  wget \
  libgbm-dev \
  libnss3 \
  libxss1 \
  libglib2.0-0 \
  libdrm2 \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN NODE_ENV=production bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile server \
  ./src/index.ts

# Stage 3: Production
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/server ./server

EXPOSE 1234

LABEL org.opencontainers.image.source=https://github.com/Coeeter/aniways

CMD ["./server"]
