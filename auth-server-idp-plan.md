# Auth Server / IDP Plan (Node.js + TypeScript + Turborepo)

A pragmatic plan for building a **small but serious OAuth 2.1 auth server** for learning and hobby projects.

This plan is intentionally split into:

- **V1 — OAuth 2.1 Core**
- **V2 — Management, convenience, and hardening**

The goal is to avoid scope creep: build a correct, usable core first, then add the nicer platform features later.

---

## Project Goal

Build a custom auth server / IDP that:

- is good enough to use for hobby projects
- teaches the real mechanics of auth, sessions, OAuth, and OIDC
- is implemented in TypeScript in the existing monorepo
- is deployable to a VPS
- aims to satisfy **OAuth 2.1 expectations** without turning into a giant IAM platform

---

## Core Product Decisions

### 1. Database

**Chosen direction: Postgres-first / Postgres-only**

- Use **Postgres** as the primary database for both development and deployment.
- Use **Drizzle ORM** with one schema model, one migration path, and one set of queries.
- Avoid the earlier SQLite + Postgres dual-schema idea unless there is a very strong reason to reintroduce it.

Why:

- less duplication
- less schema drift
- more realistic auth/storage behavior
- better fit for a “serious hobby” auth server

### 2. Runtime / App Shape

- **apps/idp** → Next.js app for:
  - login / register / verify / consent UI
  - route handlers for auth endpoints
- Delay **apps/admin** until V2
- Keep shared packages small and practical at first:
  - `packages/db`
  - `packages/auth`
  - `packages/config`
  - optional `packages/ui` if shared UI actually pays for itself

### 3. Auth Scope

The project should focus on a **small serious core**, not broad enterprise coverage.

That means:

- yes to **Authorization Code + PKCE**
- yes to **refresh token rotation**
- yes to **strict redirect URI matching**
- yes to **consent**
- yes to **good tests**
- no to premature extras like PAR, Device Code, CIBA, multi-tenant admin, federation, etc.

### 4. IDP Session Model

Use:

- **cookie sessions** for the user interacting with the IDP itself
- **OAuth tokens** for client applications

That keeps the model clear:

- browser login/consent session is one thing
- OAuth token issuance is another

---

## What “Not Overly Enterprise” Means Here

Out of scope for the first serious versions:

- multi-tenant architecture
- advanced RBAC/ABAC systems
- federation / SAML / social login
- dynamic client registration
- PAR / Device Code / CIBA
- large audit platform
- heavy internal platform abstractions
- building a big admin product before the auth core works well

This is not about avoiding quality.
It is about avoiding low-value complexity too early.

---

## Recommended Repository Shape

```text
├─ apps/
│ ├─ idp/         # Next.js app: login/consent UI + OAuth/OIDC route handlers
│ └─ admin/       # later, in V2
├─ packages/
│ ├─ db/          # Drizzle schema, migrations, query layer
│ ├─ auth/        # domain logic: users, sessions, clients, tokens
│ ├─ config/      # env parsing / config validation
│ └─ ui/          # optional shared UI components
```

Keep this lean in V1. More packages can come later if they solve a real problem.

---

# V1 — OAuth 2.1 Core

## V1 Goal

Ship a **small, serious, deployable auth server** that can realistically back hobby projects.

It should be possible to say:

> “I can use this for login and authorization in my own projects now.”

## V1 Scope

### Included

- Postgres + Drizzle migrations
- users
- password hashing
- email verification
- IDP login/logout/session handling
- OAuth clients stored in DB
- Authorization Code flow
- PKCE
- consent flow
- authorization codes stored in DB
- token endpoint
- access tokens
- refresh tokens
- refresh token rotation / replay detection
- strict redirect URI validation
- scope validation
- tests
- deployability on VPS

### Strongly recommended in V1

Even though the main target is OAuth 2.1, these make the server much more useful in practice:

- `/.well-known/openid-configuration`
- `/jwks.json`
- `id_token`
- `/userinfo`

This gives you a lightweight but genuinely useful OIDC-capable provider.

### Explicitly not in V1

- admin app
- MFA
- social login
- SAML
- PAR
- Device Code
- dynamic client registration
- multi-tenant support
- big operational dashboards

---

## V1 PR-Sized Milestones

### V1.1 — Postgres foundation

Goal: establish one clean persistence direction.

Deliverables:

- move DB plan to **Postgres-first**
- configure `packages/db` for Postgres only
- add initial Drizzle schema + migrations
- document local and VPS database setup
- add env/config validation for DB connection

### V1.2 — User model and password auth

Goal: make local authentication real.

Deliverables:

- users table
- password hashing + verification
- register flow
- login flow
- basic protected route or “who am I” route
- tests for register/login failure/success cases

### V1.3 — Email verification

Goal: make account lifecycle less toy-like.

Deliverables:

- verification token model
- verification endpoint/UI
- console email transport first
- mark user as verified
- tests for valid/invalid/expired verification token paths

### V1.4 — Session handling for the IDP

Goal: separate browser auth from OAuth tokens.

Deliverables:

- secure cookie session model
- login session persistence
- logout flow
- session lookup helpers
- route protection for authenticated IDP pages
- tests for login → session → logout

