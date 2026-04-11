"use server";

import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { messages } from "@/db/active-schema";
import { isAdminEmail } from "@/lib/admin";
import { getVerifiedSessionEmail } from "@/lib/session";

export interface MessageRow {
  id: number;
  from: "guest" | "host";
  text: string;
  time: string;
}

function formatTime(date: Date | string | null): string {
  const d = date ? new Date(date) : new Date();
  return (
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    ", " +
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
  );
}

async function seedMessages(email: string) {
  const db = getDb();
  await db.insert(messages).values({
    userEmail: email,
    from: "host",
    text: "Welcome! We're glad to have you here. Feel free to message us any time if you have questions about your booking or your stay.",
  });
}

export async function getMessagesAction(): Promise<MessageRow[]> {
  const email = await getVerifiedSessionEmail();
  if (!email) return [];

  const db = getDb();

  let rows = await db
    .select()
    .from(messages)
    .where(eq(messages.userEmail, email))
    .orderBy(asc(messages.createdAt));

  if (rows.length === 0) {
    await seedMessages(email);
    rows = await db
      .select()
      .from(messages)
      .where(eq(messages.userEmail, email))
      .orderBy(asc(messages.createdAt));
  }

  return rows.map((r) => ({
    id: r.id,
    from: r.from as "guest" | "host",
    text: r.text,
    time: formatTime(r.createdAt),
  }));
}

/** Admin-only: read another guest's thread. */
export async function getGuestMessagesForAdminAction(
  guestEmail: string
): Promise<MessageRow[]> {
  const actor = await getVerifiedSessionEmail();
  if (!actor || !isAdminEmail(actor)) return [];

  const trimmed = guestEmail.trim().toLowerCase();
  const db = getDb();
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.userEmail, trimmed))
    .orderBy(asc(messages.createdAt));

  return rows.map((r) => ({
    id: r.id,
    from: r.from as "guest" | "host",
    text: r.text,
    time: formatTime(r.createdAt),
  }));
}

export async function addGuestMessageAction(
  text: string
): Promise<{ ok: true; row: MessageRow } | { ok: false }> {
  const email = await getVerifiedSessionEmail();
  if (!email) return { ok: false };

  const db = getDb();
  const [row] = await db
    .insert(messages)
    .values({ userEmail: email, from: "guest", text })
    .returning();

  return {
    ok: true,
    row: {
      id: row.id,
      from: "guest",
      text: row.text,
      time: formatTime(row.createdAt),
    },
  };
}

export async function addHostMessageForGuestAction(
  guestEmail: string,
  text: string
): Promise<{ ok: true; row: MessageRow } | { ok: false }> {
  const actor = await getVerifiedSessionEmail();
  if (!actor || !isAdminEmail(actor)) return { ok: false };

  const trimmed = guestEmail.trim().toLowerCase();
  const db = getDb();
  const [row] = await db
    .insert(messages)
    .values({ userEmail: trimmed, from: "host", text })
    .returning();

  return {
    ok: true,
    row: {
      id: row.id,
      from: "host",
      text: row.text,
      time: formatTime(row.createdAt),
    },
  };
}
