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
      <div className="p-8 text-red-600 font-bold flex flex-col items-center">
        {error && <div className="mb-2 text-red-700">{error}</div>}
        <form onSubmit={handleLogin} className="flex flex-col gap-2 w-72">
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login as Admin
          </button>
        </form>
        <Link
          href="/"
          className="mt-4 text-blue-600 underline hover:text-blue-800"
        >
          Back
        </Link>
      </div>
    );

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-6 border-r flex flex-col">
        <button
          className={`text-left py-2 px-4 rounded mb-2 font-semibold ${
            selectedTab === "bookings"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-200"
          }`}
          onClick={() => setSelectedTab("bookings")}
        >
          Bookings
        </button>
        {/* Add more tabs here if needed */}
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {selectedTab === "bookings" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Bookings</h1>
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
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
                          className="inline-block bg-blue-100 text-blue-800 rounded px-2 py-1 mr-1 mb-1 text-xs"
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
