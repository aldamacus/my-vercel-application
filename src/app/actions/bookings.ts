"use server";

import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { bookings, messages } from "@/db/active-schema";
import { isAdminEmail } from "@/lib/admin";
import { getVerifiedSessionEmail } from "@/lib/session";
import {
  coerceBookingStatus,
  canGuestCancelBooking,
  canGuestEditPaymentReference,
  canGuestRequestCancellation,
  type BookingStatus,
} from "@/lib/booking-workflow";
import {
  notifyAdminOfGuestStatusChange,
  notifyAdminOfPaymentReferenceUpdated,
  notifyGuestOfAdminStatusChange,
} from "@/lib/booking-notifications";

type BookingRecord = typeof bookings.$inferSelect;

export interface BookingRow {
  id: string;
  status: BookingStatus;
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
  paymentReference: string;
}

export interface AdminBookingRow extends BookingRow {
  userEmail: string;
  adminInternalComment: string;
}

type BookingResult<T> = {
  ok: boolean;
  error?: string;
  booking?: T;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
function mapBookingRow(r: BookingRecord): BookingRow {
  return {
    id: r.id,
    status: coerceBookingStatus(r.status),
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
    paymentReference: r.paymentReference ?? "",
  };
}

function mapAdminBookingRow(r: BookingRecord): AdminBookingRow {
  return {
    ...mapBookingRow(r),
    userEmail: r.userEmail,
    adminInternalComment: r.adminInternalComment ?? "",
  };
}

function buildBookingSummary(r: BookingRecord) {
  return {
    bookingId: r.id,
    guestEmail: r.userEmail,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    total: r.total,
  };
}

async function getBookingById(bookingId: string): Promise<BookingRecord | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  return row ?? null;
}

async function changeStatusAsAdmin(
  actorEmail: string,
  bookingId: string,
  nextStatus: BookingStatus,
  options: {
    allowedFrom: BookingStatus[];
    errorMessage: string;
    validate?: (booking: BookingRecord) => string | null;
  }
): Promise<BookingResult<AdminBookingRow>> {
  if (!isAdminEmail(actorEmail)) {
    return { ok: false, error: "Forbidden." };
  }

  const existing = await getBookingById(bookingId);
  if (!existing) return { ok: false, error: "Booking not found." };

  const currentStatus = coerceBookingStatus(existing.status);
  if (!options.allowedFrom.includes(currentStatus)) {
    return { ok: false, error: options.errorMessage };
  }

  const validationError = options.validate?.(existing) ?? null;
  if (validationError) return { ok: false, error: validationError };

  const db = getDb();
  try {
    await db
      .update(bookings)
      .set({
        status: nextStatus,
        statusUpdatedAt: sql`now()`,
      })
      .where(eq(bookings.id, bookingId));

    const updated: BookingRecord = {
      ...existing,
      status: nextStatus,
    };

    await notifyGuestOfAdminStatusChange({
      booking: buildBookingSummary(updated),
      fromStatus: currentStatus,
      toStatus: nextStatus,
      actorEmail: normalizeEmail(actorEmail),
    });

    return { ok: true, booking: mapAdminBookingRow(updated) };
  } catch {
    return { ok: false, error: "Could not update booking status." };
  }
}

async function changeStatusAsGuest(
  actorEmail: string,
  bookingId: string,
  nextStatus: BookingStatus,
  options: {
    allowedFrom: BookingStatus[];
    errorMessage: string;
  }
): Promise<BookingResult<BookingRow>> {
  const normalizedActor = normalizeEmail(actorEmail);
  const existing = await getBookingById(bookingId);
  if (!existing) return { ok: false, error: "Booking not found." };
  if (normalizeEmail(existing.userEmail) !== normalizedActor) {
    return { ok: false, error: "Forbidden." };
  }

  const currentStatus = coerceBookingStatus(existing.status);
  if (!options.allowedFrom.includes(currentStatus)) {
    return { ok: false, error: options.errorMessage };
  }

  const db = getDb();
  try {
    await db
      .update(bookings)
      .set({
        status: nextStatus,
        statusUpdatedAt: sql`now()`,
      })
      .where(eq(bookings.id, bookingId));

    const updated: BookingRecord = {
      ...existing,
      status: nextStatus,
    };

    await notifyAdminOfGuestStatusChange({
      booking: buildBookingSummary(updated),
      fromStatus: currentStatus,
      toStatus: nextStatus,
      actorEmail: normalizedActor,
    });

    return { ok: true, booking: mapBookingRow(updated) };
  } catch {
    return { ok: false, error: "Could not update booking status." };
  }
}

