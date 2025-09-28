import { db, eq } from "@repo/db";
import { users } from "@repo/db/schema";
import { hashPassword, verifyPassword } from "./password";

export async function registerUser(email: string, password: string) {
  const passwordHash = hashPassword(password);
  await db.insert(users).values({ email, passwordHash });
}

export async function authenticateUser(email: string, password: string) {
  const found = await db.select().from(users).where(eq(users.email, email));

  const user = found[0];
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}
