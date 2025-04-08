<div align="center">

<img src="./website/static/logo.png" width="150" alt="AniWays logo" />

# AniWays

**An anime streaming website**

</div>

## ⚠️ Disclaimer

**AniWays is intended for personal use only.**  
Any form of commercial use, redistribution, public streaming, or monetization (e.g., advertisements) is strictly prohibited.  
Violating these terms may lead to takedown requests or legal action. Please ensure you are in full compliance when self-hosting this project.

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

2. **Set Up Root Environment Variables**

```bash
cp .env.example .env
```

> Edit `.env` with your preferred values.

3. **Set Up Frontend Environment Variables**

```bash
cd website
cp .env.example .env
```

> Make sure the values match your root `.env`, especially the API and streaming URLs.

4. **Run Services Manually**

#### 🔸 API (Ktor)

```bash
cd api
ENV_FILE=../.env ./gradlew run
```

> The API will run on `http://localhost:8080` by default.

#### 🔸 Streaming Proxy (Bun)

```bash
cd streaming
bun install
NODE_ENV=development bun src/index.ts
```

> The streaming proxy will run on `http://localhost:1234` by default.

#### 🔸 Frontend (SvelteKit)

```bash
cd website
bun install     # or npm install
bun run dev     # or npm run dev
```

> Access the website at `http://localhost:3000`

## 🐳 Deployment with Docker Swarm

AniWays can be deployed in production using Docker Swarm and Traefik for HTTPS routing for only the backend and streaming proxy.
This setup is ideal for self-hosting on a VPS or cloud server.

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
- `traefik` (reverse proxy with TLS)
- `redis` and `postgres` instances

All services will be automatically exposed via HTTPS using Traefik and Let's Encrypt.

## Deploying Frontend

The frontend is not included in the Docker stack. You can deploy it separately using platforms like:

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Fly.io](https://fly.io/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 🌍 Environment Variables

Refer to the `.env.example` files in both the project root and `website/` directory for the required variables.

Make sure to configure:

- CORS
- API and streaming base URLs
- Domain names used by Traefik
- MAL credentials
- Cloudinary settings (if used)

## ☁️ Optional Hosting

If you're not using Swarm, you can also deploy the API and streaming proxy on platforms like:

- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Fly.io](https://fly.io/)
- [Render](https://render.com/)
- [Replit](https://replit.com/)

## 🐞 Issues

If you encounter any issues or have feature requests, please open an issue on the [GitHub repository](https://github.com/Coeeter/aniways/issues).

When reporting a bug, please include:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Logs or screenshots (if applicable)

We welcome contributions! Feel free to fork the repository and submit a pull request with your changes.

## 🛡️ License

This project is licensed under the **MIT License** for personal use and educational purposes only.
**Commercial redistribution, public streaming, or monetization is strictly prohibited.**
By using this project, you agree to abide by the terms of the license and the restrictions outlined in this README.
