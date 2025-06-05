"use client";

import Image from "next/image";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import PaymentModal from "@/components/PaymentModal";

// Define Value type locally based on react-calendar's types
// Value = Date | [Date, Date] | null

export default function BookYourStay() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Only allow booking if less than 2 dates are selected
  const handleBook = () => {
    if (bookedDates.length >= 2) return; // Prevent booking more than 2 dates
    if (Array.isArray(date) && date.length === 2) {
      // Book a range
      const [start, end] = date;
      const days: Date[] = [];
      const current = new Date(start);
      while (current <= end) {
        if (
          !bookedDates.some(
            (bd) => bd.toDateString() === current.toDateString()
          )
        ) {
          days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }
      // Only add if total will not exceed 2
      if (bookedDates.length + days.length <= 2) {
        setBookedDates([...bookedDates, ...days]);
      }
    } else if (date instanceof Date) {
      const alreadySelected = bookedDates.some(
        (bd) => bd.toDateString() === date.toDateString()
      );
      if (alreadySelected) {
        // Deselect if already selected
        setBookedDates(
          bookedDates.filter((bd) => bd.toDateString() !== date.toDateString())
        );
      } else if (bookedDates.length < 2) {
        setBookedDates([...bookedDates, date]);
      }
    }
  };

  // For shadcn Calendar, disabled is (date: Date) => boolean
  const disabled = (date: Date) =>
    bookedDates.some((bd) => bd.toDateString() === date.toDateString());

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

  // Update DayPicker to allow deselecting by clicking a selected date
  // Instead of onSelect={setDate}, use a custom handler:
  const handleDateSelect = (selected: Date | undefined) => {
    if (!selected) return;
    const alreadySelected = bookedDates.some(
      (bd) => bd.toDateString() === selected.toDateString()
    );
    if (alreadySelected) {
      setBookedDates(
        bookedDates.filter((bd) => bd.toDateString() !== selected.toDateString())
      );
    } else if (bookedDates.length < 2) {
      setBookedDates([...bookedDates, selected]);
    }
    setDate(selected);
  };

  return (
    <div className="py-12 flex flex-col items-center justify-center min-h-screen px-100">
      <h1 className="text-3xl font-bold mb-4 items-start">
        Central Am Brukenthal
      </h1>
      <Carousel>
        <CarouselContent>
          {photos.map((src, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
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
          <div className="w-full max-w-full flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border-2 border-[#FF5A5F]">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              disabled={disabled}
              numberOfMonths={1}
              className="rounded-lg border-2 border-[#FF5A5F] shadow-md focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F] text-gray-900 w-full"
              modifiers={{
                booked: bookedDates,
              }}
              modifiersClassNames={{
                booked:
                  "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-400 hover:text-gray-700",
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: "#e5e7eb", // Tailwind gray-300
                  color: "#6b7280", // Tailwind gray-500
                  cursor: "not-allowed",
                },
              }}
            />
            <button
              className="mt-6 w-full px-6 py-3 bg-[#FF5A5F] text-white font-bold rounded-lg shadow-lg hover:bg-[#e14c50] transition-all text-lg tracking-wide"
              onClick={handleBook}
              disabled={bookedDates.length >= 2}
            >
              <span className="flex items-center gap-2 justify-center">
                Book Selected Dates
              </span>
            </button>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex flex-col items-start bg-white/90 rounded-2xl shadow-lg p-6 border border-gray-200 min-h-[320px] mt-6 md:mt-0">
          <h2 className="font-semibold text-lg mb-2 text-blue-800">
            Booked Dates
          </h2>
          {bookedDates.length === 0 ? (
            <p className="text-gray-500 mb-2">No bookings yet. Be the first!</p>
          ) : (
            <ul className="mb-2 space-y-1">
              {bookedDates.map((d, i) => (
                <li
                  key={i}
                  className="text-gray-700 text-sm flex items-center gap-2"
                >
                  <span className="inline-block w-2 h-2 rounded-full bg-[#FF5A5F]"></span>
                  {d.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 text-gray-700 text-sm">
            <span className="font-semibold">Total nights booked:</span>{" "}
            {bookedDates.length}
          </div>
          <div className="mt-1 text-gray-700 text-sm">
            <span className="font-semibold">Estimated total:</span> €
            {bookedDates.length * 30 || 0}{" "}
            <span className="text-xs text-gray-400">
              (dummy rate: €30/night)
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Booked dates are blocked for new reservations. For special requests,
            contact us directly!
          </div>
          <button
            className={`mt-6 w-full px-6 py-3 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition-all text-lg tracking-wide ${
              bookedDates.length !== 2 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => bookedDates.length === 2 && setShowPayment(true)}
            disabled={bookedDates.length !== 2}
          >
            Pay with PayPal
          </button>
        </div>
      </div>
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={bookedDates.length * 30 || 0}
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
    </div>
  );
}
