import { NextResponse } from "next/server";
import { verifyToken } from "@repo/auth/email";
import { db, eq } from "@repo/db";
import { users } from "@repo/db/schema";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const userId = verifyToken(token);
  if (!userId) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 },
    );
  }

  await db.update(users).set({ verified: true }).where(eq(users.id, userId));

  return NextResponse.json({ message: "Email verified successfully" });
}
