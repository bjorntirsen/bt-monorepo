import { NextResponse } from "next/server";

export async function POST() {
  // Login endpoint - will be implemented in M1
  return NextResponse.json({ message: "Login endpoint" }, { status: 501 });
}
