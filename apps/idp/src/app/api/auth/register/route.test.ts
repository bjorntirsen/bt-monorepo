import { describe, it, expect } from "vitest";
import { POST } from "./route";
import { beforeEach } from "vitest";
import { db } from "@repo/db";
import { users } from "@repo/db/schema";
import crypto from "node:crypto";

beforeEach(async () => {
  await db.delete(users);
});

describe("POST /api/register", () => {
  it("returns 400 if email or password missing", async () => {
    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify({ email: "" }),
    });

    const res = await POST(req);

    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/required/i);
  });

  it("registers a user successfully", async () => {
    const email = `user-${crypto.randomUUID()}@example.com`;
    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: "Password123!",
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.message).toMatch(/registered/i);
  });
});
