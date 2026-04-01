import { log } from "console";
import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import ical from "node-ical";

const REVALIDATE_SECONDS = 300;

const MISSING_ENV = "MISSING_ICAL_ENV";

const getMergedCalendarEvents = unstable_cache(
  async () => {
    const airbnbUrl = process.env.AIRBNB_ICAL_URL?.trim();
    const bookingUrl = process.env.BOOKING_ICAL_URL?.trim();
    if (!airbnbUrl || !bookingUrl) {
      throw new Error(MISSING_ENV);
    }

    const airbnbData = await ical.async.fromURL(airbnbUrl);
    const airbnbEvents = Object.values(airbnbData).filter(
      (event) => event.type === "VEVENT"
    );

    const bookingData = await ical.async.fromURL(bookingUrl);
    const bookingEvents = Object.values(bookingData).filter(
      (event) => event.type === "VEVENT"
    );

    return [...airbnbEvents, ...bookingEvents];
  },
  ["merged-ical-events"],
  { revalidate: REVALIDATE_SECONDS }
);

export async function GET() {
  try {
    const allEvents = await getMergedCalendarEvents();
    return NextResponse.json(allEvents);
  } catch (e) {
    if (e instanceof Error && e.message === MISSING_ENV) {
      return NextResponse.json(
        { error: "Calendar not configured" },
        { status: 503 }
      );
    }
    log("Error fetching calendars:", e);
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message: string }).message
        : String(e);
    return NextResponse.json(
      { error: "Failed to fetch calendars " + errorMessage },
      { status: 500 }
    );
  }
}
