import { env } from "@repo/env-config";
import Database from "better-sqlite3";
import {
  drizzle as drizzleSqlite,
  BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import { Client } from "pg";
import {
  drizzle as drizzlePg,
  NodePgDatabase,
} from "drizzle-orm/node-postgres";
import * as schema from "../pg/schema";

let db: BetterSQLite3Database | NodePgDatabase<typeof schema> | null = null;
let pgClient: Client | null = null;

/**
 * Initialize the database connection (singleton).
 */
export async function initDb() {
  if (db) return db; // Already initialized

  if (env.DB_PROVIDER === "sqlite") {
    const sqlite = new Database(env.DATABASE_URL);
    db = drizzleSqlite(sqlite);
  } else {
    pgClient = new Client({ connectionString: env.DATABASE_URL });
    try {
      await pgClient.connect();
      db = drizzlePg(pgClient);
    } catch (error) {
      console.error("Failed to connect to PostgreSQL:", error);
      throw error;
    }
  }

  return db;
}

/**
 * Get the initialized database instance.
 */
export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return db;
}

/**
 * Close the database connection (for tests or shutdown).
 */
export async function closeDb() {
  if (env.DB_PROVIDER === "postgresql" && pgClient) {
    await pgClient.end();
    pgClient = null;
  }
  db = null;
}
