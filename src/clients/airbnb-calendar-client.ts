// AirbnbCalendarClient: checks Airbnb calendar and updates booked dates every 5 minutes
export class AirbnbCalendarClient {
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
    // Simulate fetching booked dates from Airbnb
    // Replace with real API call
    const bookedDates = [
      new Date('2025-06-01'),
      new Date('2025-06-02'),
      new Date('2025-06-03'),
    ];
    this.updateCalendar(bookedDates);
  }
}
