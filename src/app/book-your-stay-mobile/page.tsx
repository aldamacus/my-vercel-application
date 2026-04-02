"use client";

import Image from "next/image";
import React, { useState } from "react";
import ContactForm from "@/components/ui/ContactForm";
import { useMergedIcalAvailability } from "@/hooks/useMergedIcalAvailability";
import { Calendar } from "@/components/ui/calendar";
import ReserveStayForm from "@/components/ui/ReserveStayForm";

export default function BookYourStayMobile() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { bookedDates, loading: calendarLoading, error: calendarError, refetch } =
    useMergedIcalAvailability(60 * 1000);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [userSelectedDates, setUserSelectedDates] = useState<Date[]>([]);

  const disabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (
      date < today ||
      bookedDates.some((bd) => bd.toDateString() === date.toDateString())
    );
  };

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

  function isConsecutive(date: Date, selectedDates: Date[]): boolean {
    if (selectedDates.length === 0) return true;
    const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const prevDay = new Date(last);
    prevDay.setDate(last.getDate() + 1);
    const nextDay = new Date(first);
    nextDay.setDate(first.getDate() - 1);
    return (
      date.toDateString() === prevDay.toDateString() ||
      date.toDateString() === nextDay.toDateString()
    );
  }

  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    const alreadySelected = userSelectedDates.some(
      (bd) => bd.toDateString() === selected.toDateString()
    );
    if (alreadySelected) {
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
    } else if (!disabled(selected)) {
      if (isConsecutive(selected, userSelectedDates)) {
        setUserSelectedDates([...userSelectedDates, selected]);
      }
    }
    setDate(selected);
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center bg-gradient-to-b from-white via-neutral-50 to-neutral-100 px-2 py-4">
      <h1 className="mb-2 w-full text-center text-xl font-semibold tracking-tight text-neutral-900">
        Central am Brukenthal
      </h1>
      {/* Grid of images */}
      <div className="grid grid-cols-3 gap-2 w-full mb-4">
        {photos.slice(0, 9).map((src, idx) => (
          <div
            key={idx}
            className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-200 shadow-sm"
          >
            <Image
              src={src}
              alt={`Apartment photo ${idx + 1}`}
              fill
              sizes="(max-width: 448px) 34vw, 120px"
              className="object-cover"
              priority={idx < 3}
            />
          </div>
        ))}
      </div>
      {/* Calendar */}
      <div className="mb-4 flex w-full flex-col items-center rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm">
        {calendarLoading && (
          <p className="mb-2 self-start px-1 text-xs text-neutral-600">
            Loading availability…
          </p>
        )}
        {calendarError && (
          <div className="w-full mb-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2 text-xs text-amber-950 flex flex-wrap items-center gap-2 justify-between">
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
        <Calendar
          mode="single"
          selected={date}
          onDayClick={handleDateSelect}
          disabled={disabled}
          showOutsideDays
          numberOfMonths={1}
          className="w-full max-w-xs rounded-xl border border-neutral-200 p-1 text-neutral-900 shadow-sm focus:border-neutral-400 focus:ring-2 focus:ring-primary/30"
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
              "bg-neutral-100 text-neutral-900 border-neutral-400 border-2 font-bold",
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: "#e5e7eb",
              color: "#6b7280",
              cursor: "not-allowed",
            },
            selected: {
              backgroundColor: "#bbf7d0",
              color: "#166534",
              fontWeight: "bold",
            },
            today: {
              backgroundColor: "#f5f5f5",
              color: "#171717",
              border: "2px solid #a3a3a3",
              fontWeight: "bold",
            },
          }}
          classNames={{
            head_cell:
              "text-muted-foreground rounded-md w-10 h-10 font-normal text-xs",
            day: "size-10 h-10 w-10 p-0 font-semibold text-xs aria-selected:opacity-100",
          }}
        />
        <button
          type="button"
          className="mt-4 w-full rounded-lg border border-neutral-900 bg-white px-4 py-2 text-base font-semibold text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setUserSelectedDates([])}
          disabled={userSelectedDates.length === 0}
        >
          Clear selected dates
        </button>
      </div>
      {/* Booking summary */}
      <div className="mb-4 flex min-h-[180px] w-full flex-col items-start rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
        <h2 className="mb-1 text-base font-semibold text-neutral-900">Your trip</h2>
        <div className="mb-1 text-red-600 font-semibold text-xs">
          A minimum stay of 2 nights is required.
        </div>
        {userSelectedDates.length === 0 ? (
          <p className="text-gray-500 mb-1 text-xs">No dates selected yet. Pick your stay!</p>
        ) : (
          <>
            <div className="mb-1 text-gray-700 text-xs">
              <span className="font-semibold">Dates:</span>{" "}
              {(() => {
                const sorted = [...userSelectedDates].sort((a, b) => a.getTime() - b.getTime());
                const from = sorted[0];
                const till = sorted[sorted.length - 1];
                return `${from.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} - ${till.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`;
              })()}
            </div>
            <div className="mb-1 mt-2">
              <div className="font-semibold text-xs mb-1">Price Details</div>
              <div className="flex justify-between text-xs mb-1">
                <span>€30 x {userSelectedDates.length} nights</span>
                <span>€{userSelectedDates.length * 30}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-1 mt-1">
                <span>Total</span>
                <span>€{userSelectedDates.length * 30}</span>
              </div>
            </div>
          </>
        )}
        <div className="mt-2 text-xs text-gray-500">
          Booked dates are blocked. For special requests,
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
              <div className="relative w-full max-w-xs animate-fade-in rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-2 focus:outline-none"
                  onClick={() => setShowContactForm(false)}
                  aria-label="Close contact form"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="mb-2 text-center text-base font-semibold text-neutral-900">Contact us</h3>
                <ContactForm onClosed={() => setShowContactForm(false)} />
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          className={`mt-4 w-full rounded-lg bg-primary px-4 py-2 text-base font-semibold text-primary-foreground shadow-md transition hover:opacity-95 ${userSelectedDates.length < 2 ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() =>
            userSelectedDates.length >= 2 && setShowReserveModal(true)
          }
          disabled={userSelectedDates.length < 2}
        >
          Reserve your stay
        </button>
      </div>
      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3">
          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl">
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-neutral-100 p-2 text-neutral-500 focus:outline-none"
              onClick={() => setShowReserveModal(false)}
              aria-label="Close reservation form"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="mb-3 pr-8 text-center text-base font-semibold text-neutral-900">
              Reserve your stay
            </h3>
            <ReserveStayForm
              key={userSelectedDates.map((d) => d.getTime()).join(",")}
              selectedDates={userSelectedDates}
              onClosed={() => setShowReserveModal(false)}
            />
          </div>
        </div>
      )}
      {/* Details */}
      <div className="mb-4 w-full rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
        <ul className="list-disc space-y-1 pl-4 text-xs text-neutral-600">
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
      {/* Map */}
      <div className="w-full rounded-xl overflow-hidden shadow-lg mb-4">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d695.4311219448633!2d24.1495347!3d45.7967471!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474c672b205a18c5%3A0xa2498bd88c1144d7!2sCentral%20am%20Brukenthal!5e0!3m2!1sen!2sat!4v1749071021571!5m2!1sen!2sat"
          width="100%"
          height="180"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Central am Brukenthal Map"
        ></iframe>
      </div>
    </div>
  );
}
