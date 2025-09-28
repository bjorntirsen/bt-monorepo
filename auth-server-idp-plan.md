# Auth Server / IDP Plan (Node.js + TypeScript + Turborepo)

A pragmatic, incremental plan to build an OAuth 2.1-ready auth server/IDP in a TypeScript turborepo, runnable locally on SQLite and deployable to Supabase (Postgres).

---

## High-Level Approach

- **Auth core:** Custom OAuth 2.1 / OIDC implementation (all endpoints built in-house with TypeScript + jose).
- **Persistence layer (SQLite local + Supabase Postgres prod):**
  - **Chosen:** Drizzle ORM (lightweight, TS-native, SQL-first).
  - ⚠️ Note: Requires maintaining `sqliteTable` and `pgTable` definitions separately, but queries can stay shared.
- **Runtime/stack:** Next.js (backend + login/consent frontend) and a separate Vite + React SPA (admin dashboard).
- **Repo:** Turborepo monorepo with `apps/*` and `packages/*`, all TypeScript.

---

## Turborepo Layout

```text
├─ apps/
│ ├─ idp/         # Next.js app with custom OAuth2.1/OIDC server + login/consent UI
│ └─ admin/       # Vite SPA (admin dashboard)
├─ packages/
│ ├─ db/          # Drizzle schemas & query layer
│ ├─ core-auth/   # Domain logic (users, sessions, MFA)
│ ├─ ui/          # Shared UI components
│ ├─ config/      # Env loader (zod-validated)
│ ├─ types/       # Shared TS types
│ └─ tooling/     # ESLint, tsconfig, vitest utils
```

---

## Optional DB Package Structure

```text
packages/db/
├─ sqlite/        # sqliteTable definitions + migrations
├─ pg/            # pgTable definitions + migrations
└─ client/        # unified repo API that picks the correct dialect
```

---

## Milestones (Incremental)

### M0 — Scaffolding

- Setup `packages/config` (dotenv + zod).
- Add Drizzle schema in `packages/db`:
  - Create `sqliteTable` definitions for local dev (`file:./dev.db`).
  - Create `pgTable` definitions for Supabase Postgres.
  - Use drizzle-kit to generate and run migrations.
- Skeleton `apps/idp` with Next.js.

### M1 — Minimal Local Auth (Session-based)

- Implement `core-auth`: users, password hashing, email verification tokens.
- Dev email transport (console).
- `apps/idp` login/register/verify UI.
- Cookie sessions or sessions table.
- E2E tests for login/register/logout.

### M2 — Add OAuth2.1 / OIDC Endpoints (Custom Implementation)

- Implement core OAuth2.1 endpoints:
  - `/authorize` → handles auth requests with PKCE, redirects with code
  - `/token` → exchanges code for tokens, issues refresh + access + (optional) ID token
  - `/userinfo` → returns claims about the authenticated user
  - `/jwks.json` → expose JSON Web Key Set for verifying signatures
  - `/.well-known/openid-configuration` → discovery metadata
- Implement refresh token rotation and replay detection
- Persist authorization codes, tokens, and sessions in Drizzle
- Issue and verify JWTs (ID tokens, access tokens) with `jose`
- Build consent flow UI in `apps/idp`
- Hard-fail on disallowed grant types (no implicit/hybrid flows)

### M3 — OAuth 2.1 Compliance

- Enforce PKCE for public clients.
- No implicit/hybrid flows.
- Refresh token rotation + reuse detection.
- Add PAR (Pushed Authorization Requests).
- Optional: Device Code, CIBA.

### M4 — Admin App

- `apps/admin` with CRUD for Clients & Users.
- RBAC for admin users.
- Audit logs.

### M5 — MFA & Hardening

- Add TOTP (QR codes).
- Add WebAuthn (passkeys).
- Step-up authentication for sensitive scopes.
- Security alerts (new sign-ins, recovery codes).

### M6 — Deploy to Supabase

- Apply Drizzle migrations to Supabase.
- Configure secrets (cookie keys, JWKS, SMTP).
- Reverse proxy/HTTPS with proper issuer URL.
- Cache `.well-known/openid-configuration` and JWKS behind CDN.

### M7 — Ecosystem & Polish

- Add discovery doc.
- Provide sample clients (SPA, server, CLI).
- Token introspection & revocation endpoints.
- Rate limiting, observability, audit logs.

---

## DB Layer (Drizzle Example)

