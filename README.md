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

AniWays is a self-hosted anime streaming platform offering HD playback, subtitle support, multiple server selection, and watchlist tracking. It uses:

- 🟧 **Ktor** for the backend API (written in Kotlin)
- 🟨 **Bun** as a fast HLS proxy server
- 🟩 **SvelteKit** for the frontend
- 🐳 Docker & Docker Compose for containerization

## 🚀 Features

- 🔍 Search and browse anime
- 📺 Stream in HD with subtitle support
- 🌐 Switch between multiple servers for reliability
- 📌 Track viewing progress
- 📝 Maintain a personal watchlist
- 🔗 Integrate with external services (like MyAnimeList)

## 📁 Project Structure

```
aniways/
├── api/              # Ktor-based backend API (Kotlin)
├── streaming/        # Bun-based HLS proxy server
├── website/          # SvelteKit frontend
├── .env.example      # Sample environment variables
├── docker-compose.yaml
└── README.md
```

## 🛠️ Local Development

### 🔧 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Bun](https://bun.sh/) (for running proxy manually)
- [Java 17+](https://adoptium.net/) (for running Ktor API manually)
- [Node.js](https://nodejs.org/)

### ▶️ Quick Start (Docker)

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

3. **Run the App**

```bash
docker-compose up --build
```

This will:

- Start the API on `http://localhost:8080`
- Start the HLS proxy on `http://localhost:1234`
- Start the frontend on `http://localhost:5173`

## 🧪 Running Without Docker

### 🔸 API (Ktor)

```bash
cd api
ENV_FILE=../.env ./gradlew run
```

> Make sure you have Java 17+ installed.

### 🔸 Streaming Proxy (Bun)

```bash
cd streaming
NODE_ENV=development bun src/index.ts
```

> Make sure Bun is installed. This assumes your config is loaded based on `NODE_ENV`.

### 🔸 Frontend (SvelteKit)

```bash
cd website
bun install     # or npm install
bun run dev     # or npm run dev
```

## ☁️ Deployment (Free Options)

### 🔹 **Frontend (SvelteKit)**

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)

These platforms can deploy your `website/` directory directly. You’ll need to expose your API/proxy URLs via environment variables.

### 🔹 **Backend (API + Streaming)**

- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [Fly.io](https://fly.io/)
- [Glitch](https://glitch.com/) _(for basic experimentation)_

> These can deploy your `api/` and `streaming/` services individually by pointing to their Dockerfiles or using a `Docker Compose` file on platforms that support it.

## 🌍 Environment Variables

Refer to `.env.example` for the required environment variables across:

- `api` (Ktor)
- `streaming` (HLS Proxy)
- `website` (Frontend)

Make sure to configure CORS, API base URLs, and streaming paths appropriately depending on environment (`NODE_ENV` / `ENV_FILE`).

## 🛡️ License

This project is provided as-is for educational and personal purposes.  
**Not licensed for commercial redistribution or public streaming.**
