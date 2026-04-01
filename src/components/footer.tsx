import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 py-10 text-neutral-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 md:flex-row md:flex-wrap md:justify-between md:px-8">
        <p className="text-center text-sm text-neutral-500 md:text-left">
          Central am Brukenthal · Sibiu Old Town
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
          <a
            href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-800 underline-offset-4 hover:text-neutral-950 hover:underline"
          >
            <Image
              src="/airbnb-color-svgrepo-com.svg"
              alt=""
              width={22}
              height={16}
              className="opacity-90"
            />
            Airbnb
          </a>
          <a
            href="https://instagram.com/central_am_brukenthal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-800 underline-offset-4 hover:text-neutral-950 hover:underline"
          >
            <Image
              src="/instagram-svgrepo-com.svg"
              alt=""
              width={22}
              height={16}
              className="opacity-90"
            />
            Instagram
          </a>
          <a
            href="https://www.booking.com/Share-HyJ79e"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-neutral-800 underline-offset-4 hover:text-neutral-950 hover:underline"
          >
            <Image
              src="/booking-svgrepo-com.svg"
              alt=""
              width={22}
              height={16}
              className="opacity-90"
            />
            Booking.com
          </a>
        </div>
      </div>
    </footer>
  );
}
