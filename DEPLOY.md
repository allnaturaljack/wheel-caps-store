# Deploying Hub & Hue

| Piece | Where | Address |
|---|---|---|
| Storefront (Next.js) | Vercel | `https://hubandhue.com` |
| Backend + admin (Medusa) | Railway | `https://api.hubandhue.com` (admin at `/app`) |
| Redis | Railway, next to the backend | private |
| Postgres | Neon, through the Vercel Marketplace | private |

Deploy in this order: database, backend, storefront, then DNS. The storefront
build reads products from the backend, so the backend has to be running first.

Vercel's Hobby plan is for non-commercial use only; the storefront needs a Pro
team.

## 1. Database (Neon via Vercel)

1. In Vercel, open **Storage** > **Create Database** and pick **Neon**
   (Serverless Postgres). Name it `hub-and-hue`, and pick a US region (use the
   same region as the Railway service in step 2).
2. Open the database's **.env.local** tab and copy the **unpooled** connection
   string (`DATABASE_URL_UNPOOLED`). Medusa's migrations need the direct
   connection, not the pooled one.

## 2. Backend (Railway)

1. Sign in to Railway with GitHub and create a project from the
   `allnaturaljack/wheel-caps-store` repo. Railway reads `railway.json` at the
   repo root for the build, start and health check settings. Leave the root
   directory empty.
2. In the same project add **Database > Redis**.
3. On the backend service, open **Variables** and add:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | the Neon unpooled string from step 1 |
   | `REDIS_URL` | `${{Redis.REDIS_URL}}` |
   | `JWT_SECRET` | output of `openssl rand -hex 32` |
   | `COOKIE_SECRET` | output of `openssl rand -hex 32` (a different one) |
   | `AUTH_MFA_ENCRYPTION_KEY` | output of `openssl rand -hex 32` (a third one) |
   | `STORE_CORS` | `https://hubandhue.com,https://www.hubandhue.com` |
   | `ADMIN_CORS` | `https://api.hubandhue.com` |
   | `AUTH_CORS` | `https://hubandhue.com,https://www.hubandhue.com,https://api.hubandhue.com` |
   | `MEDUSA_BACKEND_URL` | `https://api.hubandhue.com` |
   | `STOREFRONT_URL` | `https://hubandhue.com` |
   | `RESEND_API_KEY` | your Resend API key |
   | `RESEND_FROM_EMAIL` | `Hub & Hue <orders@hubandhue.com>` (no quotes in Railway) |
   | `RESEND_REPLY_TO_EMAIL` | `support@hubandhue.com` |
   | `MEDUSA_DISABLE_TELEMETRY` | `true` |

   Generate each secret on your Mac with `openssl rand -hex 32` and paste it
   straight into Railway. Never reuse the values from your local `.env`.

4. Deploy. The first start runs the database migrations, which also seed the
   starter catalog, the US region, shipping options and the storefront's
   publishable key.
5. Under **Settings > Networking > Custom Domain**, add `api.hubandhue.com`.
   Railway shows a CNAME target for step 4.
6. Create your admin login. In the service's shell (or with the Railway CLI):

   ```bash
   cd apps/backend/.medusa/server && npx medusa user --invite -e you@yourdomain.com
   ```

   Open `https://api.hubandhue.com/app/invite?token=<token>` and set your password.
7. In the admin, go to **Settings > Publishable API Keys** and copy the key for
   step 3.

## 3. Storefront (Vercel)

1. **Add New > Project**, import `allnaturaljack/wheel-caps-store`, and set
   **Root Directory** to `apps/storefront`. Vercel detects Next.js and pnpm.
2. Add the environment variables:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_MEDUSA_BACKEND_URL` | `https://api.hubandhue.com` |
   | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | the `pk_...` key from step 2.7 |
   | `NEXT_PUBLIC_BASE_URL` | `https://hubandhue.com` |
   | `NEXT_PUBLIC_DEFAULT_REGION` | `us` |

3. Deploy.
4. Under **Settings > Domains**, add `hubandhue.com` and `www.hubandhue.com`,
   and set `www` to redirect to `hubandhue.com`. Vercel shows the DNS records
   for step 4.

## 4. DNS (GoDaddy)

1. Turn off GoDaddy's domain **Forwarding** for `hubandhue.com`; it currently
   points the domain at GoDaddy's forwarding servers.
2. In **DNS Records**:
   - Replace the `@` **A** record(s) with the value Vercel shows.
   - Set `www` to the **CNAME** Vercel shows.
   - Add `api` as a **CNAME** to the target Railway shows.
3. Leave the email records alone: the `@` **MX** and **TXT** records (ImprovMX),
   everything on `send`, `resend._domainkey`, and `_dmarc`.

DNS changes can take up to an hour to apply. Vercel and Railway issue HTTPS
certificates automatically once the records resolve.

## 5. After launch

- Place an order on `https://hubandhue.com` and confirm the confirmation email
  arrives. Checkout uses the manual payment provider until Stripe is set up, so
  orders arrive unpaid.
- Submit a fitment request and confirm both emails arrive.
- Add the Print Shop mailing address under **Settings > Locations & Shipping**.
- **Before uploading product photos**, set up S3-compatible storage (for
  example Cloudflare R2) using the `S3_*` variables in
  `apps/backend/.env.template`. Without it, uploads are saved on Railway's
  disk, which is wiped on every deploy.
