This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prerequsites

1. Install Redis via homebrew:

```bash
 brew install redis
```

2. Install [Postgres.app](https://postgresapp.com/) for Mac or via homebrew:

```bash
brew install postgresql@17
```

3. Run the following redis commands to start up and interact with a local Redis server, respectively:

```bash
redis-server
redis-cli
```

4. Start/Stop PostgreSQL server:

```bash
brew services start postgresql@17
brew services stop postgresql@17
```

5. Copy .env.template from project root and populate environment variables:

```bash
cp .env.template .env.local
```

6. Run the following command from the project root to set up local PostgreSQL DB:

```bash
npm run db-setup
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
