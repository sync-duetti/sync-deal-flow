# Contract App – Lean MVP (Next.js + Supabase, no Prisma)

## Stack
- Next.js (Pages Router), Tailwind
- Supabase Postgres via `pg` (pooled URL at runtime)
- PDF via `puppeteer-core` + `@sparticuz/chromium` (Vercel-friendly)
- Email via SMTP (Postmark or any provider)
- Admin protected by HTTP Basic Auth in `middleware.js`

## Setup
1. **Create Supabase project** and run this SQL in the SQL editor:

```sql
create table if not exists "Agreement" (
  id text primary key,
  slug text unique not null,
  title text,
  tracks jsonb not null default '[]'::jsonb,
  "bodyTemplate" text not null,
  "isActive" boolean not null default true,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create table if not exists "Signing" (
  id text primary key,
  "agreementId" text not null references "Agreement"(id) on delete cascade,
  "artistName" text not null,
  "artistEmail" text not null,
  "signedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "pdfPath" text,
  "pdfSha256" text not null
);
```

2. **Env vars**: copy `.env.example` → `.env.local` and fill in.
   - `DATABASE_URL` = *pooled* Supabase URL (port 6543)
   - `ADMIN_BASIC_TOKEN` = base64 of `username:password` (e.g. `printf 'admin:pass' | base64`)

3. **Install & run**
```bash
npm i
npm run dev
```

4. Open `http://localhost:3000/admin` → browser prompts for Basic Auth.

## Deploy (Vercel)
- Add the same envs in Vercel Project → Settings → Environment Variables.
- Set `NODE_OPTIONS=--dns-result-order=ipv4first` if you hit DNS/IPv6 quirks.

## Notes
- Public signing page is `/a/[slug]` and posts directly to `/api/sign/[slug]` which returns a PDF download and sends an email copy.
# duetti-sync-flow
