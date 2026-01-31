# OAuth 2.1 + OIDC Learning IDP Roadmap

This repo is a **personal protocol lab** for learning OAuth 2.1 and OpenID Connect by implementing an Identity Provider (IdP) from scratch in TypeScript.

**Goal:** Deep protocol mastery + regression-safe implementation  
**Non-goal:** Shipping a production identity platform

---

## Principles

- Correctness-first sequencing (OAuth Core → OIDC → Hardening → Extras)
- Every capability must have:
  - a happy-path E2E test
  - at least one negative/security regression test
- Authorization Code + PKCE only (OAuth 2.1 mindset)

---

## Repo Layout (suggested)

```
apps/
  idp/        # Next.js IdP (login + consent + OAuth/OIDC endpoints)
  client/     # Minimal demo OAuth client (optional)

packages/
  db/         # Drizzle schemas + repo API
  core-auth/  # Users, sessions, password hashing
  oauth-core/ # Auth codes, PKCE validation, token exchange
  oidc/       # ID tokens, discovery, userinfo
  config/     # Env + validation
  tooling/    # ESLint, tsconfig, vitest utils
```

---

# Phase 0 — Foundations

## Deliverables

- Turborepo + TS packages boot
- Database migrations run
- Seed: 1 test user + 1 OAuth client

---

# Phase 1 — Authentication + Session Core (No OAuth yet)

## M1.1 User Accounts

- Users table
- Argon2id password hashing
- Login form
- HttpOnly session cookie

### Unit tests (Vitest)

- password hashing verifies correctly
- session creation + invalidation

## M1.2 Browser Session Lifecycle

- `/login`, `/logout`
- Session persistence in DB
- CSRF protection on forms

## ✅ Add Playwright here (first time)

### E2E tests

- Login happy path
- Logout clears session
- Protected route redirects when unauthenticated

**Exit criteria:** Sessions are reliable + Playwright runs in CI

---

# Phase 2 — OAuth 2.1 Core (Authorization Code + PKCE only)

## M2.1 `/authorize`

- Validate request params (`client_id`, `redirect_uri`, `scope`)
- Require PKCE challenge
- Consent screen (basic)
- Store authorization request + short-lived code

### Playwright tests

- Happy path: redirect back with `code`
- Negative: missing PKCE → `invalid_request`
- Negative: redirect URI mismatch hard-fails

## M2.2 `/token`

- Exchange `code` + `code_verifier`
- Validate PKCE
- Issue access token
- Mark codes as single-use

### Playwright tests

- Token exchange works
- Code replay fails
- Wrong verifier fails

**Exit criteria:** OAuth Code+PKCE works + replay protections covered

---

# Phase 3 — OpenID Connect (OIDC Layer)

## M3.1 JWKS + Signing

- Key generation
- `/jwks.json`
- JWT signing via `jose`

### Test

- Fetch JWKS and verify token signature

## M3.2 ID Tokens

- `scope=openid`
- Issue `id_token` with `iss`, `aud`, `sub`, `exp`, `iat`
- Implement `nonce`

### Tests

- `id_token` returned when `openid` scope requested
- Nonce mismatch fails

## M3.3 Discovery + UserInfo

- `/.well-known/openid-configuration`
- `/userinfo`

### Tests

- Discovery document contains correct issuer + endpoints
- UserInfo returns expected claims

**Exit criteria:** Basic OIDC Provider correctness achieved

---

# Phase 4 — Conformance Harness (M2.5 Checkpoint)

## Goal

Prove spec correctness beyond happy-path

### Add regression suites for:

- Parameter validation matrix
- Redirect safety
- Code expiry
- Issuer correctness

### Optional

- Partial OpenID test suite runs

**Exit criteria:** Core flows survive refactors with strong negative coverage

---

# Phase 5 — Hard Security (Refresh + Rotation)

## M5.1 Refresh Tokens

- `offline_access`
- Refresh token issuance
- Rotation + reuse detection

### Tests

- Refresh works once
- Reuse old refresh token fails
- New refresh token succeeds

## M5.2 Logout + Revocation

- Logout invalidates refresh tokens
- Token revocation endpoint (optional)

**Exit criteria:** Lifecycle + replay resistance implemented

---

# Phase 6 — Product Surface (Optional)

Only after protocol mastery:

- Admin UI (clients/users CRUD)
- MFA (TOTP → WebAuthn)
- PAR / Device Code / CIBA
- Audit logs, alerts, rate limiting

---

## Testing Progress Map

Run groups:

```bash
pnpm test:e2e auth
pnpm test:e2e oauth-core
pnpm test:e2e oidc
pnpm test:e2e refresh
pnpm test:e2e conformance
```

---

## Next Step

Start with **Phase 1.2**: stable login/logout + first Playwright test.