export async function getBookingsAction(): Promise<BookingRow[]> {
  const email = await getVerifiedSessionEmail();
  if (!email) return [];

  const db = getDb();
  const rows = await db
    .select()
    .from(bookings)
    .where(eq(bookings.userEmail, normalizeEmail(email)))
    .orderBy(asc(bookings.createdAt));

  return rows.map(mapBookingRow);
}

export async function getAllBookingsForAdminAction(): Promise<{
  ok: boolean;
  bookings?: AdminBookingRow[];
}> {
  const actor = await getVerifiedSessionEmail();
  if (!actor || !isAdminEmail(actor)) return { ok: false };

  const db = getDb();
  const rows = await db.select().from(bookings).orderBy(asc(bookings.createdAt));
  return {
    ok: true,
    bookings: rows.map(mapAdminBookingRow),
  };
}

export async function updateBookingAdminDetailsAction(
  bookingId: string,
  patch: {
    total?: string;
    entranceCode?: string;
    hostNotes?: string;
    adminInternalComment?: string;
  }
): Promise<BookingResult<AdminBookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor || !isAdminEmail(actor)) {
    return { ok: false, error: "Forbidden." };
  }

  const existing = await getBookingById(bookingId);
  if (!existing) return { ok: false, error: "Booking not found." };

  const setPayload = {
    ...(patch.total !== undefined ? { total: patch.total } : {}),
    ...(patch.entranceCode !== undefined
      ? { entranceCode: patch.entranceCode }
      : {}),
    ...(patch.hostNotes !== undefined ? { hostNotes: patch.hostNotes } : {}),
    ...(patch.adminInternalComment !== undefined
      ? { adminInternalComment: patch.adminInternalComment }
      : {}),
  };

  if (Object.keys(setPayload).length === 0) {
    return { ok: true, booking: mapAdminBookingRow(existing) };
  }

  const db = getDb();
  try {
    await db.update(bookings).set(setPayload).where(eq(bookings.id, bookingId));
    const updated: BookingRecord = { ...existing, ...setPayload };
    return { ok: true, booking: mapAdminBookingRow(updated) };
  } catch {
    return { ok: false, error: "Could not update booking." };
  }
}

export async function markBookingPendingByAdminAction(
  bookingId: string
): Promise<BookingResult<AdminBookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };
  return changeStatusAsAdmin(actor, bookingId, "pending", {
    allowedFrom: ["new"],
    errorMessage: "Only new bookings can be marked as pending.",
  });
}

export async function rejectBookingByAdminAction(
  bookingId: string
): Promise<BookingResult<AdminBookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };
  return changeStatusAsAdmin(actor, bookingId, "rejected", {
    allowedFrom: ["new"],
    errorMessage: "Only new bookings can be rejected.",
  });
}

export async function confirmBookingPaymentByAdminAction(
  bookingId: string
): Promise<BookingResult<AdminBookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };
  return changeStatusAsAdmin(actor, bookingId, "upcoming", {
    allowedFrom: ["pending"],
    errorMessage: "Only pending bookings can be marked as upcoming.",
    validate: (booking) =>
      booking.paymentReference.trim()
        ? null
        : "A guest payment reference is required before confirming upcoming.",
  });
}

export async function resolveCancellationRequestByAdminAction(
  bookingId: string,
  resolution: "cancelled" | "upcoming"
): Promise<BookingResult<AdminBookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };
  return changeStatusAsAdmin(actor, bookingId, resolution, {
    allowedFrom: ["cancellation_requested"],
    errorMessage:
      "Only bookings with a cancellation request can be resolved from here.",
  });
}

