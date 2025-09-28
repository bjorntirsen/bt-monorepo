import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users_table", {
  id: int("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});
