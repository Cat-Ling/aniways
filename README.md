<h1 align="center">
  <img src="./website/static/logo.png" width="200" height="200" /><br>
  AniWays<br>
  An anime streaming website
</h1>

## ⚠️ Disclaimer

Self-hosting this application is strictly limited to personal use only. Commercial utilization is prohibited, and the inclusion of advertisements on your self-hosted website may lead to serious consequences, including potential site takedown measures. Ensure compliance to avoid any legal or operational issues.

## 📝 Description

AniWays is a website that allows users to watch anime for free. It is built using Ktor for the backend and Sveltekit for the frontend. Everything is hosted using docker and docker stack.

## 🚀 Features

- Search for anime
- Watch anime in HD
- Watch anime with subtitles
- Watch anime with multiple servers
- Track your progress
- Save anime to your watchlist
- Link your account to external services

## 📚 Installation

### Requirements

- Docker
- Docker Compose

### Steps

1. Clone the repository

```bash
git clone https://github.com/Coeeter/aniways.git
```

2. Change directory

```bash
cd aniways
```

3. Create a `.env` file and follow the instructions in the `.env.example` file

```bash
touch .env
```

4. Start the application

```bash
docker-compose up
```
