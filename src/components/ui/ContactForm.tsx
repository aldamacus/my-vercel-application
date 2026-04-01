"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const emailJsPublicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
if (emailJsPublicKey) {
  emailjs.init(emailJsPublicKey);
}

export type ContactFormProps = {
  onSuccess?: () => void;
};

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;
    const form = formRef.current;
    setSending(true);
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        form
      )
      .then(() => {
        setSending(false);
        onSuccess?.();
      })
      .catch(() => {
        setSending(false);
        alert("Failed to send message. Please try again later.");
      });
    form.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={sendEmail}
      className="space-y-4 w-full max-w-md mx-auto p-2 sm:p-4"
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
        <span className="block text-xs text-gray-500 mt-1">
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
  );
}
