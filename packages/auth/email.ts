import { randomBytes } from "crypto";

const pending = new Map<string, string>();

export function generateVerificationToken(userId: string) {
  const token = randomBytes(16).toString("hex");
  pending.set(token, userId);
  console.log(`Verify: http://localhost:3000/verify?token=${token}`);
  return token;
}

export function verifyToken(token: string) {
  const userId = pending.get(token);
  if (userId) {
    pending.delete(token);
    return userId;
  }
  return null;
}
