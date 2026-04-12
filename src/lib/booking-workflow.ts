export const BOOKING_STATUSES = [
  "new",
  "pending",
  "upcoming",
  "rejected",
  "cancelled",
  "cancellation_requested",
  "completed",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export function isBookingStatus(value: string): value is BookingStatus {
  return BOOKING_STATUSES.includes(value as BookingStatus);
}

export function coerceBookingStatus(value: string): BookingStatus {
  return isBookingStatus(value) ? value : "new";
}

export function formatBookingStatus(status: BookingStatus): string {
  switch (status) {
    case "new":
      return "New";
    case "pending":
      return "Pending payment";
    case "upcoming":
      return "Upcoming";
    case "rejected":
      return "Rejected";
    case "cancelled":
      return "Cancelled";
    case "cancellation_requested":
      return "Cancellation requested";
    case "completed":
      return "Completed";
  }
}

export function canGuestCancelBooking(status: BookingStatus): boolean {
  return status === "new" || status === "pending";
}

export function canGuestRequestCancellation(status: BookingStatus): boolean {
  return status === "upcoming";
}

export function canGuestEditPaymentReference(status: BookingStatus): boolean {
  return status === "pending";
}

export function canAdminMoveToPending(status: BookingStatus): boolean {
  return status === "new";
}

export function canAdminRejectBooking(status: BookingStatus): boolean {
  return status === "new";
}

export function canAdminConfirmUpcoming(
  status: BookingStatus,
  paymentReference: string
): boolean {
  return status === "pending" && paymentReference.trim().length > 0;
}

export function canAdminResolveCancellation(status: BookingStatus): boolean {
  return status === "cancellation_requested";
}

export function canAdminCompleteBooking(status: BookingStatus): boolean {
  return status === "upcoming";
}
