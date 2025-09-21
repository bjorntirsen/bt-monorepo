# Auth Server / IDP Plan (Node.js + TypeScript + Turborepo)

A pragmatic, incremental plan to build an OAuth 2.1-ready auth server/IDP in a TypeScript turborepo, runnable locally on SQLite and deployable to Supabase (Postgres).

---

## High-Level Approach

- **Auth core:** [`oidc-provider`](https://github.com/panva/node-oidc-provider) for OAuth 2.1 compliance.
- **Persistence layer (SQLite local + Supabase Postgres prod):**
  - **Chosen:** Drizzle ORM (lightweight, TS-native, SQL-first).
  - ⚠️ Note: Requires maintaining `sqliteTable` and `pgTable` definitions separately, but queries can stay shared.
- **Runtime/stack:** Node.js + Express backend; Vite + React frontend(s).
- **Repo:** Turborepo monorepo with `apps/*` and `packages/*`, all TypeScript.

---

## Turborepo Layout

```text
├─ apps/
│ ├─ auth-server/ # Express host + oidc-provider + adapters
│ ├─ web/ # End-user login/consent UI (Vite/React)
│ └─ admin/ # Admin console (Vite/React)
├─ packages/
│ ├─ db/ # Drizzle schemas & query layer
│ ├─ core-auth/ # Domain logic (users, sessions, MFA)
│ ├─ ui/ # Shared UI components
│ ├─ config/ # Env loader (zod-validated)
│ ├─ types/ # Shared TS types
│ └─ tooling/ # ESLint, tsconfig, vitest utils
```

---

the db packages could later be expanded into:

```text
packages/db/
├─ sqlite/ # sqliteTable definitions + migrations
├─ pg/ # pgTable definitions + migrations
└─ client/ # unified repo API that picks the correct dialect
```

---

## Milestones (Incremental)

### M0 — Scaffolding

- Setup `packages/config` (dotenv + zod).
- Add Drizzle schema in `packages/db`:
  - Create `sqliteTable` definitions for local dev (`file:./dev.db`).
  - Create `pgTable` definitions for Supabase Postgres.
  - Use drizzle-kit to generate and run migrations.
- Skeleton `apps/auth-server` with Express.

### M1 — Minimal Local Auth (Session-based)

- Implement `core-auth`: users, password hashing (argon2), email verification tokens.
- Dev email transport (console).
- `apps/web` login/register/verify UI.
- Cookie sessions or sessions table.
- E2E tests for login/register/logout.

### M2 — Add `oidc-provider`

- Integrate into `auth-server` with issuer config.
- Support `authorization_code + PKCE`, `refresh_token`.
- Implement **Drizzle Adapter** for tokens, sessions, and clients:
  - Use Drizzle to persist authorization codes, access tokens, refresh tokens, sessions, and client definitions.
  - Create a common adapter interface so the same logic works across SQLite (local) and Postgres (Supabase).
- Interaction flows:
  - Redirect to `apps/web` login if unauthenticated.
  - Consent screen for scopes.
- Expose JWKS endpoint.

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

Create a unified query API in packages/db/client that loads the right dialect at runtime based on env.

Run CI tests against both SQLite and Postgres (via Supabase or testcontainers).

Use types portable between SQLite & Postgres.

Run CI tests on both DBs (SQLite + Postgres).

## Auth Server Structure

```text
apps/auth-server/src/
├─ index.ts # express bootstrap
├─ provider.ts # new Provider(issuer, configuration)
├─ adapter/DrizzleAdapter.ts
├─ routes/
│ ├─ health.ts
│ ├─ interaction.ts # login, consent
│ └─ admin.ts # admin API
└─ services/
├─ users.ts
├─ mfa.ts
└─ email.ts
```

## Frontends (Vite + React)

apps/web

/login, /register, /verify-email, /forgot, /mfa, /consent.

## Interaction flows with oidc-provider.

apps/admin

## Auth gate + RBAC.

Clients CRUD, User management, Audit events.

## Security & Crypto

Use jose for JWKs, signing, verification.

Rotate keys regularly; expose via JWKS endpoint.

## Argon2id for password hashing.

Strict redirect URI matching.

## CSRF protection on forms.

Tight CORS config.

## Testing Strategy

- Unit: core-auth logic.

- Integration: auth-server endpoints with Supertest.

- E2E: Playwright for auth flows.

- DB matrix in CI: run tests on SQLite & Postgres.

## OAuth 2.1 Compliance Checklist

Authorization Code + PKCE only.

No Implicit.

Refresh token rotation.

Redirect URI strict matching.

Scope consent UX.

Offline access for refresh.

JWKS endpoint + rotation.

Token revocation & introspection.

Well-known metadata.

MFA for sensitive scopes.

## Example ENV

### Local

```ini
DB_PROVIDER=sqlite
DATABASE_URL=file:./dev.db
ISSUER=http://localhost:3000
COOKIE_SECRET=...
SMTP_URL=console://
```

### Prod (Supabase)

```ini
DB_PROVIDER=postgresql
DATABASE_URL=postgresql://...@db.supabase.co:5432/postgres
ISSUER=https://auth.example.com
COOKIE_SECRET=...
SMTP_URL=...
TRUST_PROXY=1
```

## CI/CD Notes

Build via turbo run build.

Deploy auth-server as Docker image.

- Run drizzle-kit migrate on release.

Test matrix across SQLite + Postgres.

## TL;DR Next Steps

- Setup packages/db with Drizzle (sqliteTable + pgTable).

- Express + oidc-provider in auth-server.

- Vite login/consent UI.

- Get OAuth Code+PKCE flow working end-to-end.

- Apply migrations to Supabase.

- Add Admin app, MFA, and OAuth 2.1 refinements.
