import "dotenv/config";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export { eq } from "drizzle-orm";
export * from "./schema";

const sqlite = new Database(process.env.DB_FILE_NAME!);
export const db = drizzle(sqlite);
