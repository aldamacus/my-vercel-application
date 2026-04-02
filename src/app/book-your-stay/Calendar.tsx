"use client";

import React, { useEffect, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StayCalendarProps = {
  /** Dates blocked by iCal (Airbnb / Booking, etc.) — non-selectable */
  bookedDates: Date[];
  /** Guest’s consecutive stay selection */
  userSelectedDates: Date[];
  /** Last focused day (drives month jump when it changes) */
  selectedDate: Date | undefined;
  /** Same logic as before: past + booked */
  isDateDisabled: (day: Date) => boolean;
  /** Called on each day click — parent adds/removes from range */
  onDayClick: (day: Date) => void;
  className?: string;
};

function normalizeDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isBooked(day: Date, bookedDates: Date[]) {
  const n = normalizeDay(day);
  return bookedDates.some((bd) => isSameDay(normalizeDay(bd), n));
}

/**
 * Single-month grid calendar for Book your stay: merged iCal busy dates,
 * consecutive multi-day select / deselect from range ends (parent-controlled).
 */
export default function StayCalendar({
  bookedDates,
  userSelectedDates,
  selectedDate,
  isDateDisabled,
  onDayClick,
  className,
}: StayCalendarProps) {
  const [current, setCurrent] = useState(() => startOfMonth(new Date()));

  useEffect(() => {
    if (!selectedDate) return;
    setCurrent((c) =>
      isSameMonth(selectedDate, c) ? c : startOfMonth(selectedDate)
    );
  }, [selectedDate]);

  const handlePrev = () => setCurrent((d) => subMonths(d, 1));
  const handleNext = () => setCurrent((d) => addMonths(d, 1));

  const generateDates = () => {
    const startMonth = startOfMonth(current);
    const endMonth = endOfMonth(current);
    const start = startOfWeek(startMonth, { weekStartsOn: 0 });
    const end = endOfWeek(endMonth, { weekStartsOn: 0 });
    const days: Date[] = [];
    let d = start;
    while (d <= end) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days;
  };

  const days = generateDates();
  const today = normalizeDay(new Date());

  return (
    <aside
      className={cn(
        "w-full rounded-xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl">
          {format(current, "MMMM yyyy")}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous month"
            className="rounded-lg p-2 text-neutral-700 transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next month"
            className="rounded-lg p-2 text-neutral-700 transition hover:bg-neutral-100"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs font-medium text-neutral-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, current);
          const disabled = !inMonth || isDateDisabled(day);
          const booked = inMonth && isBooked(day, bookedDates);
          const selected = userSelectedDates.some((sd) =>
            isSameDay(normalizeDay(sd), normalizeDay(day))
          );
          const isToday = inMonth && isSameDay(normalizeDay(day), today);

          return (
            <button
              key={day.getTime()}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) onDayClick(normalizeDay(day));
              }}
              className={cn(
                "flex h-11 w-full items-center justify-center rounded-lg text-sm font-semibold transition sm:h-12 sm:text-base",
                !inMonth && "pointer-events-none opacity-25",
                inMonth && !disabled && "hover:bg-neutral-100",
                disabled &&
                  inMonth &&
                  "cursor-not-allowed opacity-50 line-through",
                booked && inMonth && "bg-neutral-200 text-neutral-500",
                selected &&
                  inMonth &&
                  !disabled &&
                  "bg-green-200 text-green-900 ring-1 ring-green-400/50",
                isToday &&
                  !selected &&
                  inMonth &&
                  !disabled &&
                  "ring-2 ring-neutral-400 ring-offset-0"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
