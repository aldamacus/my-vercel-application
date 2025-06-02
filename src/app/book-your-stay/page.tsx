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

// Define Value type locally based on react-calendar's types
// Value = Date | [Date, Date] | null

export default function BookYourStay() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  const handleBook = () => {
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
      setBookedDates([...bookedDates, ...days]);
    } else if (date instanceof Date) {
      if (
        !bookedDates.some((bd) => bd.toDateString() === date.toDateString())
      ) {
        setBookedDates([...bookedDates, date]);
      }
    }
  };

  // For shadcn Calendar, disabled is (date: Date) => boolean
  const disabled = (date: Date) =>
    bookedDates.some((bd) => bd.toDateString() === date.toDateString());

  // Sample photos for the apartment
  const photos = [
    "/sufra.jpeg",
    "/sufra2.jpeg",
    "/bucatarie1.jpeg",
    "/bucatarie2.jpeg",
  ];

  return (
    <div className="py-12 flex flex-col items-center justify-center min-h-screen px-100">
      <h1 className="text-3xl font-bold mb-4">Central Am Brukenthal</h1>
      <Carousel>
        <CarouselContent>
          {photos.map((src, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <Image
                      src={src}
                      alt={`Apartment photo ${index + 1}`}
                      width={250}
                      height={180}
                      className="rounded shadow-md object-cover"
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
      <div className="flex flex-col md:flex-row gap-16 w-full max-w-4xl items-baseline-last justify-center mt-4">
        {/* Details about the house (left side) */}
        <div className="md:w-1/2 w-full bg-white/80 rounded-xl shadow-lg p-6 mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2 text-blue-800">
            About the Apartment
          </h2>
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
        {/* Calendar (middle) and Booked Dates (right) */}
        <div className="md:w-1/2 w-full flex flex-col md:flex-row gap-6 items-start justify-center">
          <div className="w-full md:w-2/3 flex flex-col items-center bg-white rounded-2xl shadow-lg p-6 border-2 border-[#FF5A5F]">
            <DayPicker
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={disabled}
              className="rounded-lg border-2 border-[#FF5A5F] shadow-md focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F] text-gray-900"
            />
            <button
              className="mt-6 w-full px-6 py-3 bg-[#FF5A5F] text-white font-bold rounded-lg shadow-lg hover:bg-[#e14c50] transition-all text-lg tracking-wide"
              onClick={handleBook}
            >
              <span className="flex items-center gap-2 justify-center">
                <Image
                  src="/airbnb-color-svgrepo-com.svg"
                  alt="Airbnb"
                  width={24}
                  height={24}
                />
                Book Selected Dates
              </span>
            </button>
          </div>
          {/* Booked Dates (right of calendar) */}
          <div className="w-full md:w-1/3 flex flex-col items-start bg-white/90 rounded-2xl shadow-lg p-6 border border-gray-200 min-h-[320px]">
            <h2 className="font-semibold text-lg mb-2 text-blue-800">
              Booked Dates
            </h2>
            {bookedDates.length === 0 ? (
              <p className="text-gray-500 mb-2">
                No bookings yet. Be the first!
              </p>
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
              {bookedDates.length * 55 || 0}{" "}
              <span className="text-xs text-gray-400">
                (dummy rate: €55/night)
              </span>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Booked dates are blocked for new reservations. For special
              requests, contact us directly!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