export async function completeBookingByAdminAction(
  bookingId: string
): Promise<BookingResult<AdminBookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };
  return changeStatusAsAdmin(actor, bookingId, "completed", {
    allowedFrom: ["upcoming"],
    errorMessage: "Only upcoming bookings can be marked as completed.",
  });
}

export async function cancelBookingByGuestAction(
  bookingId: string
): Promise<BookingResult<BookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };

  const existing = await getBookingById(bookingId);
  if (!existing) return { ok: false, error: "Booking not found." };

  const currentStatus = coerceBookingStatus(existing.status);
  if (!canGuestCancelBooking(currentStatus)) {
    return {
      ok: false,
      error: "Only new or pending bookings can be cancelled.",
    };
  }

  return changeStatusAsGuest(actor, bookingId, "cancelled", {
    allowedFrom: ["new", "pending"],
    errorMessage: "Only new or pending bookings can be cancelled.",
  });
}

export async function requestBookingCancellationByGuestAction(
  bookingId: string
): Promise<BookingResult<BookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };

  const existing = await getBookingById(bookingId);
  if (!existing) return { ok: false, error: "Booking not found." };

  const currentStatus = coerceBookingStatus(existing.status);
  if (!canGuestRequestCancellation(currentStatus)) {
    return {
      ok: false,
      error: "Only upcoming bookings can request cancellation.",
    };
  }

  return changeStatusAsGuest(actor, bookingId, "cancellation_requested", {
    allowedFrom: ["upcoming"],
    errorMessage: "Only upcoming bookings can request cancellation.",
  });
}

export async function updatePaymentReferenceByGuestAction(
  bookingId: string,
  paymentReference: string
): Promise<BookingResult<BookingRow>> {
  const actor = await getVerifiedSessionEmail();
  if (!actor) return { ok: false, error: "Forbidden." };

  const normalizedActor = normalizeEmail(actor);
  const existing = await getBookingById(bookingId);
  if (!existing) return { ok: false, error: "Booking not found." };
  if (normalizeEmail(existing.userEmail) !== normalizedActor) {
    return { ok: false, error: "Forbidden." };
  }

  const currentStatus = coerceBookingStatus(existing.status);
  if (!canGuestEditPaymentReference(currentStatus)) {
    return {
      ok: false,
      error: "Payment reference can only be updated while the booking is pending.",
    };
  }

  const trimmedReference = paymentReference.trim();
  if (!trimmedReference) {
    return { ok: false, error: "Please enter a payment reference." };
  }

  const db = getDb();
  try {
    await db
      .update(bookings)
      .set({ paymentReference: trimmedReference })
      .where(eq(bookings.id, bookingId));

    const updated: BookingRecord = {
      ...existing,
      paymentReference: trimmedReference,
    };

    await notifyAdminOfPaymentReferenceUpdated({
      booking: buildBookingSummary(updated),
      actorEmail: normalizedActor,
      paymentReference: trimmedReference,
    });

    return { ok: true, booking: mapBookingRow(updated) };
  } catch {
    return { ok: false, error: "Could not update payment reference." };
  }
}

export async function listGuestEmailsForAdminAction(): Promise<{
  ok: boolean;
  emails?: string[];
}> {
  const actor = await getVerifiedSessionEmail();
  if (!actor || !isAdminEmail(actor)) return { ok: false };

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

export async function createBookingAction(data: {
  checkIn: string;
  checkOut: string;
  nights: number;
  total: string;
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const userEmail = await getVerifiedSessionEmail();
  if (!userEmail) {
    return { ok: false, error: "You must be signed in to save a booking." };
  }

  const db = getDb();
  const id = crypto.randomUUID();
  try {
    await db.insert(bookings).values({
      id,
      userEmail: normalizeEmail(userEmail),
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
      adminInternalComment: "",
      paymentReference: "",
    });
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Could not save booking." };
  }
}
