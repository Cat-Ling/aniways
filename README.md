<h1 align="center">
  <img src="./website/static/logo.png" width="200" height="200" /><br>
  AniWays<br>
  <sub>An anime streaming website</sub>
</h1>

## ⚠️ Disclaimer

**AniWays is intended for personal use only.**  
Commercial use and any form of monetization, such as placing advertisements, are strictly prohibited.  
Violating this may lead to takedowns or legal action. Ensure full compliance when self-hosting.

## 📝 Overview

AniWays is a self-hosted anime streaming platform built for personal use. It supports HD playback with subtitles, lets users switch between streaming servers, tracks watch progress, and integrates with external services like MyAnimeList.

The project is composed of three main services:

- **Backend API:** Built with [Ktor](https://ktor.io/) using Kotlin
- **Streaming Proxy:** A high-performance HLS proxy written in [Bun](https://bun.sh/)
- **Frontend:** A modern interface built with [SvelteKit](https://kit.svelte.dev/)

For production deployments, AniWays uses **Docker Swarm** with Traefik and automatic HTTPS support.

## 🚀 Features

- 🔍 Search and browse anime
- 📺 Stream in HD with subtitle support
- 🌐 Switch between multiple servers for reliability
- 📌 Track viewing progress
- 📝 Maintain a personal watchlist
- 🔗 Integrate with external services (like MyAnimeList, Anilist in the future)

## 📁 Project Structure

```
aniways/
├── api/              # Ktor-based backend API (Kotlin)
├── streaming/        # Bun-based HLS proxy server
├── website/          # SvelteKit frontend
├── .env.example      # Sample environment variables
├── docker-stack.yaml # Docker Swarm deployment file
└── README.md
```

## 🛠️ Local Development

Docker is **not** used for local development. You can run each service manually using your local environment.

### 🔧 Requirements

- [Bun](https://bun.sh/)
- [Java 17+](https://adoptium.net/)
- [Node.js](https://nodejs.org/)

### ▶️ Local Setup

1. **Clone the Repository**

```bash
git clone https://github.com/Coeeter/aniways.git
cd aniways
```

2. **Set Up Environment Variables**

```bash
cp .env.example .env
```

Edit `.env` with your preferred values.

3. **Run Services Manually**

#### 🔸 API (Ktor)

```bash
cd api
ENV_FILE=../.env ./gradlew run
```

> Requires Java 17+

#### 🔸 Streaming Proxy (Bun)

```bash
cd streaming
NODE_ENV=development bun src/index.ts
```

> Make sure Bun is installed

#### 🔸 Frontend (SvelteKit)

```bash
cd website
bun install     # or npm install
bun run dev     # or npm run dev
```

## 🐳 Deployment with Docker Swarm

AniWays can be deployed in production using Docker Swarm and Traefik for HTTPS routing.

### 📦 Requirements

- Docker Swarm (`docker swarm init`)
- Valid domain names with DNS configured
- Let's Encrypt email
- Docker secret for environment variables

### 🔧 Setup

1. **Prepare Environment**

```bash
cp .env.example .env
docker secret create env-v5 .env
```

2. **Deploy the Stack**

```bash
docker stack deploy -c docker-stack.yaml aniways
```

This will deploy:

- `api` (Ktor)
- `streaming` (Bun proxy)
- `website` (Frontend)
- `traefik` (reverse proxy with TLS)
- `redis` and `postgres`

All services will be automatically exposed via HTTPS using Traefik and Let's Encrypt.

## 🌍 Environment Variables

Refer to `.env.example` for the required environment variables across:

- `api` (Ktor)
- `streaming` (HLS Proxy)
- `website` (Frontend)

Make sure to configure:

- CORS
- API base URLs
- Streaming paths
- Domain names used by Traefik

## ☁️ Optional Hosting

If you're not using Swarm, you can also deploy components separately on platforms like:

- [Netlify](https://www.netlify.com/) / [Vercel](https://vercel.com/) for frontend
- [Railway](https://railway.app/) / [Render](https://render.com/) for backend
- [Fly.io](https://fly.io/) for full stack deployments

## 🛡️ License

This project is provided as-is for educational and personal purposes.  
**Not licensed for commercial redistribution or public streaming.**
