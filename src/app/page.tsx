"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AirbnbCalendarClient } from "@/clients/airbnb-calendar-client";
import { BookingCalendarClient } from "@/clients/booking-calendar-client";
import { HomeAwayCalendarClient } from "@/clients/homeaway-calendar-client";


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
    const homeAwayClient = new HomeAwayCalendarClient(updateCalendar);
    airbnbClient.start();
    bookingClient.start();
    homeAwayClient.start();
    return () => {
      airbnbClient.stop();
      bookingClient.stop();
      homeAwayClient.stop();
    };
  }, []);

  const handleBook = () => {
    if (Array.isArray(date) && date.length === 2) {
      // Book a range
      const [start, end] = date;
      const days: Date[] = [];
      const current = new Date(start);
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
    <div
      className="grid grid-rows-[60px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1590631196293-61172b43d06d?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header with navigation tabs */}
      <header className="row-start-1 w-full flex justify-start items-center gap-8 mb-4">
        <nav className="flex gap-8">
          <a href="/" className="text-lg font-semibold hover:underline underline-offset-4">Home</a>
          <a href="/book-your-stay" className="text-lg font-semibold hover:underline underline-offset-4">Book Your Stay</a>
        </nav>
      </header>      
      <main className="flex flex-col gap-[32px] row-start-2 items-start w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-left w-full">Welcome!</h1>
        <h2 className="text-2xl font-semibold mb-2 text-left w-full">A Home in the Heart of the City</h2>
        <div className="w-full flex flex-col sm:flex-row gap-5 items-start">
          {/* Description on the far left */}
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-start">
            <p className="text-lg text-gray-700 mb-6 text-left max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              Welcome to your dream apartment in the heart of Sibiu, Romania! Nestled just steps away from the historic Bruckenthal Palace, this cozy and modern space offers the perfect blend of comfort and culture. Enjoy morning coffee with a view of cobblestone streets, explore vibrant local markets, and relax in a sunlit living room after a day of adventure. Whether you're here for business or leisure, Central am Bruckenthal is your gateway to the best of Sibiu.<br/><br/>
              <span className="font-semibold">Sibiu</span> is a city where history meets vibrancy. Known for its colorful squares, medieval walls, and lively festivals, Sibiu is the proud home of the famous Christmas Market and a UNESCO World Heritage site. Discover the charm of Transylvania right outside your door!<br/><br/>
              <span className="font-semibold">Stay in a beautiful apartment in Sibiu, close to many cafes and restaurants. Enjoy the city's architecture and history!</span>
            </p>
          </div>
          {/* Image carousel to the right */}
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
