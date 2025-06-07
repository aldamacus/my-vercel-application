"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/ui/ContactForm";
import { Calendar } from "@/components/ui/calendar";
import PaymentModal from "@/components/PaymentModal";

export default function BookYourStayMobile() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [userSelectedDates, setUserSelectedDates] = useState<Date[]>([]);

  // Fetch Airbnb calendar and update bookedDates
  const updateBookedDatesFromAirbnb = async () => {
    try {
      const res = await fetch("/api/airbnb-calendar");
      const events = await res.json();
      const dates: Date[] = [];
      for (const event of events) {
        if (event.type === "VEVENT" && event.start && event.end) {
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
      console.error("Failed to fetch Airbnb calendar", e);
    }
  };

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

  useEffect(() => {
    updateBookedDatesFromAirbnb();
    intervalRef.current = setInterval(
      updateBookedDatesFromAirbnb,
      60 * 1000
    );
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="py-4 flex flex-col items-center min-h-screen px-2 bg-gradient-to-b from-white via-blue-50 to-blue-100 w-full max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2 w-full text-center text-blue-900 drop-shadow-sm">
        Central Am Brukenthal
      </h1>
      {/* Grid of images */}
      <div className="grid grid-cols-3 gap-2 w-full mb-4">
        {photos.slice(0, 9).map((src, idx) => (
          <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-blue-100 shadow-sm">
            <Image
              src={src}
              alt={`Apartment photo ${idx + 1}`}
              width={120}
              height={120}
              className="object-cover w-full h-full"
              style={{ aspectRatio: "1/1" }}
              priority={idx < 3}
            />
          </div>
        ))}
      </div>
      {/* Calendar */}
      <div className="w-full flex flex-col items-center bg-white rounded-2xl shadow-lg p-2 border-2 border-blue-200 mb-4">
        <Calendar
          mode="single"
          selected={date}
          onDayClick={handleDateSelect}
          disabled={disabled}
          showOutsideDays
          numberOfMonths={1}
          className="rounded-lg border-2 border-blue-400 shadow-md focus:ring-2 focus:ring-[#FF5A5F] focus:border-blue-400 text-gray-900 w-full max-w-xs p-1"
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
              backgroundColor: "#bfdbfe",
              color: "#1e40af",
              border: "2px solid #1d4ed8",
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
          className="mt-4 w-full px-4 py-2 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-2xl transition-all text-base tracking-wide"
          onClick={() => setUserSelectedDates([])}
          disabled={userSelectedDates.length === 0}
        >
          Clear Selected Dates
        </button>
      </div>
      {/* Booking summary */}
      <div className="w-full flex flex-col items-start bg-white/90 rounded-2xl shadow-lg p-3 border border-gray-200 min-h-[180px] mb-4">
        <h2 className="font-semibold text-base mb-1 text-blue-800">Your Trip</h2>
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
            className="text-blue-700 underline hover:text-blue-900 ml-1 font-semibold focus:outline-none cursor-pointer"
            onClick={() => setShowContactForm(true)}
          >
            contact us directly
          </button>
          !
          {showContactForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs relative animate-fade-in">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-2 focus:outline-none"
                  onClick={() => setShowContactForm(false)}
                  aria-label="Close contact form"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-base font-bold text-blue-900 mb-2 text-center">Contact Us</h3>
                <ContactForm onSuccess={() => { setShowContactForm(false); setShowSuccess(true); }} />
              </div>
            </div>
          )}
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-xs relative animate-fade-in flex flex-col items-center">
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-full p-2 focus:outline-none"
                  onClick={() => setShowSuccess(false)}
                  aria-label="Close success message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <svg className="w-10 h-10 text-green-500 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <div className="text-base font-semibold text-green-700 text-center mb-1">Message sent successfully!</div>
                <div className="text-xs text-gray-600 text-center">Thank you for reaching out. We will get back to you soon.</div>
              </div>
            </div>
          )}
        </div>
        <button
          className={`mt-4 w-full px-4 py-2 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all text-base tracking-wide ${userSelectedDates.length < 2 ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => userSelectedDates.length >= 2 && setShowPayment(true)}
          disabled={userSelectedDates.length < 2}
        >
          Pay with PayPal
        </button>
      </div>
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={userSelectedDates.length * 30 || 0}
      />
      {/* Details */}
      <div className="w-full bg-white/80 rounded-xl shadow-lg p-3 mb-4">
        <ul className="list-disc pl-4 text-gray-700 text-xs space-y-1">
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
