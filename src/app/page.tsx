"use client";

import Image from "next/image";
import "react-calendar/dist/Calendar.css";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="grid grid-rows-[60px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1590631196293-61172b43d06d?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header with navigation tabs */}
      <header className="row-start-1 w-full flex justify-start items-center gap-8 mb-4">
        <nav className="flex gap-8">
          <Link href="/" className="text-lg font-semibold hover:underline underline-offset-4">Home</Link>
          <Link href="/book-your-stay" className="text-lg font-semibold hover:underline underline-offset-4">Book Your Stay</Link>
        </nav>
      </header>      
      <main className="flex flex-col gap-[32px] row-start-2 items-start w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-left w-full">Welcome!</h1>
        <h2 className="text-2xl font-semibold mb-2 text-left w-full">A Home in the Heart of the City</h2>
        <div className="w-full flex flex-col sm:flex-row gap-5 items-start">
          {/* Description on the far left */}
          <div className="w-full sm:w-1/2 flex flex-col justify-center items-start">
            <p className="text-lg text-gray-700 mb-6 text-left max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
              Welcome to your dream apartment in the heart of Sibiu, Romania! Nestled just steps away from the historic Bruckenthal Palace, this cozy and modern space offers the perfect blend of comfort and culture. Enjoy morning coffee with a view of cobblestone streets, explore vibrant local markets, and relax in a sunlit living room after a day of adventure. Whether you&apos;re here for business or leisure, Central am Bruckenthal is your gateway to the best of Sibiu.<br/><br/>
              <span className="font-semibold">Sibiu</span> is a city where history meets vibrancy. Known for its colorful squares, medieval walls, and lively festivals, Sibiu is the proud home of the famous Christmas Market and a UNESCO World Heritage site. Discover the charm of Transylvania right outside your door!<br/><br/>
              <span className="font-semibold">Stay in a beautiful apartment in Sibiu, close to many cafes and restaurants. Enjoy the city&apos;s rich history and vibrant culture.</span>
            </p>
            {/* Call to action button */}
            <div className="w-full flex flex-col sm:flex-row gap-4">
              <Link href="/book-your-stay" className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-blue-700 transition-all duration-200 text-center">
                Book Your Stay
              </Link>
            </div>
          </div>
          {/* Image on the right */}
          <div className="w-full sm:w-1/2">
            <Image
              src="https://images.unsplash.com/photo-1590631196293-61172b43d06d?auto=format&fit=crop&w=1200&q=80"
              alt="Cozy apartment in Sibiu"
              className="w-full h-auto rounded-lg shadow-lg"
              width={1200}
              height={800}
            />
          </div>
        </div>
      </main>
      {/* Footer with additional links */}
      <footer className="row-start-3 w-full text-center">
        <p className="text-gray-500 text-sm">
          &copy; 2023 Central am Bruckenthal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
