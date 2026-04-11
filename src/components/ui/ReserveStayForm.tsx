"use client";

import { useEffect, useRef, useState } from "react";
import { createBookingAction } from "@/app/actions/bookings";
import { sendReservationEmailAction } from "@/app/actions/outreachEmail";

const CONTACT_INBOX_EMAIL = "central.brukenthal@gmail.com";

export const RESERVATION_DEFAULT_MESSAGE =
  "I would like to book these dates for my future travel experience.";

export type ReserveStayFormProps = {
  selectedDates: Date[];
  onClosed?: () => void;
  userEmail?: string;
  userName?: string;
};

function formatStayRange(dates: Date[]): {
  rangeLabel: string;
  nights: number;
  perNightList: string;
} {
  const sorted = [...dates].sort((a, b) => a.getTime() - b.getTime());
  const from = sorted[0];
  const till = sorted[sorted.length - 1];
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const rangeLabel = `${fmt(from)} – ${fmt(till)}`;
  const nights = sorted.length;
  const perNightList = sorted.map((d) => `• ${fmt(d)}`).join("\n");
  return {
    rangeLabel,
    nights,
    perNightList,
  };
}

export default function ReserveStayForm({
  selectedDates,
  onClosed,
  userEmail,
  userName,
}: ReserveStayFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState(RESERVATION_DEFAULT_MESSAGE);

  const { rangeLabel, nights, perNightList } =
    formatStayRange(selectedDates);

  const sendReservation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const form = formRef.current;
    const fd = new FormData(form);
    const name = userName ?? String(fd.get("name") ?? "").trim();
    const email = userEmail ?? String(fd.get("email") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const userMessage = message.trim();

    const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime());
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    const checkIn = fmt(sorted[0]);
    const checkOut = fmt(sorted[sorted.length - 1]);

    const composedBody = [
      "--- Reservation request — Central am Brukenthal ---",
      `Stay (first night → last night): ${rangeLabel}`,
      `Nights: ${nights}`,
      "",
      "Nights requested:",
      perNightList,
      "",
      `Guest address: ${address}`,
      "",
      "Message:",
      userMessage,
    ].join("\n");

    setSending(true);

    const subject = `Reservation request — ${nights} night(s) — ${rangeLabel}`;
    const [dbResult, emailResult] = await Promise.all([
      userEmail
        ? createBookingAction({
            checkIn,
            checkOut,
            nights,
            total: "TBD",
          })
        : Promise.resolve({ ok: true as const }),
      sendReservationEmailAction({
        name,
        email,
        address,
        message: composedBody,
        bookingDates: rangeLabel,
        nights: String(nights),
        subject,
      }),
    ]);

    setSending(false);
    if (!emailResult.ok) {
      setFeedback("error");
      return;
    }
    if (!dbResult.ok) {
      setFeedback("error");
      return;
    }
    form.reset();
    setMessage(RESERVATION_DEFAULT_MESSAGE);
    setFeedback("success");
  };

  const handleDismissFeedback = () => {
    setFeedback(null);
    onClosed?.();
  };

  useEffect(() => {
    if (!feedback) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFeedback(null);
        onClosed?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedback, onClosed]);

  return (
    <div className="relative">
      {feedback === null ? (
        <form
          ref={formRef}
          onSubmit={sendReservation}
          className="mx-auto w-full max-w-md space-y-4"
        >
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-800">
            <p className="font-semibold text-neutral-900">Your selected stay</p>
            <p className="mt-2 text-base font-medium">{rangeLabel}</p>
            <p className="mt-1 text-neutral-600">
              {nights} night{nights !== 1 ? "s" : ""} · pricing provided by the admin
            </p>
            <ul className="mt-2 list-inside list-disc text-xs text-neutral-600">
              {selectedDates
                .slice()
                .sort((a, b) => a.getTime() - b.getTime())
                .map((d) => (
                  <li key={d.getTime()}>
                    {d.toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </li>
                ))}
            </ul>
          </div>

          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Name
            <input
              type="text"
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              defaultValue={userName ?? ""}
              readOnly={!!userName}
              className={`mt-1 block w-full rounded-lg border px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                userName
                  ? "border-neutral-200 bg-neutral-100 text-neutral-500 cursor-default"
                  : "border-neutral-300 bg-white focus:border-neutral-500"
              }`}
            />
          </label>
          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Email
            <input
              type="email"
              name="email"
              required
              maxLength={100}
              autoComplete="email"
              defaultValue={userEmail ?? ""}
              readOnly={!!userEmail}
              className={`mt-1 block w-full rounded-lg border px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                userEmail
                  ? "border-neutral-200 bg-neutral-100 text-neutral-500 cursor-default"
                  : "border-neutral-300 bg-white focus:border-neutral-500"
              }`}
            />
          </label>
          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Address
            <input
              type="text"
              name="address"
              required
              maxLength={200}
              autoComplete="street-address"
              placeholder="Street, city, country"
              className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Message
            <textarea
              name="guest_message"
              rows={4}
              maxLength={800}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="mt-1 block text-xs text-neutral-500">
              Max 800 characters. Dates are included automatically in the email.
            </span>
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={sending}
          >
            {sending ? "Sending…" : "Send reservation request"}
          </button>
        </form>
      ) : null}

      {feedback !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reserve-feedback-title"
          aria-describedby="reserve-feedback-desc"
          onClick={handleDismissFeedback}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {feedback === "success" ? (
              <>
                <div className="mb-3 flex justify-center">
                  <svg
                    className="h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h4
                  id="reserve-feedback-title"
                  className="mb-2 text-center text-lg font-semibold text-green-800"
                >
                  Request sent
                </h4>
                <p
                  id="reserve-feedback-desc"
                  className="text-center text-sm text-neutral-600"
                >
                  We received your reservation request with your dates. We will
                  get back to you shortly.
                </p>
              </>
            ) : (
              <>
                <div className="mb-3 flex justify-center">
                  <svg
                    className="h-12 w-12 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h4
                  id="reserve-feedback-title"
                  className="mb-2 text-center text-lg font-semibold text-red-800"
                >
                  Could not send
                </h4>
                <p
                  id="reserve-feedback-desc"
                  className="text-center text-sm text-neutral-600"
                >
                  Something went wrong. Please try again or email{" "}
                  {CONTACT_INBOX_EMAIL}.
                </p>
              </>
            )}
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
              onClick={handleDismissFeedback}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
