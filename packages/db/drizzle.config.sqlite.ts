import type { Config } from "drizzle-kit";

export default {
  schema: "./sqlite/schema.ts",
  out: "./sqlite/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./sqlite/local.db",
  },
} satisfies Config;
