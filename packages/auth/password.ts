import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split(":") as [string, string];
  if (parts.length !== 2) {
    return false;
  }
  const [saltHex, keyHex] = parts;
  const salt = Buffer.from(saltHex, "hex");
  const key = Buffer.from(keyHex, "hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);

  if (key.length !== derivedKey.length) return false;

  return timingSafeEqual(key, derivedKey);
}
