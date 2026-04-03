"use server";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { messages } from "@/db/active-schema";

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

export async function getMessagesAction(email: string): Promise<MessageRow[]> {
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

export async function addMessageAction(
  email: string,
  text: string,
  from: "guest" | "host"
): Promise<MessageRow> {
  const db = getDb();
  const [row] = await db
    .insert(messages)
    .values({ userEmail: email, from, text })
    .returning();

  return {
    id: row.id,
    from: row.from as "guest" | "host",
    text: row.text,
    time: formatTime(row.createdAt),
  };
}
