import { NextResponse } from "next/server";
import { registerUser } from "@repo/auth/users";
import { generateVerificationToken } from "@repo/auth/email";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 },
      );
    }

    // 1. Register user
    const user = await registerUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "User registration failed" },
        { status: 500 },
      );
    }

    // 2. Trigger verification email (console log for now)
    generateVerificationToken(user.id);

    return NextResponse.json(
      {
        message: "User registered, check console for verification link",
      },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 },
    );
  }
}
