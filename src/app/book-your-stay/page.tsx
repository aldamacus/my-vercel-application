"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AirbnbCalendarClient } from "@/clients/airbnb-calendar-client";
import { BookingCalendarClient } from "@/clients/booking-calendar-client";
import { HomeAwayCalendarClient } from "@/clients/homeaway-calendar-client";

// Define Value type locally based on react-calendar's types
// Value = Date | [Date, Date] | null
type CalendarValue = Date | [Date, Date] | null;

export default function BookYourStay() {
  const [date, setDate] = useState<CalendarValue | null>(new Date());
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

  // Dummy photos
  const photos = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80"
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-8 gap-8">
      <div className="absolute left-8 top-8 flex gap-4 z-10">
        <a href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad" target="_blank" rel="noopener noreferrer" title="Airbnb">
          <Image src="/airbnb-color-svgrepo-com.svg" alt="Airbnb" width={32} height={32} className="hover:scale-110 transition-transform" />
        </a>
        <a href="https://instagram.com/central_am_brukenthal" target="_blank" rel="noopener noreferrer" title="Instagram">
          <Image src="/instagram-svgrepo-com.svg" alt="Instagram" width={32} height={32} className="hover:scale-110 transition-transform" />
        </a>
        <a href="https://www.booking.com/Share-HyJ79e" target="_blank" rel="noopener noreferrer" title="Booking.com">
          <Image src="/booking-svgrepo-com.svg" alt="Booking.com" width={32} height={32} className="hover:scale-110 transition-transform" />
        </a>
      </div>
      <h1 className="text-3xl font-bold mb-4">Central Am Bruckenthal Apartment</h1>
    <div className="flex flex-wrap gap-4 justify-center mb-8">
      {photos.map((src, i) => (
        <Image key={i} src={src} alt={`Apartment photo ${i + 1}`} width={250} height={180} className="rounded shadow-md object-cover" />
      ))}
      <Calendar
        onChange={(value) => setDate(value as Date | [Date, Date] | null)}
        value={date as Date | [Date, Date] | null}
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
    </div>
    </div>
     
  );
  
}
