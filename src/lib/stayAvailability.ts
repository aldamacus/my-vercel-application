import { addDays, differenceInCalendarDays, isSameDay, startOfDay } from "date-fns";

export function normalizeDay(d: Date): Date {
  return startOfDay(d);
}

/** Parse `YYYY-MM-DD` in local timezone (avoids UTC shift from parseISO). */
export function parseDateInputLocal(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  const d = new Date(y, mo, day);
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== mo ||
    d.getDate() !== day
  ) {
    return null;
  }
  return normalizeDay(d);
}

export function toISODateLocal(d: Date): string {
  const x = normalizeDay(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type StayRangeResult =
  | { ok: true; nights: Date[] }
  | { ok: false; message: string };

/**
 * Check-in / check-out are hotel-style: nights are [checkIn, checkOut) (checkout morning is not a booked night).
 */
export function validateStayRange(
  checkIn: Date,
  checkOut: Date,
  bookedDates: Date[]
): StayRangeResult {
  const start = normalizeDay(checkIn);
  const end = normalizeDay(checkOut);
  const today = normalizeDay(new Date());

  if (end <= start) {
    return { ok: false, message: "Check-out must be after check-in." };
  }
  if (start < today) {
    return { ok: false, message: "Check-in cannot be in the past." };
  }
  if (differenceInCalendarDays(end, start) < 2) {
    return { ok: false, message: "Minimum stay is 2 nights." };
  }

  const nights: Date[] = [];
  for (let d = start; d < end; d = addDays(d, 1)) {
    if (bookedDates.some((bd) => isSameDay(normalizeDay(bd), d))) {
      return {
        ok: false,
        message:
          "No availability for those dates. Some nights are already booked. Please choose different dates.",
      };
    }
    nights.push(new Date(d));
  }

  return { ok: true, nights };
}

export type NextStayWindow = { checkIn: Date; checkOut: Date };

/**
 * Earliest check-in from `fromDate` (default today) with `minNights` consecutive
 * free nights (not in `bookedDates`). Check-out is exclusive end (hotel-style).
 */
export function findNextAvailableStay(
  bookedDates: Date[],
  options?: {
    minNights?: number;
    maxSearchDays?: number;
    fromDate?: Date;
  }
): NextStayWindow | null {
  const minNights = options?.minNights ?? 2;
  const maxSearchDays = options?.maxSearchDays ?? 500;
  const from = normalizeDay(options?.fromDate ?? new Date());

  const isBooked = (d: Date) =>
    bookedDates.some((bd) => isSameDay(normalizeDay(bd), normalizeDay(d)));

  for (let offset = 0; offset < maxSearchDays; offset++) {
    const checkIn = addDays(from, offset);
    let allFree = true;
    for (let n = 0; n < minNights; n++) {
      if (isBooked(addDays(checkIn, n))) {
        allFree = false;
        break;
      }
    }
    if (allFree) {
      return {
        checkIn,
        checkOut: addDays(checkIn, minNights),
      };
    }
  }

  return null;
}
