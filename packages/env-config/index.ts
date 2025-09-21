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
