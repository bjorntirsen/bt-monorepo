import "@testing-library/jest-dom";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const dbFile = path.resolve(repoRoot, "packages/db/test.db");

process.env.DB_FILE_NAME = dbFile;

if (fs.existsSync(dbFile)) {
  fs.rmSync(dbFile);
}

const sqlite = new DatabaseSync(dbFile);
sqlite.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    verified INTEGER NOT NULL DEFAULT 0
  );
`);
sqlite.close();
