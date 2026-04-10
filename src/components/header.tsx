"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSession, AUTH_CHANGE_EVENT, type Session } from "@/components/SignIn";
import { isAdminEmail } from "@/lib/admin";

function HeaderAuth() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(getSession());
    const handler = () => setSession(getSession());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  }, []);

  if (session) {
    const accountHref = isAdminEmail(session.email) ? "/admin" : "/profile";
    const accountLabel = isAdminEmail(session.email) ? "Admin dashboard" : "My profile";
    return (
      <Link
        href={accountHref}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white ring-2 ring-white hover:bg-neutral-700 transition"
        aria-label={accountLabel}
        title={session.email}
      >
     
        {session.email[0].toUpperCase()}
      
      </Link>
     
    );
  }

  return (
    <Link
      href="/sign-in"
      className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-white hover:text-neutral-900"
    >
      <LogIn size={14} aria-hidden />
      Sign in
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-sm transition-shadow duration-200",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 md:h-16 md:px-8">
        <Link
          href="/"
          className="shrink-0 text-base font-semibold tracking-tight text-neutral-900 hover:opacity-80 md:text-lg"
        >
          Central am Brukenthal
        </Link>

        <nav className="order-3 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm font-medium text-neutral-600 md:order-none md:w-auto md:flex-1 md:justify-center">
          <Link
            href="/book-your-stay"
            className={cn(
              "inline-flex items-center gap-1.5 hover:text-neutral-900 hover:underline underline-offset-4",
              pathname.startsWith("/book-your-stay") && "text-neutral-900"
            )}
          >
            Book your stay
            <Image
              src="/beds-bedroom-svgrepo-com.svg"
              alt=""
              width={14}
              height={14}
              className="hidden opacity-60 sm:inline"
              unoptimized
              aria-hidden
            />
          </Link>
          <Link
            href="/county"
            className={cn(
              "inline-flex items-center gap-1.5 hover:text-neutral-900 hover:underline underline-offset-4",
              pathname === "/county" && "text-neutral-900"
            )}
          >
            Visit our County
            <Image
              src="/city-svgrepo-com.svg"
              alt=""
              width={14}
              height={14}
              className="hidden opacity-60 sm:inline"
              unoptimized
              aria-hidden
            />
          </Link>
          <Link
            href="/in-the-area"
            className={cn(
              "hover:text-neutral-900 hover:underline underline-offset-4",
              pathname === "/in-the-area" && "text-neutral-900"
            )}
          >
            Out &amp; About
          </Link>
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2 md:gap-3">
          <div className="relative group flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1 text-neutral-400"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
            <HeaderAuth />
            <span
              className="absolute top-full left-1/2 mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-900 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
              style={{ zIndex: 10 }}
              role="tooltip"
            >
              Profile
            </span>
          </div>
          <a
            href="https://www.booking.com/Share-HyJ79e"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-right transition hover:border-neutral-300 sm:block md:px-3"
          >
            <span className="text-xs font-semibold text-neutral-900">
              Booking.com
            </span>
            <div className="mt-0.5 flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-neutral-500">114 reviews</span>
              <span className="rounded-md bg-neutral-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                9.3
              </span>
            </div>
          </a>
          <a
            href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-right transition hover:border-neutral-300 sm:block md:px-3"
          >
            <span className="flex items-center justify-end gap-1 text-xs font-semibold text-neutral-900">
              <svg
                width="14"
                height="14"
                viewBox="0 0 32 32"
                fill="none"
                className="text-[#FF5A5F]"
                aria-hidden
              >
                <path
                  d="M16 3C9.37258 3 4 8.37258 4 15C4 21.6274 9.37258 27 16 27C22.6274 27 28 21.6274 28 15C28 8.37258 22.6274 3 16 3ZM16 25C10.4772 25 6 20.5228 6 15C6 9.47715 10.4772 5 16 5C21.5228 5 26 9.47715 26 15C26 20.5228 21.5228 25 16 25Z"
                  fill="currentColor"
                />
                <circle cx="16" cy="15" r="6" fill="currentColor" />
              </svg>
              Airbnb
            </span>
            <div className="mt-0.5 flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-neutral-500">148 reviews</span>
              <span className="rounded-md bg-neutral-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                4.97
              </span>
            </div>
          </a>
          <a
            href="https://maps.app.goo.gl/3oA96HLrR2Jk7suf8"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-xl border border-neutral-200 bg-neutral-50 px-2 py-1.5 text-right transition hover:border-neutral-300 lg:block md:px-3"
          >
            <span className="text-xs font-semibold text-neutral-900">
              Google
            </span>
            <div className="mt-0.5 flex items-center justify-end gap-1.5">
              <span className="text-[10px] text-neutral-500">29 reviews</span>
              <span className="rounded-md bg-neutral-900 px-1.5 py-0.5 text-xs font-semibold text-white">
                4.9
              </span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
}
