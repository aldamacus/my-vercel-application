"use client";

import { useEffect, useRef, useState } from "react";
import { sendContactEmailAction } from "@/app/actions/outreachEmail";

export type ContactFormProps = {
  /** Called when the user dismisses the success or error popup (close parent modal). */
  onClosed?: () => void;
};

const CONTACT_INBOX_EMAIL = "central.brukenthal@gmail.com";

export default function ContactForm({ onClosed }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<null | "success" | "error">(null);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const form = formRef.current;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setSending(true);
    const res = await sendContactEmailAction({ name, email, message });
    setSending(false);
    if (res.ok) {
      form.reset();
      setFeedback("success");
    } else {
      setFeedback("error");
    }
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
          onSubmit={sendEmail}
          className="mx-auto w-full max-w-md space-y-4 p-2 sm:p-4"
        >
          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Name:
            <input
              type="text"
              name="name"
              required
              maxLength={100}
              className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Your Email:
            <input
              type="email"
              name="email"
              required
              maxLength={100}
              className="mt-1 block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="mb-1 block text-sm font-medium text-neutral-900">
            Message:
            <textarea
              name="message"
              rows={5}
              maxLength={500}
              required
              className="mt-1 block w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-2 text-base focus:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary/30"
            ></textarea>
            <span className="mt-1 block text-xs text-gray-500">
              Max 500 characters
            </span>
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-primary px-4 py-2 text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      ) : null}

      {feedback !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="contact-feedback-title"
          aria-describedby="contact-feedback-desc"
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
                  id="contact-feedback-title"
                  className="mb-2 text-center text-lg font-semibold text-green-800"
                >
                  Message sent
                </h4>
                <p
                  id="contact-feedback-desc"
                  className="text-center text-sm text-neutral-600"
                >
                  Thank you for reaching out. We will get back to you soon.
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
                  id="contact-feedback-title"
                  className="mb-2 text-center text-lg font-semibold text-red-800"
                >
                  Could not send
                </h4>
                <p
                  id="contact-feedback-desc"
                  className="text-center text-sm text-neutral-600"
                >
                  Something went wrong. Please try again later or email us
                  directly at {CONTACT_INBOX_EMAIL}.
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
