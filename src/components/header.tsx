"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ font = "" }: { font?: string }) {
  const pathname = usePathname();

  return (
    <header className={`bg-blue-900 text-gray-100 ${font} w-full`}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 md:px-8 py-4 md:py-8 gap-4 md:gap-0 w-full max-w-7xl mx-auto">
        {/* Left: Home link */}
        <div className="flex items-center gap-4">
          {pathname !== "/" && (
            <Link
              href="/"
              className="text-sm md:text-base font-semibold hover:text-yellow-400 transition-colors pr-2 md:pr-5"
            >
              {"< "} Home
            </Link>
          )}
        </div>
        {/* Center: Main navigation */}
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 flex-1 justify-center">
          {pathname == "/" && (
            <>
              <Link
                href="/book-your-stay"
                className="flex items-center gap-2 text-xs md:text-base font-semibold transition-colors hover:text-yellow-400 text-gray-100"
              >
                <span>Book your stay</span>
                <img
                  src="/beds-bedroom-svgrepo-com.svg"
                  width={16}
                  height={16}
                  className="hidden md:inline"
                />
              </Link>
              <Link
                href="/county"
                className="flex items-center gap-2 text-xs md:text-base font-semibold hover:text-yellow-400 transition-colors"
              >
                <span>Visit our County</span>
                <img
                  src="/city-svgrepo-com.svg"
                  width={16}
                  height={16}
                  className="hidden md:inline"
                />
              </Link>
              <Link
                href="/in-the-area"
                className="hover:text-yellow-400 text-xs md:text-base font-semibold transition-colors"
              >
                Out & About ● Local Hotspots ● Go Out
              </Link>
            </>
          )}
        </div>
        {/* Right: Review scores */}
        <div className="flex flex-row gap-1 md:gap-4 items-center justify-center md:ml-auto w-full md:w-auto">
          {/* Booking.com */}
          <a
            href="https://www.booking.com/Share-HyJ79e"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-end bg-blue-900/90 rounded-xl px-3 py-2 shadow-lg border border-blue-800 hover:scale-105 transition-transform duration-200 w-32 md:w-40 min-w-[7rem]"
          >
            <span className="text-blue-100 font-bold text-base md:text-lg">
              Booking.com
            </span>
            <div className="flex items-center gap-1 md:gap-2 mt-1">
              <span className="text-blue-200 text-xs md:text-sm">
                114 reviews
              </span>
              <span className="bg-blue-800 text-blue-100 font-bold text-base md:text-xl px-2 md:px-3 py-1 rounded-lg shadow border-2 border-blue-400">
                9.8
              </span>
            </div>
          </a>
          {/* Airbnb */}
          <a
            href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-end bg-blue-900/90 rounded-xl px-3 py-2 shadow-lg border border-blue-800 hover:scale-105 transition-transform duration-200 w-32 md:w-40 min-w-[7rem]"
          >
            <span className="flex items-center gap-1 text-pink-200 font-bold text-base md:text-lg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden md:inline"
              >
                <path
                  d="M16 3C9.37258 3 4 8.37258 4 15C4 21.6274 9.37258 27 16 27C22.6274 27 28 21.6274 28 15C28 8.37258 22.6274 3 16 3ZM16 25C10.4772 25 6 20.5228 6 15C6 9.47715 10.4772 5 16 5C21.5228 5 26 9.47715 26 15C26 20.5228 21.5228 25 16 25Z"
                  fill="#FF5A5F"
                />
                <circle cx="16" cy="15" r="6" fill="#FF5A5F" />
              </svg>
              Airbnb
            </span>
            <div className="flex items-center gap-1 md:gap-2 mt-1">
              <span className="text-blue-200 text-xs md:text-sm">
                148 reviews
              </span>
              <span className="bg-blue-800 text-pink-200 font-bold text-base md:text-xl px-2 md:px-3 py-1 rounded-lg shadow border-2 border-pink-400">
                4.97
              </span>
            </div>
          </a>
          {/* Google */}
          <a
            href="https://maps.app.goo.gl/3oA96HLrR2Jk7suf8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-end bg-blue-900/90 rounded-xl px-3 py-2 shadow-lg border border-blue-800 hover:scale-105 transition-transform duration-200 w-32 md:w-40 min-w-[7rem]"
          >
            <span className="flex items-center gap-1 text-green-200 font-bold text-base md:text-lg">
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="hidden md:inline text-yellow-400"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              Google
            </span>
            <div className="flex items-center gap-1 md:gap-2 mt-1">
              <span className="text-blue-200 text-xs md:text-sm">
                29 reviews
              </span>
              <span className="bg-blue-800 text-green-200 font-bold text-base md:text-xl px-2 md:px-3 py-1 rounded-lg shadow border-2 border-green-400 flex items-center gap-1">
                4.9
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="hidden md:inline text-yellow-400"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.385 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.385-2.46a1 1 0 00-1.175 0l-3.385 2.46c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.385-2.46c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.967z" />
                </svg>
              </span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
