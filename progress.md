# Progress Tracker — OAuth/OIDC Learning IDP

Use this checklist to track implementation progress and guard against regressions.

---

## Phase 0 — Foundations

- [ ] Repo scaffolding complete
- [ ] DB migrations working
- [ ] Seed user + seed OAuth client

---

## Phase 1 — Authentication + Sessions

### Core

- [ ] Users table + password hashing (Argon2id)
- [ ] Login page works
- [ ] Session cookie is HttpOnly + Secure in prod
- [ ] Logout invalidates session

### Tests (Vitest)

- [ ] Password verify test
- [ ] Session create/invalidate test

### Playwright Baseline

- [ ] Playwright installed + CI runnable
- [ ] E2E: login happy path
- [ ] E2E: logout clears session
- [ ] E2E: protected route redirects unauthenticated users

---

## Phase 2 — OAuth 2.1 Core (Code + PKCE)

### `/authorize`

- [ ] Request validation
- [ ] PKCE required
- [ ] Consent screen
- [ ] Authorization code storage + expiry

### Tests

- [ ] E2E: auth code happy path
- [ ] Negative: missing PKCE fails
- [ ] Negative: redirect URI mismatch fails

### `/token`

- [ ] Code exchange works
- [ ] PKCE verifier validated
- [ ] Access token issued
- [ ] Code replay prevention

### Tests

- [ ] E2E: token exchange success
- [ ] Negative: code replay fails
- [ ] Negative: wrong verifier fails

---

## Phase 3 — OpenID Connect

### JWKS + Signing

- [ ] `/jwks.json` endpoint
- [ ] JWT signing implemented

### Tests

- [ ] JWKS verifies signature

### ID Tokens

- [ ] `openid` scope supported
- [ ] `id_token` issued with correct claims
- [ ] `nonce` supported

### Tests

- [ ] E2E: ID token returned
- [ ] Negative: nonce mismatch fails

### Discovery + UserInfo

- [ ] `/.well-known/openid-configuration`
- [ ] `/userinfo` endpoint

### Tests

- [ ] Discovery doc valid
- [ ] UserInfo returns expected claims

---

## Phase 4 — Conformance Harness

- [ ] Parameter validation matrix tests
- [ ] Redirect safety tests
- [ ] Code expiry tests
- [ ] Issuer correctness tests
- [ ] Optional: OpenID test suite partial run

---

## Phase 5 — Refresh + Rotation

- [ ] Refresh tokens issued with `offline_access`
- [ ] Rotation implemented
- [ ] Reuse detection implemented

### Tests

- [ ] Refresh works once
- [ ] Reuse old refresh fails
- [ ] New refresh succeeds

- [ ] Logout invalidates refresh tokens
- [ ] Optional: revocation endpoint

---

## Phase 6 — Optional Extras

- [ ] Admin UI
- [ ] MFA (TOTP)
- [ ] WebAuthn
- [ ] PAR / Device Code / CIBA
- [ ] Audit logs + rate limiting

---

## Notes

- Keep each checkbox tied to a test where possible.
- Treat negative tests as first-class security requirements.
