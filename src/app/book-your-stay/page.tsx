"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
//import { DayPicker } from "react-day-picker";
//import "react-day-picker/style.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import PaymentModal from "@/components/PaymentModal";
import { Calendar } from "@/components/ui/calendar";

// Define Value type locally based on react-calendar's types
// Value = Date | [Date, Date] | null

export default function BookYourStay() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Array for user-selected dates (not Airbnb booked dates)
  const [userSelectedDates, setUserSelectedDates] = useState<Date[]>([]);

  // Fetch Airbnb calendar and update bookedDates
  const updateBookedDatesFromAirbnb = async () => {
    try {
      const res = await fetch("/api/airbnb-calendar");
      const events = await res.json();
      const dates: Date[] = [];
      for (const event of events) {
        if (event.type === "VEVENT" && event.start && event.end) {
          // Add all dates in the range [start, end)
          const current = new Date(event.start);
          const end = new Date(event.end);
          while (current < end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        }
      }
      setBookedDates(dates);
    } catch (e) {
      // Optionally handle error
      console.error("Failed to fetch Airbnb calendar", e);
    }
  };

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
  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
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
    updateBookedDatesFromAirbnb();
    intervalRef.current = setInterval(
      updateBookedDatesFromAirbnb,
      60 * 1000 // every 1 minute
    );
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="py-8 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-10 bg-gradient-to-b from-white via-blue-50 to-blue-100 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 w-full text-center text-blue-900 drop-shadow-sm">
        Central Am Brukenthal
      </h1>
      <Carousel>
        <CarouselContent>
          {photos.map((src, index) => (
            <CarouselItem
              key={index}
              className="sm:basis-2/3 md:basis-1/2 lg:basis-1/3"
            >
              <div
                className="p-1 shadow-md rounded-lg cursor-pointer"
                onClick={() => setExpandedPhoto(src)}
              >
                <Card>
                  <CardContent className="flex aspect-square place-items-center justify-center p-1">
                    <Image
                      src={src}
                      alt={`Apartment photo ${index + 1}`}
                      width={250}
                      height={180}
                      className="rounded shadow-md object-cover hover:scale-105 transition-transform duration-200"
                      style={{
                        width: "100%",
                        height: "auto",
                        aspectRatio: "4/3",
                        objectFit: "cover",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* Expanded photo modal */}
      {expandedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setExpandedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition"
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
            <Image
              src={expandedPhoto}
              alt="Expanded apartment photo"
              width={900}
              height={700}
              className="rounded-xl shadow-2xl object-contain max-h-[80vh] w-auto h-auto"
              priority
            />
          </div>
        </div>
      )}
      {/* Calendar and Booked Dates side by side in the middle */}
      <div className="w-full flex flex-col md:flex-row gap-8 items-stretch justify-center mt-8 max-w-6xl">
        <div className="md:w-1/2 w-full flex flex-col gap-6 items-center justify-center">
          <div className="w-full max-w-full flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-blue-200">
            <Calendar
              mode="single"
              selected={date}
              onDayClick={handleDateSelect}
              disabled={disabled}
              showOutsideDays
              numberOfMonths={1}
              className="rounded-lg border-2 border-blue-400 shadow-md focus:ring-2 focus:ring-[#FF5A5F] focus:border-blue-400 text-gray-900 w-full max-w-xl p-2 sm:p-4"
              modifiers={{
                booked: bookedDates,
                selected: userSelectedDates,
                today: [new Date()],
              }}
              modifiersClassNames={{
                booked:
                  "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-400 hover:text-gray-700 line-through",
                selected: "bg-green-200 text-green-900 font-bold",
                today:
                  "bg-blue-200 text-blue-900 border-blue-700 border-2 font-bold",
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "#e5e7eb", // Tailwind gray-300
                  color: "#6b7280", // Tailwind gray-500
                  cursor: "not-allowed",
                },
                selected: {
                  backgroundColor: "#bbf7d0", // Tailwind green-200
                  color: "#166534", // Tailwind green-900
                  fontWeight: "bold",
                },
                today: {
                  backgroundColor: "#bfdbfe", // Tailwind blue-200
                  color: "#1e40af", // Tailwind blue-900
                  border: "2px solid #1d4ed8", // Tailwind blue-700
                  fontWeight: "bold",
                },
              }}
              classNames={{
                head_cell:
                  "text-muted-foreground rounded-md w-14 h-14 font-normal text-base md:text-lg",
                day: "size-14 h-14 w-14 p-0 font-semibold text-base md:text-lg aria-selected:opacity-100",
              }}
            />

            <button
              className="mt-6 w-full px-6 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transition-all text-lg tracking-wide"
              onClick={() => setUserSelectedDates([])}
              disabled={userSelectedDates.length === 0}
            >
              <span className="flex items-center bg-blue-700 gap-2 justify-center">
                Clear Selected Dates
              </span>
            </button>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-start bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 min-h-[320px] mt-6 md:mt-0">
          <h2 className="font-semibold text-lg sm:text-xl mb-2 text-blue-800">
            Your Trip
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
            <a
              href="mailto:central.brukenthal@gmail.com"
              className="text-blue-700 underline hover:text-blue-900 ml-1"
            >
              contact us directly
            </a>
            !
          </div>
          <button
            className={`mt-6 w-full px-6 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all text-lg tracking-wide ${
              userSelectedDates.length < 2
                ? "opacity-50 cursor-not-allowed"
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
        <div className="md:w-1/2 w-full bg-white/80 rounded-xl shadow-lg p-6 mb-6 md:mb-0 order-1 md:order-none">
          <ul className="list-disc pl-5 text-gray-700 text-base space-y-2">
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