### V1.5 — OAuth client model

Goal: make the server able to represent real consumers.

Deliverables:

- clients table
- redirect URIs
- public vs confidential client shape
- basic seed/script for creating clients
- strong redirect URI validation rules
- tests for invalid redirect URI cases

### V1.6 — Authorization endpoint + PKCE

Goal: first real OAuth slice.

Deliverables:

- `/authorize`
- validate request parameters
- require login before consent
- require PKCE for public clients
- issue authorization code
- store auth code in DB
- redirect back with code
- tests for happy path + validation failures

### V1.7 — Consent flow

Goal: make the auth server behave like an actual provider.

Deliverables:

- consent screen
- allow/deny action
- store granted scopes with auth transaction
- denial redirect behavior
- tests for allow/deny paths

### V1.8 — Token endpoint

Goal: exchange auth code for tokens correctly.

Deliverables:

- `/token`
- auth code exchange
- PKCE verifier validation
- code expiry + one-time use
- issue access token
- issue refresh token
- persist token metadata
- tests for invalid verifier / reused code / expired code

### V1.9 — Refresh token rotation

Goal: satisfy an important OAuth 2.1 expectation.

Deliverables:

- refresh token exchange
- token rotation
- replay detection / invalidation behavior
- tests covering reuse and rotation rules

### V1.10 — Minimal OIDC basics

Goal: make the provider more broadly usable.

Deliverables:

- `id_token`
- `/userinfo`
- `/jwks.json`
- `/.well-known/openid-configuration`
- `jose`-based signing/verification
- issuer + audience validation rules
- tests for token claims and metadata responses

### V1.11 — Deployable V1

Goal: prove it works outside localhost.

Deliverables:

- VPS deployment notes
- production env example
- HTTPS / issuer configuration guidance
- migration-on-deploy workflow
- “sample hobby app client” smoke test

---

# V2 — Management, Convenience, and Hardening

## V2 Goal

Make the system easier to operate, inspect, and extend without expanding it into a huge platform too quickly.

V2 is where convenience and operational visibility belong.

## V2 Scope

### Included

- admin app
- client management UX
- user management UX
- basic operational views
- revocation / maintenance tooling
- more security hardening
- better DX and documentation

### Possible later additions

- MFA
- audit/event views
- token revocation endpoint
- introspection endpoint
- rate limiting / abuse protections
- session inspection/revocation
- nicer setup scripts / bootstrap tools

### Still not required just because V2 exists

- SAML
- federation
- dynamic client registration
- PAR / Device Code / CIBA
- multi-tenant platform concerns

---

## V2 PR-Sized Milestones

### V2.1 — Admin scripts / CLI first

Goal: avoid building UI before knowing what hurts.

Deliverables:

- scripts to create/update clients
- scripts to inspect users
- scripts to revoke tokens or sessions
- seed helpers for local/dev environments

### V2.2 — Admin app skeleton

Goal: introduce management UI only after the data model is stable.

Deliverables:

- `apps/admin`
- auth gate for admin users
- basic layout/navigation
- shared API client helpers

### V2.3 — Client management UI

Goal: remove DB/script friction for the most common admin task.

Deliverables:

- list clients
- create/edit client
- manage redirect URIs
- manage scopes / client type
- rotate client secrets where relevant

### V2.4 — User management UI

Goal: gain practical oversight.

Deliverables:

- list users
- inspect user details
- mark verified / disabled
- optional password reset/admin actions

### V2.5 — Token/session maintenance

Goal: operational control.

Deliverables:

- revoke refresh tokens
- inspect active sessions/tokens
- optional simple revocation endpoint
- clearer token lifecycle visibility

### V2.6 — Hardening extras

Goal: make the system sturdier for long-term hobby use.

Deliverables:

- security headers / cookie review
- rate limiting strategy
- abuse protections on auth endpoints
- logging / tracing improvements
- optional MFA design spike

---

## Security Baseline

These should be treated as baseline expectations, especially by late V1:

- Authorization Code + PKCE only
- no implicit or hybrid flows
- strict redirect URI matching
- short-lived auth codes
- one-time auth code use
- refresh token rotation
- secure cookie handling
- signing keys exposed via JWKS
- strong password hashing
- issuer and audience validation
- explicit scope validation

---

## Testing Strategy

### V1

- unit tests for auth domain logic
- integration tests for Next.js route handlers
- happy-path and failure-path tests for OAuth endpoints
- database-backed tests against Postgres

### V2

- broader integration tests
- UI tests for admin flows where worth it
- end-to-end smoke tests across full login/consent/token flows

---

## Example Environment

```ini
DATABASE_URL=postgresql://...
ISSUER=https://auth.example.com
COOKIE_SECRET=...
SMTP_URL=console://
IDP_PUBLIC_URL=https://auth.example.com
```

For local development, use a local Postgres instance or a VPS-hosted development database.

---

## Final Summary

### V1

Build the **small serious auth server**:

- Postgres
- sessions
- users
- clients
- Authorization Code + PKCE
- refresh token rotation
- optional but recommended OIDC basics

### V2

Build the **management and convenience layer**:

- admin app
- client/user management
- token/session tooling
- extra hardening and operational polish

This keeps the project practical, serious, and finishable.