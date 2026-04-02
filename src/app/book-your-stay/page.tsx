"use client";

import Image from "next/image";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ContactForm from "@/components/ui/ContactForm";
import { useMergedIcalAvailability } from "@/hooks/useMergedIcalAvailability";
import {
  parseDateInputLocal,
  validateStayRange,
} from "@/lib/stayAvailability";

//import { DayPicker } from "react-day-picker";
//import "react-day-picker/style.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import PaymentModal from "@/components/PaymentModal";
import StayCalendar from "./Calendar";

// Define Value type locally based on react-calendar's types
// Value = Date | [Date, Date] | null

function BookYourStayClient() {
  const searchParams = useSearchParams();
  const appliedFromQuery = useRef(false);

  const [date, setDate] = useState<Date | undefined>(new Date());
  const { bookedDates, loading: calendarLoading, error: calendarError, refetch } =
    useMergedIcalAvailability(60 * 1000);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // Array for user-selected dates (not Airbnb booked dates)
  const [userSelectedDates, setUserSelectedDates] = useState<Date[]>([]);

  // For shadcn Calendar, disabled is (date: Date) => boolean
  const disabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight
    // Disable if before today or already booked
    return (
      date < today ||
      bookedDates.some((bd) => bd.toDateString() === date.toDateString())
    );
  };

  // Sample photos for the apartment
  const photos = [
    "/163308118.jpg",
    "/163308121.jpg",
    "/163308125.jpg",
    "/163308128.jpg",
    "/163308132.jpg",
    "/163308137.jpg",
    "/163308141.jpg",
    "/163308144.jpg",
    "/163308150.jpg",
    "/163308158.jpg",
    "/163308174.jpg",
    "/163348383.jpg",
    "/163426986.jpg",
    "/163427127.jpg",
    "/175330372.jpg",
    "/175330474.jpg",
    "/175330495.jpg",
    "/175330585.jpg",
    "/175330634.jpg",
    "/175330673.jpg",
    "/175330725.jpg",
    "/642276000.jpg",
  ];

  // Helper to check if a date is consecutive to the current selection
  function isConsecutive(date: Date, selectedDates: Date[]): boolean {
    if (selectedDates.length === 0) return true;
    const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const prevDay = new Date(last);
    prevDay.setDate(last.getDate() + 1);
    const nextDay = new Date(first);
    nextDay.setDate(first.getDate() - 1);
    // Allow adding only to the start or end of the range
    return (
      date.toDateString() === prevDay.toDateString() ||
      date.toDateString() === nextDay.toDateString()
    );
  }

  // Update Calendar to allow only consecutive selection
  const handleDateSelect = (selected: Date) => {
    const alreadySelected = userSelectedDates.some(
      (bd) => bd.toDateString() === selected.toDateString()
    );
    if (alreadySelected) {
      // Allow deselecting only from the ends of the range
      const sorted = [...userSelectedDates].sort(
        (a, b) => a.getTime() - b.getTime()
      );
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      if (
        selected.toDateString() === first.toDateString() ||
        selected.toDateString() === last.toDateString()
      ) {
        setUserSelectedDates(
          userSelectedDates.filter(
            (bd) => bd.toDateString() !== selected.toDateString()
          )
        );
      }
      // else: ignore (cannot deselect from the middle)
    } else if (!disabled(selected)) {
      // Only allow adding if consecutive
      if (isConsecutive(selected, userSelectedDates)) {
        setUserSelectedDates([...userSelectedDates, selected]);
      }
      // else: ignore (cannot select non-consecutive)
    }
    setDate(selected);
  };

  useEffect(() => {
    if (appliedFromQuery.current || calendarLoading || calendarError) return;
    const ci = searchParams.get("checkIn");
    const co = searchParams.get("checkOut");
    if (!ci || !co) return;
    const checkIn = parseDateInputLocal(ci);
    const checkOut = parseDateInputLocal(co);
    if (!checkIn || !checkOut) return;
    const result = validateStayRange(checkIn, checkOut, bookedDates);
    if (!result.ok) return;
    setUserSelectedDates(result.nights);
    setDate(result.nights[result.nights.length - 1]);
    appliedFromQuery.current = true;
  }, [
    searchParams,
    calendarLoading,
    calendarError,
    bookedDates,
  ]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center justify-center bg-gradient-to-b from-white via-neutral-50 to-neutral-100 px-4 py-8 sm:px-6 md:px-10">
      <h1 className="mb-4 w-full text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl">
        Central am Brukenthal
      </h1>
      <div className="w-full max-w-6xl mx-auto px-10 sm:px-12 md:px-14">
        <Carousel className="w-full">
          <CarouselContent>
            {photos.map((src, index) => (
              <CarouselItem
                key={index}
                className="sm:basis-2/3 md:basis-1/2 lg:basis-1/3"
              >
                <button
                  type="button"
                  className="w-full cursor-pointer rounded-lg p-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  onClick={() => setExpandedPhoto(src)}
                  aria-label={`View apartment photo ${index + 1} larger`}
                >
                  <div className="relative w-full aspect-[4/3] max-h-[min(42vw,22rem)] overflow-hidden rounded-lg shadow-md">
                    <Image
                      src={src}
                      alt={`Apartment photo ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-200 hover:scale-105"
                      priority={index < 3}
                    />
                  </div>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      {/* Expanded photo modal */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setExpandedPhoto(null)}
        >
          <div
            className="relative w-full max-w-[min(100vw-2rem,56rem)] flex flex-col items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition"
              onClick={() => setExpandedPhoto(null)}
              aria-label="Close expanded photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full max-h-[80vh] min-h-[12rem]">
              <Image
                src={expandedPhoto}
                alt="Expanded apartment photo"
                width={1200}
                height={900}
                sizes="(max-width: 768px) 100vw, 56rem"
                className="rounded-xl shadow-2xl object-contain max-h-[80vh] w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      )}
      {/* Calendar and Booked Dates side by side in the middle */}
      <div className="w-full flex flex-col md:flex-row gap-8 items-stretch justify-center mt-8 max-w-6xl">
        <div className="md:w-1/2 w-full flex flex-col gap-6 items-center justify-center">
          <div className="flex w-full max-w-full flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
            {calendarLoading && (
              <p className="mb-2 self-start text-sm text-neutral-600">
                Loading availability…
              </p>
            )}
            {calendarError && (
              <div className="w-full mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950 flex flex-wrap items-center gap-2 justify-between">
                <span>{calendarError}</span>
                <button
                  type="button"
                  className="shrink-0 rounded-md bg-amber-800 px-2 py-1 text-xs font-semibold text-white hover:bg-amber-900"
                  onClick={() => void refetch()}
                >
                  Retry
                </button>
              </div>
            )}
            <StayCalendar
              bookedDates={bookedDates}
              userSelectedDates={userSelectedDates}
              selectedDate={date}
              isDateDisabled={disabled}
              onDayClick={handleDateSelect}
              className="w-full max-w-xl"
            />

            <button
              type="button"
              className="mt-6 w-full rounded-lg border border-neutral-900 bg-white px-6 py-3 text-lg font-semibold text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setUserSelectedDates([])}
              disabled={userSelectedDates.length === 0}
            >
              Clear selected dates
            </button>
          </div>
        </div>
        <div className="mt-6 flex min-h-[320px] w-full flex-col items-start rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 md:mt-0 md:w-1/2">
          <h2 className="mb-2 text-lg font-semibold text-neutral-900 sm:text-xl">
            Your trip
          </h2>
          <div className="mb-2 text-red-600 font-semibold text-sm">
            A minimum stay of 2 nights is required.
          </div>
          {userSelectedDates.length === 0 ? (
            <p className="text-gray-500 mb-2">
              No dates selected yet. Pick your stay!
            </p>
          ) : (
            <>
              {/* Dates from - till */}
              <div className="mb-2 text-gray-700 text-base">
                <span className="font-semibold">Dates:</span>{" "}
                {(() => {
                  const sorted = [...userSelectedDates].sort(
                    (a, b) => a.getTime() - b.getTime()
                  );
                  const from = sorted[0];
                  const till = sorted[sorted.length - 1];
                  return `${from.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} - ${till.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}`;
                })()}
              </div>
              {/* Price Details */}
              <div className="mb-2 mt-4">
                <div className="font-semibold text-base mb-1">
                  Price Details
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>€30 x {userSelectedDates.length} nights</span>
                  <span>€{userSelectedDates.length * 30}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>€{userSelectedDates.length * 30}</span>
                </div>
              </div>
            </>
          )}
          <div className="mt-4 text-xs text-gray-500">
            Booked dates are blocked for new reservations. For special requests,
            <button
              type="button"
              className="ml-1 cursor-pointer font-semibold text-neutral-900 underline underline-offset-2 hover:text-primary focus:outline-none"
              onClick={() => setShowContactForm(true)}
            >
              contact us directly
            </button>
            !
            {showContactForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className="relative w-full max-w-md animate-fade-in rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-2 focus:outline-none"
                    onClick={() => setShowContactForm(false)}
                    aria-label="Close contact form"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h3 className="mb-4 text-center text-lg font-semibold text-neutral-900">
                    Contact us
                  </h3>
                  <ContactForm
                    onClosed={() => setShowContactForm(false)}
                  />
                </div>
              </div>
            )}
          </div>
          <button
            className={`mt-6 w-full rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground shadow-md transition hover:opacity-95 ${
              userSelectedDates.length < 2
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={() =>
              userSelectedDates.length >= 2 && setShowPayment(true)
            }
            disabled={userSelectedDates.length < 2}
          >
            Pay with PayPal
          </button>
        </div>
      </div>
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={userSelectedDates.length * 30 || 0}
      />
      {/* Details and Map side by side at the bottom */}
      <div className="w-full flex flex-col md:flex-row gap-8 mt-12">
        <div className="order-1 mb-6 w-full rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm md:order-none md:mb-0 md:w-1/2">
          <ul className="list-disc space-y-2 pl-5 text-base text-neutral-600">
            <li>Spacious living room with lots of natural light</li>
            <li>Fully equipped modern kitchen</li>
            <li>Comfortable queen-size bed and cozy linens</li>
            <li>High-speed Wi-Fi and smart TV</li>
            <li>Central heating and air conditioning</li>
            <li>Quiet, safe building in the heart of Sibiu</li>
            <li>Walking distance to Bruckenthal Palace, cafes, and markets</li>
            <li>Self check-in and flexible checkout</li>
            <li>Perfect for couples, solo travelers</li>
          </ul>
        </div>
        <div className="flex justify-center w-full md:w-1/2 mt-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d695.4311219448633!2d24.1495347!3d45.7967471!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474c672b205a18c5%3A0xa2498bd88c1144d7!2sCentral%20am%20Brukenthal!5e0!3m2!1sen!2sat!4v1749071021571!5m2!1sen!2sat"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Central am Brukenthal Map"
          ></iframe>
        </div>
      </div>
      {/* Load external script asynchronously using next/script */}
      {/* The following script is now loaded globally via layout.tsx using next/script. Remove this duplicate. */}
    </div>
  );
}

export default function BookYourStayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] w-full items-center justify-center bg-gradient-to-b from-white via-neutral-50 to-neutral-100 text-neutral-600">
          Loading booking…
        </div>
      }
    >
      <BookYourStayClient />
    </Suspense>
  );
}
