"use server";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings } from "@/db/active-schema";

export interface BookingRow {
  id: string;
  status: "upcoming" | "completed";
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  total: string;
  apartment: string;
  location: string;
  image: string;
}

const SEED_BOOKINGS = [
  {
    status: "completed" as const,
    checkIn: "15 Dec 2024",
    checkOut: "20 Dec 2024",
    nights: 5,
    guests: 2,
    total: "€ 420",
    apartment: "Central am Brukenthal",
    location: "Sibiu, Romania",
    image: "/163426986.jpg",
  },
  {
    status: "upcoming" as const,
    checkIn: "10 Jun 2025",
    checkOut: "15 Jun 2025",
    nights: 5,
    guests: 2,
    total: "€ 450",
    apartment: "Central am Brukenthal",
    location: "Sibiu, Romania",
    image: "/163426986.jpg",
  },
];

export async function getBookingsAction(email: string): Promise<BookingRow[]> {
  const db = getDb();

  let rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userEmail, email))
    .orderBy(asc(bookings.createdAt));

  if (rows.length === 0) {
    await db.insert(bookings).values(
      SEED_BOOKINGS.map((b) => ({ ...b, id: crypto.randomUUID(), userEmail: email }))
    );
    rows = await db
      .select()
      .from(bookings)
      .where(eq(bookings.userEmail, email))
      .orderBy(asc(bookings.createdAt));
  }

  return rows.map((r) => ({
    id: r.id,
    status: r.status as "upcoming" | "completed",
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
