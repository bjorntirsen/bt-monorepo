# M1 — Minimal Local Auth (Session-based)

Goal: Build a minimal local authentication flow with email + password, backed by sessions, without any external crypto dependencies.

## Features

- User registration with salted + hashed passwords (`crypto.scrypt`)
- User login with session cookies
- Email verification tokens (console transport for now)
- Minimal Next.js UI: `/login`, `/register`, `/verify`
- E2E tests for register → verify → login → logout

## Implementation Details

### 1. Password Hashing (scrypt, native Node.js)

`scrypt` is memory-hard, dependency-free, and available in the Node.js `crypto` standard library.

Key characteristics:

- ✅ Dependency-free
- ✅ Memory-hard (similar spirit to Argon2id)
- ⚠️ Slower than bcrypt/argon2 but fine for first iteration

```typescript
// filepath: packages/core-auth/password.ts
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, keyHex] = stored.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const key = Buffer.from(keyHex, "hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);

  return timingSafeEqual(key, derivedKey);
}
```

### 2. User Model

```typescript
// filepath: packages/core-auth/users.ts
import { db } from "@repo/db/client";
import { users } from "@repo/db/sqlite/schema";
import { hashPassword, verifyPassword } from "./password";

export async function registerUser(email: string, password: string) {
  const passwordHash = hashPassword(password);
  await db.insert(users).values({ email, passwordHash });
}

export async function authenticateUser(email: string, password: string) {
  const [user] = await db.select().from(users).where(users.email.eq(email));
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}
```

### 3. Sessions (Cookie-based)

Use signed, HTTP-only cookies to persist login state.

```typescript
// filepath: packages/core-auth/sessions.ts
import { randomBytes } from "crypto";
import { db } from "@repo/db/client";

const sessions = new Map<string, string>(); // TODO: replace with DB table

export function createSession(userId: string) {
  const sessionId = randomBytes(32).toString("hex");
  sessions.set(sessionId, userId);
  return sessionId;
}

export function getUserFromSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function destroySession(sessionId: string) {
  sessions.delete(sessionId);
}
```

In `apps/idp`, set cookies via `Response.cookies.set("session", sessionId, { httpOnly: true, secure: true })`.

### 4. Email Verification

Console-based transport:

```typescript
// filepath: packages/core-auth/email.ts
import { randomBytes } from "crypto";

const pending = new Map<string, string>();

export function generateVerificationToken(userId: string) {
  const token = randomBytes(16).toString("hex");
  pending.set(token, userId);
  console.log(`Verify: http://localhost:3000/verify?token=${token}`);
  return token;
}

export function verifyToken(token: string) {
  const userId = pending.get(token);
  if (userId) {
    pending.delete(token);
    return userId;
  }
  return null;
}
5. Next.js Pages
/register: form → calls registerUser, triggers verification email.

/verify: consumes token, marks user as verified.

/login: form → calls authenticateUser, creates session cookie.

/logout: clears cookie.

6. E2E Tests
Use Playwright to simulate:

Register → receive console token → visit /verify.

Login with correct credentials → see "logged in".

Logout → session cleared.

Login with wrong password → rejected.

Deliverables
packages/core-auth: password.ts, users.ts, sessions.ts, email.ts.

apps/idp/app/: /login, /register, /verify, /logout.

Working cookie-based sessions.

E2E test passing.

Next: Move to M2 — Implement OAuth2.1 endpoints on top of this local auth.
```
