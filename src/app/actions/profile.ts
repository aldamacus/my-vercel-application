"use server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { profiles } from "@/db/active-schema";

export interface ProfileData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export async function getProfileAction(email: string): Promise<ProfileData | null> {
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

export async function saveProfileAction(data: ProfileData): Promise<void> {
  const db = getDb();
  await db
    .insert(profiles)
    .values(data)
    .onConflictDoUpdate({
      target: profiles.email,
      set: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      },
    });
}
