"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users, profiles } from "@/db/active-schema";
import { hashPassword, isLegacySha256Hash, verifyPassword } from "@/lib/password";
import { createSession, clearSession } from "@/lib/session";
import { consumeRateLimit, getRequestIp } from "@/lib/rateLimit";

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
  const h = await headers();
  if (
    !(await consumeRateLimit(
      "register",
      getRequestIp(h),
      8,
      60 * 60 * 1000
    )).ok
  ) {
    return {
      ok: false,
      error: "Too many registration attempts. Try again in an hour.",
    };
  }

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
  if (password.length < 8) {
    return {
      ok: false,
      error: "Password must be at least 8 characters.",
    };
  }

  const passwordHash = await hashPassword(password);
  const token = randomToken();

  await db.insert(users).values({
    email: trimmed,
    passwordHash,
    confirmed: false,
    confirmToken: token,
  });

  await db
    .insert(profiles)
    .values({
      email: trimmed,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: "",
    })
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

  await createSession(user.email);

  return { ok: true, email: user.email };
}

export async function signInAction(
  email: string,
  password: string
): Promise<{ ok: boolean; email?: string; error?: string }> {
  const h = await headers();
  if (
    !(await consumeRateLimit(
      "signin",
      getRequestIp(h),
      40,
      15 * 60 * 1000
    )).ok
  ) {
    return {
      ok: false,
      error: "Too many sign-in attempts. Please try again later.",
    };
  }

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

  const match = await verifyPassword(password, user.passwordHash);
  if (!match) {
    return { ok: false, error: "Incorrect password." };
  }

  if (isLegacySha256Hash(user.passwordHash)) {
    const upgraded = await hashPassword(password);
    await db
      .update(users)
      .set({ passwordHash: upgraded })
      .where(eq(users.email, user.email));
  }

  if (!user.confirmed) {
    return {
      ok: false,
      error: "Please confirm your email address before signing in.",
    };
  }

  await createSession(user.email);

  return { ok: true, email: user.email };
}

export async function signOutAction(): Promise<void> {
  await clearSession();
}
