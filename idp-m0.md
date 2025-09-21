# M0 — Scaffolding

## 1. Setup `packages/config` (dotenv + zod)

- Create `packages/config/index.ts`:

  ```ts
  // filepath: packages/config/index.ts
  import { z } from "zod";
  import dotenv from "dotenv";

  dotenv.config();

  const envSchema = z.object({
    DB_PROVIDER: z.enum(["sqlite", "postgresql"]),
    DATABASE_URL: z.string(),
    ISSUER: z.string().url(),
    COOKIE_SECRET: z.string(),
    SMTP_URL: z.string(),
    IDP_PUBLIC_URL: z.string().url(),
    ADMIN_PUBLIC_URL: z.string().url(),
  });

  export const env = envSchema.parse(process.env);
  ```

## 2. Add Drizzle schema in `packages/db`

- Create SQLite schema:

  ```ts
  // filepath: packages/db/sqlite/schema.ts
  import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

  export const users = sqliteTable("users", {
    id: integer("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
  });
  ```

- Create Postgres schema:

  ```ts
  // filepath: packages/db/pg/schema.ts
  import { pgTable, text, serial } from "drizzle-orm/pg-core";

  export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
  });
  ```

- Add Drizzle migration scripts (see [drizzle docs](https://orm.drizzle.team/docs/migrations) for details).

## 3. Unified DB Client

- Create a runtime dialect switcher:

  ```ts
  // filepath: packages/db/client/index.ts
  import { env } from "@bt-monorepo/config";
  import { drizzle } from "drizzle-orm";
  import sqlite from "drizzle-orm/sqlite";
  import pg from "drizzle-orm/postgres";

  let db;
  if (env.DB_PROVIDER === "sqlite") {
    db = drizzle(sqlite({ url: env.DATABASE_URL }));
  } else {
    db = drizzle(pg({ url: env.DATABASE_URL }));
  }

  export { db };
  ```

## 4. Skeleton `apps/idp` with Next.js

- Scaffold Next.js app in `apps/idp`:

  ```bash
  cd apps
  npx create-next-app@latest idp --typescript
  ```

- Add basic routes:
  - `/login`
  - `/register`
  - `/api/authorize`
  - `/api/token`

## 5. Drizzle Migrations

- Add `drizzle-kit` to devDependencies.
- Generate migrations:

  ```bash
  npx drizzle-kit generate:sqlite --schema=packages/db/sqlite/schema.ts
  npx drizzle-kit generate:pg --schema=packages/db/pg/schema.ts
  ```

- Run migrations locally:
  ```bash
  npx drizzle-kit migrate:sqlite
  ```

## 6. Commit Initial Scaffolding

- Add all new files to git.
- Push to your repo.

---

**Next:** Move to M1 — Minimal Local Auth (Session-based).
