"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AirbnbCalendarClient } from "@/clients/airbnb-calendar-client";
import { BookingCalendarClient } from "@/clients/booking-calendar-client";

export default function Home() {
  const [date, setDate] = useState<Date | [Date, Date] | null>(new Date());
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  // Keep a ref to avoid stale closure in interval
  const setBookedDatesRef = useRef(setBookedDates);
  setBookedDatesRef.current = setBookedDates;

  useEffect(() => {
    // Merge all booked dates from all clients
    function updateCalendar(newDates: Date[]) {
      setBookedDatesRef.current((prev) => {
        const all = [...prev, ...newDates];
        // Remove duplicates by date string
        const unique = Array.from(new Set(all.map((d) => d.toDateString()))).map((ds) => new Date(ds));
        return unique;
      });
    }
    const airbnbClient = new AirbnbCalendarClient(updateCalendar);
    const bookingClient = new BookingCalendarClient(updateCalendar);
    airbnbClient.start();
    bookingClient.start();
    return () => {
      airbnbClient.stop();
      bookingClient.stop();
    };
  }, []);

  const handleBook = () => {
    if (Array.isArray(date) && date.length === 2) {
      // Book a range
      const [start, end] = date;
      const days: Date[] = [];
      let current = new Date(start);
      while (current <= end) {
        if (!bookedDates.some((bd) => bd.toDateString() === current.toDateString())) {
          days.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }
      setBookedDates([...bookedDates, ...days]);
    } else if (date instanceof Date) {
      if (!bookedDates.some((bd) => bd.toDateString() === date.toDateString())) {
        setBookedDates([...bookedDates, date]);
      }
    }
  };

  const tileDisabled = ({ date: d }: { date: Date }) =>
    bookedDates.some((bd) => bd.toDateString() === d.toDateString());

  return (
    <div className="grid grid-rows-[60px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Header with navigation tabs */}
      <header className="row-start-1 w-full flex justify-center items-center gap-8 mb-4">
        <nav className="flex gap-8">
          <a href="/" className="text-lg font-semibold hover:underline underline-offset-4">Home</a>
          <a href="/clients" className="text-lg font-semibold hover:underline underline-offset-4">Clients</a>
          <a href="/admin" className="text-lg font-semibold hover:underline underline-offset-4">Admin</a>
        </nav>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center w-full">Central am Bruckenthal</h1>
        <p className="text-lg text-gray-700 mb-6 text-center w-full">
          Welcome to your dream apartment in the heart of Sibiu, Romania! Nestled just steps away from the historic Bruckenthal Palace, this cozy and modern space offers the perfect blend of comfort and culture. Enjoy morning coffee with a view of cobblestone streets, explore vibrant local markets, and relax in a sunlit living room after a day of adventure. Whether you're here for business or leisure, Central am Bruckenthal is your gateway to the best of Sibiu.
        </p>
        {/* Image carousel */}
        <div className="w-full overflow-x-auto flex gap-4 pb-2">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Living Room" className="rounded-lg shadow-md w-72 h-48 object-cover" />
          <img src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80" alt="Bedroom" className="rounded-lg shadow-md w-72 h-48 object-cover" />
          <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80" alt="Kitchen" className="rounded-lg shadow-md w-72 h-48 object-cover" />
          <img src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80" alt="View from Window" className="rounded-lg shadow-md w-72 h-48 object-cover" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-center w-full">Book your stay</h2>
        <Calendar
          onChange={setDate as any}
          value={date as any}
          selectRange={true}
          tileDisabled={tileDisabled}
        />
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleBook}
        >
          Book Selected Dates
        </button>
        <div className="mt-4">
          <h2 className="font-semibold">Booked Dates:</h2>
          <ul>
            {bookedDates.map((d, i) => (
              <li key={i}>{d.toDateString()}</li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
