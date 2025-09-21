import type { Config } from "drizzle-kit";

export default {
  schema: "./pg/schema.ts",
  out: "./pg/migrations",
  dialect: "postgresql",
} satisfies Config;
