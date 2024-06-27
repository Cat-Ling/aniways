<h1 align="center">
  <img src="./apps/website/public/logo.png" width="200" height="200" /><br>
  AniWays<br>
  An anime streaming website with built-in MyAnimeList support
</div>

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Coeeter/aniways.git
```

## 🚀 Usage

```bash
# Install dependencies
bun install

# Upate the database schema
bun db:push

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

# For Deployments

# SSL Certificates for HTTPS
WEBSITE_AWS_SSL_CERT_ARN=<ssl-cert-arn-for-website>
HEALTHCHECK_AWS_SSL_CERT_ARN=<ssl-cert-arn-for-healthcheck>

# AWS Role for github actions to authenticate with AWS
AWS_ROLE=<aws-role>
```

To get the `MAL_CLIENT_ID` and `MAL_CLIENT_SECRET`, you will need to create a new application on the [MyAnimeList API](https://myanimelist.net/apiconfig).

To get the `MAL_SECRET_KEY`, you can generate a random string using a tool like [randomkeygen](https://randomkeygen.com/).

To get the `DATABASE_URL`, you will need to create a new postgres database and get the connection string.

To get the `WEBSITE_AWS_SSL_CERT_ARN` and `HEALTHCHECK_AWS_SSL_CERT_ARN`, you will need to create a new certificate on AWS Certificate Manager.

To get the `AWS_ROLE`, you will need to create a new role on AWS IAM. You can follow the instructions [here](https://docs.sst.dev/going-to-production#deploy-from-github-actions).

## 🔨 Built With

- [Turborepo](https://turbo.build/repo/docs)
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Drizzle](https://orm.drizzle.team/)
- [tRPC](https://trpc.io/)
- [T3](https://create.t3.gg/)
- [@animelist](https://github.com/Neo-Ciber94/animelist)
- [MyAnimeList API](https://myanimelist.net/apiconfig/references/api/v2)
- [Jikan API](https://jikan.moe/)
