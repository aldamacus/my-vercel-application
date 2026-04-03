"use server";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings, messages } from "@/db/active-schema";
import { isAdminEmail } from "@/lib/admin";

export interface BookingRow {
  id: string;
  status: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: string;
  apartment: string;
  location: string;
  image: string;
  entranceCode: string;
  hostNotes: string;
}

function mapBookingRow(r: typeof bookings.$inferSelect): BookingRow {
  return {
    id: r.id,
    status: r.status,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    nights: r.nights,
    guests: r.guests,
    total: r.total,
    apartment: r.apartment,
    location: r.location,
    image: r.image,
    entranceCode: r.entranceCode ?? "",
    hostNotes: r.hostNotes ?? "",
  };
}

export interface AdminBookingRow extends BookingRow {
  userEmail: string;
}

export async function getBookingsAction(email: string): Promise<BookingRow[]> {
  const db = getDb();

  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userEmail, email))
    .orderBy(asc(bookings.createdAt));

  return rows.map(mapBookingRow);
}

export async function getAllBookingsForAdminAction(
  actorEmail: string
): Promise<{ ok: boolean; bookings?: AdminBookingRow[] }> {
  if (!isAdminEmail(actorEmail)) return { ok: false };
  const db = getDb();
  const rows = await db.select().from(bookings).orderBy(asc(bookings.createdAt));
  return {
    ok: true,
    bookings: rows.map((r) => ({ ...mapBookingRow(r), userEmail: r.userEmail })),
  };
}

export async function updateBookingByAdminAction(
  actorEmail: string,
  bookingId: string,
  patch: {
    status?: string;
    total?: string;
    entranceCode?: string;
    hostNotes?: string;
  }
): Promise<{ ok: boolean; error?: string }> {
  if (!isAdminEmail(actorEmail)) return { ok: false, error: "Forbidden." };
  const db = getDb();
  const setPayload = {
    ...(patch.status !== undefined ? { status: patch.status } : {}),
    ...(patch.total !== undefined ? { total: patch.total } : {}),
    ...(patch.entranceCode !== undefined
      ? { entranceCode: patch.entranceCode }
      : {}),
    ...(patch.hostNotes !== undefined ? { hostNotes: patch.hostNotes } : {}),
  };
  if (Object.keys(setPayload).length === 0) return { ok: true };
  try {
    await db.update(bookings).set(setPayload).where(eq(bookings.id, bookingId));
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not update booking." };
  }
}

export async function listGuestEmailsForAdminAction(
  actorEmail: string
): Promise<{ ok: boolean; emails?: string[] }> {
  if (!isAdminEmail(actorEmail)) return { ok: false };
  const db = getDb();
  const fromBookings = await db
    .select({ userEmail: bookings.userEmail })
    .from(bookings)
    .groupBy(bookings.userEmail);
  const fromMessages = await db
    .select({ userEmail: messages.userEmail })
    .from(messages)
    .groupBy(messages.userEmail);
  const emails = [
    ...new Set([
      ...fromBookings.map((r) => r.userEmail),
      ...fromMessages.map((r) => r.userEmail),
    ]),
  ].sort((a, b) => a.localeCompare(b));
  return { ok: true, emails };
}

export async function createBookingAction(
  userEmail: string,
  data: {
    checkIn: string;
    checkOut: string;
    nights: number;
    total: string;
  }
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const db = getDb();
  const id = crypto.randomUUID();
  try {
    await db.insert(bookings).values({
      id,
      userEmail,
      status: "new",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights: data.nights,
      guests: 2,
      total: data.total,
      apartment: "Central am Brukenthal",
      location: "Sibiu, Romania",
      image: "/163426986.jpg",
      entranceCode: "",
      hostNotes: "",
    });
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Could not save booking." };
  }
}
