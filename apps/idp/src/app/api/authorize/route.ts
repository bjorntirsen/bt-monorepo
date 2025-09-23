import { NextResponse } from "next/server";

export async function GET() {
  // OAuth2 authorization endpoint - will be implemented in later milestone
  return NextResponse.json(
    { message: "Authorization endpoint" },
    { status: 501 },
  );
}
