// src/clients/homeaway-calendar-client.ts
// Simulated HomeAway calendar client for demo purposes

export class HomeAwayCalendarClient {
  private interval: NodeJS.Timeout | null = null;
  private callback: (dates: Date[]) => void;

  constructor(callback: (dates: Date[]) => void) {
    this.callback = callback;
  }

  start() {
    // Simulate fetching booked dates every 5 minutes (here, every 10 seconds for demo)
    this.fetchAndUpdate();
    this.interval = setInterval(() => this.fetchAndUpdate(), 1000 * 10);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
  }

  private fetchAndUpdate() {
    // Simulate booked dates (e.g., 12th, 13th, 14th of the current month)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const booked = [12, 13, 14].map(day => new Date(year, month, day));
    this.callback(booked);
  }
}
