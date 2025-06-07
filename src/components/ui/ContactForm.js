"use client"; // This directive is important to make this a Client Component (can use browser APIs)

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

// Initialize EmailJS with your Public Key
emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);

export default function ContactForm({ onSuccess }) {
  // useRef to access the form DOM node
  const formRef = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault(); // prevent default form submission behavior
    if (!formRef.current) return;
    const form = formRef.current;
    setSending(true);
    // Use EmailJS to send form data
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        form
      )
      .then((response) => {
        setSending(false);
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess();
        }
      })
      .catch((error) => {
        setSending(false);
        // Show an error message to the user if needed
        alert("Failed to send message. Please try again later.");
      });
    // Optionally, reset the form or handle UI state after sending
    form.reset();
  };

  return (
    <form
      ref={formRef}
      onSubmit={sendEmail}
      className="space-y-4 w-full max-w-md mx-auto p-2 sm:p-4"
    >
      <label className="block text-sm font-medium text-blue-900 mb-1">
        Name:
        <input
          type="text"
          name="name"
          required
          maxLength={100}
          className="mt-1 block w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base bg-white"
        />
      </label>
      <label className="block text-sm font-medium text-blue-900 mb-1">
        Your Email:
        <input
          type="email"
          name="email"
          required
          maxLength={100}
          className="mt-1 block w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base bg-white"
        />
      </label>
      <label className="block text-sm font-medium text-blue-900 mb-1">
        Message:
        <textarea
          name="message"
          rows={5}
          maxLength={500}
          required
          className="mt-1 block w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 text-base bg-white resize-none"
        ></textarea>
        <span className="block text-xs text-gray-500 mt-1">
          Max 500 characters
        </span>
      </label>
      <button
        type="submit"
        className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors duration-200 text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={sending}
      >
        {sending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
