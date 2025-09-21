import type { Config } from "drizzle-kit";

export default {
  schema: "./sqlite/schema.ts",
  out: "./sqlite/migrations",
  dialect: "sqlite",
} satisfies Config;
