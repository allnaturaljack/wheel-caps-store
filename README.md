# Hub & Hue

Online store for 3D-printed wheel caps: a [Medusa](https://medusajs.com) backend
with a Next.js storefront, in one Turborepo workspace.

```text
apps/backend      Medusa server and admin dashboard (port 9000, admin at /app)
apps/storefront   Next.js storefront (port 8000)
dev-db            Project-local PostgreSQL for development
```

## Local development

The workspace uses [pnpm](https://pnpm.io); with Node 22+ run
`corepack enable pnpm` once to get it.

```bash
pnpm install
npm --prefix dev-db install   # the dev database is a standalone package
pnpm db    # terminal 1: Postgres on localhost:5432 (data in dev-db/data)
pnpm dev   # terminal 2: backend + admin on :9000, storefront on :8000
```

Copy `apps/backend/.env.template` to `apps/backend/.env` and fill in
`DATABASE_URL`, `JWT_SECRET` and `COOKIE_SECRET`. The storefront reads
`apps/storefront/.env.local`, which needs the backend URL and its publishable
API key (Admin > Settings > Publishable API Keys).

Create an admin login:

```bash
cd apps/backend && pnpm exec medusa user -e <email> -p <password>
```

The starter catalog, US region and shipping options are seeded by
`apps/backend/src/migration-scripts/initial-data-seed.ts` the first time
migrations run.

## Configuration

Every backend setting is documented in `apps/backend/.env.template`. Redis,
Stripe, S3-compatible file storage and Resend email are each switched on by
setting their variables; without them the backend uses in-memory, local-disk
and log-only defaults.

The brand name, tagline and support email live in
`apps/storefront/src/lib/brand.ts`. The store name used in emails is set in the
admin under Settings > Store.

## Before launch

The contact, shipping, returns, privacy and terms pages are drafts: each shows
a "Draft" notice and highlights the values that still need deciding. Remove the
`draft` flag from a page in `apps/storefront/src/app/[countryCode]/(main)/` once
its text is final.
