"use server";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings } from "@/db/active-schema";

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
}

export async function getBookingsAction(email: string): Promise<BookingRow[]> {
  const db = getDb();

  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userEmail, email))
    .orderBy(asc(bookings.createdAt));

  return rows.map((r) => ({
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
  }));
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
    });
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Could not save booking." };
  }
}
