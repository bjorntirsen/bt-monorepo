import { randomBytes } from "crypto";

const sessions = new Map<string, string>(); // TODO: replace with DB table

export function createSession(userId: string) {
  const sessionId = randomBytes(32).toString("hex");
  sessions.set(sessionId, userId);
  return sessionId;
}

export function getUserFromSession(sessionId: string) {
  return sessions.get(sessionId) ?? null;
}

export function destroySession(sessionId: string) {
  sessions.delete(sessionId);
}
