// BookingCalendarClient: checks Booking.com calendar and updates booked dates every 5 minutes
export class BookingCalendarClient {
  intervalId: NodeJS.Timeout | null = null;
  constructor(private updateCalendar: (dates: Date[]) => void) {}

  start() {
    this.fetchAndUpdate();
    this.intervalId = setInterval(() => this.fetchAndUpdate(), 5 * 60 * 1000);
  }

  stop() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  async fetchAndUpdate() {
    // Simulate fetching booked dates from Booking.com
    // Replace with real API call
    const bookedDates = [new Date("2025-06-05"), new Date("2025-06-06")];
    this.updateCalendar(bookedDates);
  }
}
