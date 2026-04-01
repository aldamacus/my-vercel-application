"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Dummy data for demonstration
const bookings = [
  {
    name: "Alice Smith",
    dates: ["2025-06-01", "2025-06-02", "2025-06-03"],
    platform: "Airbnb",
  },
  {
    name: "Bob Johnson",
    dates: ["2025-06-05", "2025-06-06"],
    platform: "Booking.com",
  },
  {
    name: "Charlie Lee",
    dates: ["2025-06-10"],
    platform: "Vercel",
  },
];

const allowedAdmins = [
  { email: "al.damacus@gmail.com", password: "adminpass123" },
];

export default function AdminPage() {
  const [selectedTab, setSelectedTab] = useState("bookings");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Persist admin session in localStorage
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("isAdmin", "true");
    } else if (isAdmin === false) {
      localStorage.removeItem("isAdmin");
    }
  }, [isAdmin]);

  // On mount, check if already logged in as admin
  useEffect(() => {
    const adminSession = localStorage.getItem("isAdmin");
    if (adminSession === "true") {
      setIsAdmin(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const found = allowedAdmins.find(
      (admin) => admin.email === email && admin.password === password
    );
    if (found) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      setError(
        "Invalid credentials. Only authorized admins can view this page."
      );
    }
  };

  if (isAdmin !== true)
    return (
      <div className="flex min-h-screen flex-col items-center bg-neutral-50 p-8 font-medium text-red-600">
        {error && <div className="mb-2 text-red-700">{error}</div>}
        <form onSubmit={handleLogin} className="flex w-72 flex-col gap-2">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white p-2 text-neutral-900"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white p-2 text-neutral-900"
            required
          />
          <button
            type="submit"
            className="mt-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition hover:opacity-95"
          >
            Login as Admin
          </button>
        </form>
        <Link
          href="/"
          className="mt-4 text-neutral-700 underline underline-offset-2 hover:text-primary"
        >
          Back
        </Link>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-neutral-200 bg-white p-6">
        <button
          type="button"
          className={`mb-2 rounded-lg px-4 py-2 text-left font-semibold ${
            selectedTab === "bookings"
              ? "bg-primary text-primary-foreground"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          onClick={() => setSelectedTab("bookings")}
        >
          Bookings
        </button>
        {/* Add more tabs here if needed */}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8 text-neutral-900">
        {selectedTab === "bookings" && (
          <div>
            <h1 className="mb-6 text-2xl font-semibold">Bookings</h1>
            <table className="min-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="py-2 px-4 border-b">Person</th>
                  <th className="py-2 px-4 border-b">Dates Booked</th>
                  <th className="py-2 px-4 border-b">Platform</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4">{booking.name}</td>
                    <td className="py-2 px-4">
                      {booking.dates.map((date, i) => (
                        <span
                          key={i}
                          className="mb-1 mr-1 inline-block rounded bg-neutral-100 px-2 py-1 text-xs text-neutral-800"
                        >
                          {date}
                        </span>
                      ))}
                    </td>
                    <td className="py-2 px-4">{booking.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
