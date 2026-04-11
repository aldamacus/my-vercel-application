"use server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, profiles } from "@/db/active-schema";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

// ---------------------------------------------------------------------------

export async function registerAction(
  email: string,
  password: string,
  firstName: string = "",
  lastName: string = ""
): Promise<{ ok: boolean; token?: string; error?: string }> {
  const db = getDb();
  const trimmed = email.trim().toLowerCase();

  const existing = await db
    .select({ email: users.email })
    .from(users)
    .where(eq(users.email, trimmed))
    .limit(1);

  if (existing.length > 0) {
    return { ok: false, error: "An account with this email already exists." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const passwordHash = await hashPassword(password);
  const token = randomToken();

  await db.insert(users).values({
    email: trimmed,
    passwordHash,
    confirmed: false,
    confirmToken: token,
  });

  // Seed an empty profile row with the name provided at registration
  await db
    .insert(profiles)
    .values({ email: trimmed, firstName: firstName.trim(), lastName: lastName.trim(), phone: "" })
    .onConflictDoUpdate({
      target: profiles.email,
      set: { firstName: firstName.trim(), lastName: lastName.trim() },
    });

  return { ok: true, token };
}

export async function confirmAction(
  token: string
): Promise<{ ok: boolean; email?: string; error?: string }> {
  const db = getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.confirmToken, token))
    .limit(1);

  if (!user) {
    return { ok: false, error: "Confirmation link is invalid or already used." };
  }

  await db
    .update(users)
    .set({ confirmed: true, confirmToken: null })
    .where(eq(users.email, user.email));

  return { ok: true, email: user.email };
}

export async function signInAction(
  email: string,
  password: string
): Promise<{ ok: boolean; email?: string; error?: string }> {
  const db = getDb();
  const trimmed = email.trim().toLowerCase();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, trimmed))
    .limit(1);

  if (!user) {
    return { ok: false, error: "No account found with this email." };
  }

  const passwordHash = await hashPassword(password);
  if (user.passwordHash !== passwordHash) {
    return { ok: false, error: "Incorrect password." };
  }

  if (!user.confirmed) {
    return {
      ok: false,
      error: "Please confirm your email address before signing in.",
    };
  }

  return { ok: true, email: user.email };
}
