import { NextResponse } from "next/server";

export async function POST() {
  // Registration endpoint - will be implemented in M1
  return NextResponse.json({ message: "Register endpoint" }, { status: 501 });
}
