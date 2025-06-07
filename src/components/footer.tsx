import Image from "next/image";

export default function Footer({ font = "" }: { font?: string }) {
  return (
    <footer className={`py-8 bg-blue-900 text-gray-100 ${font}`}>
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start justify-center md:justify-between px-4 md:px-20 w-full max-w-6xl mx-auto">
        {/* Airbnb */}
        <a
          href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-red-300 transition-all duration-200 text-base md:text-lg w-full md:w-auto justify-center md:justify-start"
        >
          <Image
            src="/airbnb-color-svgrepo-com.svg"
            alt="Airbnb"
            width={32}
            height={24}
            className="w-8 h-6"
          />
          <span className="sr-only md:not-sr-only">AirBnb</span>
        </a>
        {/* Instagram */}
        <a
          href="https://instagram.com/central_am_brukenthal"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-all duration-200 text-base md:text-lg w-full md:w-auto justify-center md:justify-start"
        >
          <Image
            src="/instagram-svgrepo-com.svg"
            alt="Instagram"
            width={32}
            height={24}
            className="w-8 h-6"
          />
          <span className="sr-only md:not-sr-only">Instagram</span>
        </a>
        {/* Booking.com */}
        <a
          href="https://www.booking.com/Share-HyJ79e"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 text-base md:text-lg w-full md:w-auto justify-center md:justify-start"
        >
          <Image
            src="/booking-svgrepo-com.svg"
            alt="Booking.com"
            width={32}
            height={24}
            className="w-8 h-6"
          />
          <span className="sr-only md:not-sr-only">Booking.com</span>
        </a>
      </div>
    </footer>
  );
}
