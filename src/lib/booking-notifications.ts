import { ADMIN_EMAIL } from "@/lib/admin";
import { formatBookingStatus, type BookingStatus } from "@/lib/booking-workflow";

type BookingEmailSummary = {
  bookingId: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  total: string;
};

type StatusChangeNotification = {
  booking: BookingEmailSummary;
  fromStatus: BookingStatus;
  toStatus: BookingStatus;
  actorEmail: string;
};

type PaymentReferenceNotification = {
  booking: BookingEmailSummary;
  actorEmail: string;
  paymentReference: string;
};

function buildBookingSummary(booking: BookingEmailSummary): string {
  return [
    `Booking ID: ${booking.bookingId}`,
    `Guest: ${booking.guestEmail}`,
    `Stay: ${booking.checkIn} -> ${booking.checkOut}`,
    `Total: ${booking.total}`,
  ].join("\n");
}

async function sendEmailJsMessage(params: {
  toEmail: string;
  subject: string;
  message: string;
  name: string;
  email: string;
}) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) return;

  const payload = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      to_email: params.toEmail,
      subject: params.subject,
      name: params.name,
      email: params.email,
      message: params.message,
    },
    ...(privateKey ? { accessToken: privateKey } : {}),
  };

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error) {
    console.error("Could not send booking notification email.", error);
  }
}

export async function notifyAdminOfGuestStatusChange(
  input: StatusChangeNotification
) {
  const { booking, fromStatus, toStatus, actorEmail } = input;
  await sendEmailJsMessage({
    toEmail: ADMIN_EMAIL,
    subject: `Guest booking update: ${formatBookingStatus(toStatus)}`,
    name: "Guest booking update",
    email: actorEmail,
    message: [
      `The guest changed a booking status.`,
      "",
      `${formatBookingStatus(fromStatus)} -> ${formatBookingStatus(toStatus)}`,
      buildBookingSummary(booking),
    ].join("\n"),
  });
}

export async function notifyGuestOfAdminStatusChange(
  input: StatusChangeNotification
) {
  const { booking, fromStatus, toStatus, actorEmail } = input;
  await sendEmailJsMessage({
    toEmail: booking.guestEmail,
    subject: `Booking status updated: ${formatBookingStatus(toStatus)}`,
    name: "Booking status updated",
    email: actorEmail,
    message: [
      `Your booking status was updated by the admin.`,
      "",
      `${formatBookingStatus(fromStatus)} -> ${formatBookingStatus(toStatus)}`,
      buildBookingSummary(booking),
    ].join("\n"),
  });
}

export async function notifyAdminOfPaymentReferenceUpdated(
  input: PaymentReferenceNotification
) {
  const { booking, actorEmail, paymentReference } = input;
  await sendEmailJsMessage({
    toEmail: ADMIN_EMAIL,
    subject: "Guest payment reference updated",
    name: "Guest payment reference",
    email: actorEmail,
    message: [
      "The guest added or updated the payment reference for a booking.",
      "",
      buildBookingSummary(booking),
      "",
      "Payment reference:",
      paymentReference,
    ].join("\n"),
  });
}
