"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_POLL_MS = 60 * 1000;

export type UseMergedIcalAvailabilityResult = {
  bookedDates: Date[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useMergedIcalAvailability(
  pollIntervalMs: number | null = DEFAULT_POLL_MS
): UseMergedIcalAvailabilityResult {
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstLoad = useRef(true);

  const fetchBooked = useCallback(async () => {
    const first = isFirstLoad.current;
    if (first) setLoading(true);
    try {
      const res = await fetch("/api/airbnb-calendar");
      let data: unknown;
      try {
        data = await res.json();
      } catch {
        setError("Could not load availability");
        setBookedDates([]);
        return;
      }

      if (
        !res.ok ||
        (data !== null &&
          typeof data === "object" &&
          !Array.isArray(data) &&
          "error" in data)
      ) {
        const msg =
          data !== null &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error: unknown }).error === "string"
            ? (data as { error: string }).error
            : "Could not load availability";
        setError(msg);
        setBookedDates([]);
        return;
      }

      if (!Array.isArray(data)) {
        setError("Invalid calendar response");
        setBookedDates([]);
        return;
      }

      const dates: Date[] = [];
      for (const event of data) {
        if (
          event !== null &&
          typeof event === "object" &&
          "type" in event &&
          (event as { type: string }).type === "VEVENT" &&
          "start" in event &&
          "end" in event
        ) {
          const ev = event as { start: string | Date; end: string | Date };
          const current = new Date(ev.start);
          const end = new Date(ev.end);
          while (current < end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
        }
      }
      setError(null);
      setBookedDates(dates);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load availability"
      );
      setBookedDates([]);
    } finally {
      if (first) {
        isFirstLoad.current = false;
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchBooked();
    if (pollIntervalMs != null && pollIntervalMs > 0) {
      intervalRef.current = setInterval(() => void fetchBooked(), pollIntervalMs);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchBooked, pollIntervalMs]);

  return { bookedDates, loading, error, refetch: fetchBooked };
}
