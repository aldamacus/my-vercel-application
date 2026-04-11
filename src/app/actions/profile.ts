"use server";

import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles } from "@/db/active-schema";
import { getVerifiedSessionEmail } from "@/lib/session";

export interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export async function getProfileAction(): Promise<ProfileData | null> {
  const email = await getVerifiedSessionEmail();
  if (!email) return null;

  const db = getDb();
  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1);
  if (!row) return null;
  return {
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
  };
}

export async function saveProfileAction(
  data: Omit<ProfileData, "email"> & { email?: string }
): Promise<void> {
  const sessionEmail = await getVerifiedSessionEmail();
  if (!sessionEmail) return;

  const db = getDb();
  const payload = {
    email: sessionEmail,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
  };
  await db
    .insert(profiles)
    .values(payload)
    .onConflictDoUpdate({
      target: profiles.email,
      set: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });
}
