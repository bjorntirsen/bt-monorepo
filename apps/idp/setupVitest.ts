import "@testing-library/jest-dom";
import { config } from "dotenv";
import { execSync } from "node:child_process";

config({ path: ".env.test" });

execSync("pnpm --filter @repo/db drizzle:migrate", { stdio: "inherit" });
