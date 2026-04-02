"use client";

import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
if (emailJsPublicKey) {
  emailjs.init(emailJsPublicKey);
}

const CONTACT_INBOX_EMAIL = "central.brukenthal@gmail.com";

export const RESERVATION_DEFAULT_MESSAGE =
  "I would like to book these dates for my future travel experience.";

export type ReserveStayFormProps = {
  selectedDates: Date[];
  onClosed?: () => void;
};

function formatStayRange(dates: Date[]): {
  rangeLabel: string;
  nights: number;
  totalEur: number;
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
    totalEur: nights * 30,
    perNightList,
  };
}

export default function ReserveStayForm({
  selectedDates,
  onClosed,
}: ReserveStayFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState(RESERVATION_DEFAULT_MESSAGE);

  const { rangeLabel, nights, totalEur, perNightList } =
    formatStayRange(selectedDates);

  const sendReservation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const form = formRef.current;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const address = String(fd.get("address") ?? "").trim();
    const userMessage = message.trim();

    const composedBody = [
      "--- Reservation request — Central am Brukenthal ---",
      `Stay (first night → last night): ${rangeLabel}`,
      `Nights: ${nights}`,
      `Indicative total: €${totalEur} (€30 × ${nights} nights)`,
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
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          to_email: CONTACT_INBOX_EMAIL,
          name,
          email,
          address,
          message: composedBody,
          booking_dates: rangeLabel,
          nights: String(nights),
          total_eur: String(totalEur),
          subject: `Reservation request — ${nights} night(s) — ${rangeLabel}`,
        }
      )
      .then(() => {
        setSending(false);
        form.reset();
        setMessage(RESERVATION_DEFAULT_MESSAGE);
        setFeedback("success");
      })
      .catch(() => {
        setSending(false);
        setFeedback("error");
      });
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
              {nights} night{nights !== 1 ? "s" : ""} · €{totalEur} total
              (€30/night)
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
              className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
