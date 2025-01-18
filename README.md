<h1 align="center">
  <img src="./public/logo.png" width="200" height="200" /><br>
  AniWays<br>
  A anime streaming platform built with Next.js and TypeScript
</h1>

## ⚠️ Disclaimer

Self-hosting this application is strictly limited to personal use only. Commercial utilization is prohibited, and the inclusion of advertisements on your self-hosted website may lead to serious consequences, including potential site takedown measures. Ensure compliance to avoid any legal or operational issues.

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Coeeter/aniways.git
```

## 🚀 Usage

```bash
# Install dependencies
bun install

# Start the dev server
bun dev
```

NOTE: You will need to create a `.env` file in the root directory with the following content:

```properties
# MyAnimeList API
MAL_CLIENT_ID=<mal-client-id>
MAL_CLIENT_SECRET=<mal-client-secret>

# JWT Secret for MAL Authentication
MAL_SECRET_KEY=<mal-secret-key>

# Postgres Database Connection String
DATABASE_URL=<postgres-database-url>
```

To get the `MAL_CLIENT_ID` and `MAL_CLIENT_SECRET`, you will need to create a new application on the [MyAnimeList API](https://myanimelist.net/apiconfig).

To get the `MAL_SECRET_KEY`, you can generate a random string using a tool like [randomkeygen](https://randomkeygen.com/).

To get the `DATABASE_URL`, you will need to create a new postgres database and get the connection string.

## 🔨 Built With

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Drizzle](https://orm.drizzle.team/)
- [tRPC](https://trpc.io/)
- [T3](https://create.t3.gg/)
- [@animelist](https://github.com/Neo-Ciber94/animelist)
- [MyAnimeList API](https://myanimelist.net/apiconfig/references/api/v2)
- [Jikan API](https://jikan.moe/)
