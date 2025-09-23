import { NextResponse } from "next/server";

export async function POST() {
  // OAuth2 token endpoint - will be implemented in later milestone
  return NextResponse.json({ message: "Token endpoint" }, { status: 501 });
}
