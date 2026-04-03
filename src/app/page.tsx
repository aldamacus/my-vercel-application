"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SignIn from "@/components/SignIn";
import { addDays } from "date-fns";
import { useState, useEffect, useMemo, useRef } from "react";
import { useMergedIcalAvailability } from "@/hooks/useMergedIcalAvailability";
import {
  findNextAvailableStay,
  parseDateInputLocal,
  toISODateLocal,
  validateStayRange,
} from "@/lib/stayAvailability";

const GALLERY_MAIN = "/163426986.jpg";
const GALLERY_TILES = [
  "/163308132.jpg",
  "/175330372.jpg",
  "/175330474.jpg",
  "/175330495.jpg",
] as const;

export default function Home() {
  const router = useRouter();
  const { bookedDates, loading: calendarLoading, error: calendarError } =
    useMergedIcalAvailability(null);

  const [expanded, setExpanded] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [checkInStr, setCheckInStr] = useState("");
  const [checkOutStr, setCheckOutStr] = useState("");
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null
  );
  const datesPrefilledRef = useRef(false);

  const todayStr = useMemo(() => toISODateLocal(new Date()), []);
  const minCheckOutStr = useMemo(() => {
    const ci = parseDateInputLocal(checkInStr);
    const base = ci ?? parseDateInputLocal(todayStr)!;
    return toISODateLocal(addDays(base, 2));
  }, [checkInStr, todayStr]);

  useEffect(() => {
    if (!checkOutStr) return;
    const co = parseDateInputLocal(checkOutStr);
    const minCo = parseDateInputLocal(minCheckOutStr);
    if (co && minCo && co < minCo) setCheckOutStr("");
  }, [checkInStr, minCheckOutStr, checkOutStr]);

  useEffect(() => {
    if (calendarLoading || calendarError || datesPrefilledRef.current) return;
    datesPrefilledRef.current = true;
    const next = findNextAvailableStay(bookedDates, { minNights: 2 });
    if (next) {
      setCheckInStr(toISODateLocal(next.checkIn));
      setCheckOutStr(toISODateLocal(next.checkOut));
    }
  }, [calendarLoading, calendarError, bookedDates]);

  useEffect(() => {
    if (!expandedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedPhoto]);

  function handleCheckAvailability(e: React.FormEvent) {
    e.preventDefault();
    setAvailabilityError(null);

    const checkIn = parseDateInputLocal(checkInStr);
    const checkOut = parseDateInputLocal(checkOutStr);

    if (!checkInStr || !checkOutStr) {
      setAvailabilityError("Please choose both check-in and check-out dates.");
      return;
    }
    if (!checkIn || !checkOut) {
      setAvailabilityError("Please use valid dates.");
      return;
    }
    if (calendarLoading) {
      setAvailabilityError(
        "Still loading availability. Please wait a moment and try again."
      );
      return;
    }
    if (calendarError) {
      setAvailabilityError(
        "Could not load the calendar. Please try again in a moment or open Book your stay to pick dates."
      );
      return;
    }

    const result = validateStayRange(checkIn, checkOut, bookedDates);
    if (!result.ok) {
      setAvailabilityError(result.message);
      return;
    }

    const q = new URLSearchParams({
      checkIn: checkInStr,
      checkOut: checkOutStr,
    });
    router.push(`/book-your-stay?${q.toString()}`);
  }

  return (
    <main className="bg-white pb-16 pt-2">
      <section className="mx-auto w-full max-w-6xl px-4 py-6 md:py-8">
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-1 md:h-[min(52vh,28rem)] md:flex-row md:gap-1 lg:h-[min(56vh,30rem)]">
            <button
              type="button"
              className="group relative aspect-[4/3] w-full min-h-[200px] overflow-hidden bg-neutral-100 md:aspect-auto md:min-h-0 md:flex-[1.15] md:min-w-0"
              onClick={() => setExpandedPhoto(GALLERY_MAIN)}
              aria-label="Open main listing photo larger"
            >
              <Image
                src={GALLERY_MAIN}
                alt="Central am Brukenthal — main view"
                fill
                className="object-cover transition duration-300 group-hover:brightness-[0.97]"
                sizes="(max-width: 768px) 100vw, 58vw"
                priority
              />
            </button>
            <div className="grid min-h-[200px] flex-1 grid-cols-2 grid-rows-2 gap-1 md:min-h-0 md:min-w-0">
              {GALLERY_TILES.map((src, index) => {
                const isLast = index === GALLERY_TILES.length - 1;
                if (isLast) {
                  return (
                    <Link
                      key={src}
                      href="/book-your-stay"
                      className="group relative min-h-[100px] overflow-hidden bg-neutral-100 md:min-h-0"
                      aria-label="View all apartment photos and book"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover transition duration-300 group-hover:brightness-90"
                        sizes="(max-width: 768px) 50vw, 22vw"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/35 transition group-hover:bg-black/45">
                        <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-neutral-900 shadow-sm md:text-sm">
                          Show all photos
                        </span>
                      </span>
                    </Link>
                  );
                }
                return (
                  <button
                    key={src}
                    type="button"
                    className="group relative min-h-[100px] overflow-hidden bg-neutral-100 md:min-h-0"
                    onClick={() => setExpandedPhoto(src)}
                    aria-label={`Open photo ${index + 2} larger`}
                  >
                    <Image
                      src={src}
                      alt={`Apartment photo ${index + 2}`}
                      fill
                      className="object-cover transition duration-300 group-hover:brightness-[0.97]"
                      sizes="(max-width: 768px) 50vw, 22vw"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 border-b border-neutral-200 pb-8">
          <h1 className="text-[1.65rem] font-semibold leading-tight tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
            Central am Brukenthal
          </h1>
          <p className="mt-2 text-lg text-neutral-600 md:text-xl">
            Beautifully historic apartment in downtown Sibiu
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-600 md:text-base">
            <span>Up to 2 guests</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <span>1 bedroom</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <span>1 bed</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <span>1 bath</span>
            <span className="text-neutral-300" aria-hidden>
              ·
            </span>
            <span>Entire rental</span>
          </div>
          <p className="mt-3 max-w-2xl text-sm text-neutral-600 md:text-base">
            Samuel von Brukenthal, No. 1, Ap 6, Sibiu Old Town, Sibiu, Romania
          </p>
          <a
            href="https://maps.app.goo.gl/n9sN3Bf35QJsCd2Y9"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-neutral-900 underline underline-offset-2 hover:text-brand"
          >
            Show on map
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_min(360px,100%)] lg:gap-14">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-neutral-900 md:text-2xl">
              A home in the heart of the city
            </h2>
            <div className="relative mt-4">
              <p
                className={`text-base leading-relaxed text-neutral-600 transition-all duration-300 md:text-lg ${
                  expanded ? "" : "max-h-[10rem] overflow-hidden"
                }`}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: expanded ? undefined : 6,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                Welcome to Central am Brukenthal, your cozy haven set in the
                enchanting heart of Sibiu&apos;s Old Town. Here, you&apos;ll find
                an inviting atmosphere that feels just like home. As the summer
                heat envelops the city, our apartment remains a refreshing
                retreat, maintaining a perfect temperature that ensures a
                comfortable night&apos;s sleep, even on the warmest of evenings.
                <br />
                <br />
                Imagine unwinding on your private terrace, sipping a cool drink
                while soaking in the lively ambiance of the bustling streets
                below. With fast and free WiFi, you can easily share your
                delightful experiences with friends and family or catch up on
                your favorite shows on the flat-screen TV after a day of
                exploration.
                <br />
                <br />
                Our beautifully renovated space boasts a warm and cozy bedroom
                that invites rest, alongside a modern bathroom stocked with
                complimentary toiletries and a hairdryer. The fully equipped
                kitchen is perfect for whipping up a casual meal to enjoy at your
                own pace.
              </p>
              {!expanded && (
                <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-white to-transparent" />
              )}
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-neutral-900 underline underline-offset-2 hover:text-brand"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            </div>

            <h3 className="mt-12 text-xl font-semibold text-neutral-900 md:text-2xl">
              About this property
            </h3>
            <div className="mt-4 space-y-4 text-base text-neutral-600 md:text-lg">
              <p>
                Reliable info: Guests say the description and photos for this
                property are very accurate.
              </p>
              <div>
                <h4 className="text-base font-semibold text-neutral-900">
                  Comfortable living space
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>
                    Central am Brukenthal in Sibiu offers a one-bedroom
                    apartment with a terrace and free WiFi. The ground-floor unit
                    features a kitchenette, dining area, and a sofa bed.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-neutral-900">
                  Modern amenities
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>
                    Guests enjoy a fully equipped kitchen with a refrigerator,
                    stovetop, microwave, and coffee machine. Additional amenities
                    include a terrace, patio, outdoor furniture, and a dining
                    table.
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-base font-semibold text-neutral-900">
                  Convenient location
                </h4>
                <ul className="mt-2 list-disc space-y-1 pl-6">
                  <li>
                    Located in the heart of Sibiu&apos;s Old Town, the apartment
                    is within walking distance of major attractions like Piata
                    Mare and the Brukenthal Palace.
                  </li>
                  <li>
                    Located 2.5 mi from Sibiu International Airport, the apartment
                    is near attractions such as The Stairs Passage (a few steps),
                    The Council Tower of Sibiu (3-minute walk), and Piata Mare
                    Sibiu (656 feet). Highly rated for its central location and
                    room cleanliness.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="lg:pt-2">
            <div className="sticky top-24 rounded-xl border border-neutral-200 bg-white p-6 shadow-md lg:top-28">
              <p className="text-base font-semibold text-neutral-900">
                Ask for an offer
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Send us your dates and we&apos;ll get back to you with a personalised offer.
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Next available dates are:
              </p>
              <form
                onSubmit={handleCheckAvailability}
                className="mt-4 space-y-3"
              >
                <div>
                  <label
                    htmlFor="home-check-in"
                    className="text-sm font-medium text-neutral-800"
                  >
                    Check-in
                  </label>
                  <input
                    id="home-check-in"
                    type="date"
                    value={checkInStr}
                    min={todayStr}
                    onChange={(e) => {
                      setCheckInStr(e.target.value);
                      setAvailabilityError(null);
                    }}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="home-check-out"
                    className="text-sm font-medium text-neutral-800"
                  >
                    Check-out
                  </label>
                  <input
                    id="home-check-out"
                    type="date"
                    value={checkOutStr}
                    min={minCheckOutStr}
                    onChange={(e) => {
                      setCheckOutStr(e.target.value);
                      setAvailabilityError(null);
                    }}
                    className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/25"
                    required
                  />
                </div>
                {availabilityError && (
                  <p
                    className="text-sm text-red-600"
                    role="alert"
                  >
                    {availabilityError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={calendarLoading}
                  className="flex w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-center text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {calendarLoading ? "Loading calendar…" : "Check availability"}
                </button>
              </form>
              <p className="mt-4 text-center text-xs text-neutral-500">
                No payment required — we&apos;ll reply with your personalised offer.
              </p>
            </div>
          </aside>
        </div>

        {expandedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setExpandedPhoto(null)}
          >
            <div
              className="relative w-full max-w-[min(100vw-2rem,56rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-1 right-0 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-neutral-100 md:right-2"
                onClick={() => setExpandedPhoto(null)}
                aria-label="Close expanded photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-neutral-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Image
                src={expandedPhoto}
                alt="Expanded apartment photo"
                width={1200}
                height={900}
                sizes="(max-width: 768px) 100vw, 56rem"
                className="max-h-[80vh] w-full rounded-2xl object-contain"
                priority
              />
            </div>
          </div>
        )}
      </section>

      {/* Sign-in — full-viewport centred section */}
      <section
        id="sign-in"
        className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-neutral-50 px-4 py-16"
      >
        <div className="text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Your account</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in or create an account to manage your bookings.
          </p>
        </div>
        <SignIn />
      </section>
    </main>
  );
}