- Define separate schema files:
  - `packages/db/sqlite/schema.ts`
  - `packages/db/pg/schema.ts`

Example (user table):

```ts
// sqlite/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});
```

```ts
// pg/schema.ts
import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});
```

- Create a unified query API in `packages/db/client` that loads the right dialect at runtime based on env
- Prefer column types and constraints supported by both SQLite & Postgres to maximize portability
- Run CI tests against both SQLite and Postgres (via Supabase or testcontainers)

## IDP App Structure (Next.js)

```text
apps/idp/
├─ app/
│  ├─ login/             # login page
│  ├─ consent/           # consent page
│  └─ api/
│     ├─ authorize/       # /authorize endpoint
│     ├─ token/           # /token endpoint
│     ├─ userinfo/        # /userinfo endpoint
│     ├─ jwks.json/       # JWKS endpoint
│     └─ well-known/      # /.well-known/openid-configuration
├─ lib/
│  ├─ provider.ts        # new Provider(issuer, configuration)
│  ├─ adapter/DrizzleAdapter.ts
│  └─ services/
│     ├─ users.ts
│     ├─ mfa.ts
│     └─ email.ts
```

## Frontends

- **apps/idp (Next.js)**
  - Routes: `/login`, `/register`, `/verify-email`, `/forgot`, `/mfa`, `/consent`
  - Handles login, consent, and all OIDC interaction flows
- **apps/admin (Vite SPA)**
  - Admin dashboard (CRUD for clients/users, audit logs, RBAC)
  - Auth gate + RBAC for admin users
  - Consumes APIs exposed from `apps/idp`
  - Add a `vercel.json` with a rewrite so SPA routes resolve to `index.html`:
    ```json
    {
      "rewrites": [{ "source": "/(.*)", "destination": "/" }]
    }
    ```

## Security & Crypto

- Use jose for JWKs, signing, verification
- Rotate keys regularly; expose via JWKS endpoint
- Argon2id for password hashing
- Strict redirect URI matching
- CSRF protection on forms
- Tight CORS config
- Cookies: `Secure` in prod, `SameSite=Lax` (or `None` if cross-site), and set `domain` if sharing across subdomains
- Use cookies only for IDP user sessions (login/consent flows); use Bearer tokens for admin API access
- Validate PKCE verifiers, client authentication, scopes, and all OAuth2.1/OIDC request parameters according to the spec

## Testing Strategy

- Unit: core-auth logic.
- Integration: idp (Next.js) API routes with Supertest.
- E2E: Playwright for auth flows.
- DB matrix in CI: run tests on SQLite & Postgres.

## OAuth 2.1 Compliance Checklist

- [ ] Authorization Code + PKCE only
- [ ] Disallow implicit/hybrid flows
- [ ] Refresh token rotation
- [ ] Redirect URI strict matching
- [ ] Scope consent UX
- [ ] Offline access for refresh
- [ ] JWKS endpoint + rotation
- [ ] Token revocation & introspection
- [ ] Well-known metadata
- [ ] MFA for sensitive scopes

## Example ENV

### Local

```ini
DB_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
ISSUER=http://localhost:3000
COOKIE_SECRET=...
SMTP_URL=console://
IDP_PUBLIC_URL=https://idp.example.com
ADMIN_PUBLIC_URL=https://admin.example.com
```

### Prod (Supabase)

```ini
DB_PROVIDER=postgresql
DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres
ISSUER=https://auth.example.com
COOKIE_SECRET=...
SMTP_URL=...
TRUST_PROXY=1
IDP_PUBLIC_URL=https://idp.example.com
ADMIN_PUBLIC_URL=https://admin.example.com
```

## CI/CD Notes

- Build with `turbo run build`
- Deploy `apps/idp` (Next.js) — for example as a Docker image or directly on Vercel/Fly.io
- Run `drizzle-kit migrate` on release to keep the database schema in sync
- In CI, run the test matrix against both SQLite and Postgres (e.g. Supabase or testcontainers)
- When deploying to Vercel serverless, use the Supabase Pooler DSN (port `6543`) to avoid exhausting database connections

## TL;DR Next Steps

- Setup packages/db with Drizzle (sqliteTable + pgTable).
- Next.js + custom OAuth2.1/OIDC implementation in `apps/idp`.
- Next.js login/consent UI.
- Get OAuth Code+PKCE flow working end-to-end.
- Apply migrations to Supabase.
- Add Admin app, MFA, and OAuth 2.1 refinements.
