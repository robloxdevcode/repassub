# Linklock

**Create. Share. Unlock.**

A retro-styled creator unlock platform built with Next.js, Clerk, Supabase (PostgreSQL), Prisma, and Stripe.

## Features

- Create unlock campaigns with a link or text content
- Action gating (follow, subscribe, join, email, visit)
- Public unlock pages with lock/unlock animations
- Analytics dashboard with retro HUD charts
- Audience database
- Stripe subscriptions
- Admin control center
- Full marketing site with SEO

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS v4
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL) + Prisma
- **Payments:** Stripe
- **Storage:** Links only (Google Drive, Dropbox, etc.) — no file hosting
- **Analytics:** Custom events + PostHog
- **Email:** Resend

## Getting Started

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. **Clerk** — create an app at [dashboard.clerk.com](https://dashboard.clerk.com):
   - Copy publishable + secret keys into `.env.local`
   - **User & authentication → Restrictions:** Sign-up mode = **Public**
   - **Email:** enabled, required
   - **Password:** enabled, required
   - **Phone:** disabled (required phone causes sign-up 422 errors)
   - **Paths:** sign-in `/sign-in`, sign-up `/sign-up`
   - **Redirect URLs:** `http://localhost:3000/dashboard` and `http://localhost:3000/*`
   - **Bot protection:** [Clerk Dashboard → Protect → Rules](https://dashboard.clerk.com/~/protect/rules) → enable **Bot sign-up protection** (Smart CAPTCHA / Turnstile on suspicious sign-ups). The `<SignUp />` component shows the challenge automatically — no code changes needed. Or run `powershell scripts/enable-clerk-bot-protection.ps1` after `npx clerk@latest login`.

3. **Supabase** — create a project at [supabase.com](https://supabase.com):
   - **Project Settings → Database → Connection string → URI**
   - Use **Direct connection** (port **5432**)
   - Replace `[YOUR-PASSWORD]` with your database password
   - Add `?sslmode=require` if not present
   - Paste into `.env.local` as `DATABASE_URL`

4. Install dependencies and push schema:
   ```bash
   npm install
   npm run db:push
   npm run db:seed
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) → **Start free** → sign up → you land on `/dashboard`

## Environment Variables

See [`.env.example`](.env.example) for all variables. Minimum for auth:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk client key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `DATABASE_URL` | Supabase PostgreSQL connection |
| `NEXT_PUBLIC_SITE_URL` | Public unlock link base URL |
| `NEXT_PUBLIC_APP_URL` | App URL (same as site URL for single-host deploy) |

## Deployment (Vercel + Supabase)

1. Push this repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add the same env vars as `.env.local` (use your live Vercel URL for `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_APP_URL`)
4. Run `npm run db:push` once locally with your Supabase `DATABASE_URL` to create tables (if not done already)
5. In Clerk, add your live URL to allowed redirects: `https://your-app.vercel.app/*`

**Vercel + Supabase tip:** If you see database connection errors on the live site, switch `DATABASE_URL` to Supabase **Transaction pooler** (port **6543**) with `?pgbouncer=true` in the Vercel env settings.

## License

Private — All rights reserved.
