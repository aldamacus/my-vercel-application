"use server";

import { headers } from "next/headers";
import { getEmailJsConfig, sendEmailJsTemplate } from "@/lib/emailJsServer";
import { consumeRateLimit, getRequestIp } from "@/lib/rateLimit";
import { ADMIN_EMAIL } from "@/lib/admin";

const CONTACT_INBOX = "central.brukenthal@gmail.com";

export async function sendContactEmailAction(input: {
  name: string;
  email: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const h = await headers();
  const ip = getRequestIp(h);
  if (!(await consumeRateLimit("contact_email", ip, 12, 15 * 60 * 1000)).ok) {
    return { ok: false, error: "Too many messages. Please try again later." };
  }

  const cfg = getEmailJsConfig();
  if (!cfg) {
    return { ok: false, error: "Email is not configured." };
  }

  const { ok, status } = await sendEmailJsTemplate(
    {
      to_email: CONTACT_INBOX,
      name: input.name.slice(0, 100),
      email: input.email.slice(0, 100),
      message: input.message.slice(0, 500),
    },
    cfg
  );
  if (!ok) {
    return { ok: false, error: `Send failed (${status})` };
  }
  return { ok: true };
}

export async function sendReservationEmailAction(input: {
  name: string;
  email: string;
  address: string;
  message: string;
  bookingDates: string;
  nights: string;
  subject: string;
}): Promise<{ ok: boolean; error?: string }> {
  const h = await headers();
  const ip = getRequestIp(h);
  if (!(await consumeRateLimit("reservation_email", ip, 12, 15 * 60 * 1000)).ok) {
    return { ok: false, error: "Too many requests. Please try again later." };
  }

  const cfg = getEmailJsConfig();
  if (!cfg) {
    return { ok: false, error: "Email is not configured." };
  }

  const { ok, status } = await sendEmailJsTemplate(
    {
      to_email: CONTACT_INBOX,
      name: input.name.slice(0, 120),
      email: input.email.slice(0, 120),
      address: input.address.slice(0, 300),
      message: input.message.slice(0, 8000),
      booking_dates: input.bookingDates.slice(0, 200),
      nights: input.nights,
      subject: input.subject.slice(0, 200),
    },
    cfg
  );
  if (!ok) {
    return { ok: false, error: `Send failed (${status})` };
  }
  return { ok: true };
}

export async function sendRegistrationEmailsAction(input: {
  userEmail: string;
  token: string;
}): Promise<{ ok: boolean; error?: string }> {
  const h = await headers();
  const ip = getRequestIp(h);
  if (!(await consumeRateLimit("register_email", ip, 10, 60 * 60 * 1000)).ok) {
    return { ok: false, error: "Too many registration attempts. Try again later." };
  }

  const cfg = getEmailJsConfig();
  if (!cfg) {
    return { ok: false, error: "Email is not configured." };
  }

  const userEmail = input.userEmail.trim().toLowerCase();
  const token = input.token.trim();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) {
    return { ok: false, error: "Missing host header." };
  }
  const proto =
    h.get("x-forwarded-proto") ??
    (host.includes("localhost") || host.startsWith("127.") ? "http" : "https");
  const confirmUrl = `${proto}://${host}/sign-in?confirm=${encodeURIComponent(token)}`;

  const adminBody = `A new user has registered: ${userEmail}\n\nConfirmation link:\n${confirmUrl}`;
  const userBody = `Welcome! Please confirm your email address by clicking the link below:\n\n${confirmUrl}\n\nIf you did not create an account, you can safely ignore this email.`;

  const toAdmin = await sendEmailJsTemplate(
    {
      to_email: ADMIN_EMAIL,
      name: "New registration",
      email: userEmail,
      message: adminBody,
    },
    cfg
  );
  if (!toAdmin.ok) {
    return { ok: false, error: `Notify admin failed (${toAdmin.status})` };
  }

  const toUser = await sendEmailJsTemplate(
    {
      to_email: userEmail,
      name: "Guest",
      email: userEmail,
      message: userBody,
    },
    cfg
  );
  if (!toUser.ok) {
    return { ok: false, error: `Send confirmation email failed (${toUser.status})` };
  }

  return { ok: true };
}
