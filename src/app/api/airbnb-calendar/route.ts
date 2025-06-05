import { log } from "console";
import { NextResponse } from "next/server";
import ical from "node-ical";

const AIRBNB_ICAL_URL =
  "https://www.airbnb.com/calendar/ical/29024999.ics?s=7b9c64be18f0beb76df8dd1ba6711ba6";

const BOOKING_ICAL_URL =
  "https://admin.booking.com/hotel/hoteladmin/ical.html?t=144ce200-d791-432e-8b20-ea3acdd0edb7";

export async function GET() {
  try {
    // Fetch Airbnb events
    const airbnbData = await ical.async.fromURL(AIRBNB_ICAL_URL);
    const airbnbEvents = Object.values(airbnbData).filter(
      (event) => event.type === "VEVENT"
    );

    // Fetch Booking.com events
    const bookingData = await ical.async.fromURL(BOOKING_ICAL_URL);
    const bookingEvents = Object.values(bookingData).filter(
      (event) => event.type === "VEVENT"
    );

    // Merge all booked events
    const allEvents = [...airbnbEvents, ...bookingEvents];
    return NextResponse.json(allEvents);
  } catch (e) {
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
