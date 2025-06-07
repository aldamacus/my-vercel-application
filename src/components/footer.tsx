import Image from "next/image";

export default function Footer({ font = "" }: { font?: string }) {
  return (
    <footer className={`py-8 bg-blue-900 text-gray-100 ${font}`}>
      <div className="flex flex-row flex-wrap gap-4 md:gap-10 items-center justify-center md:justify-between px-4 md:px-20 w-full max-w-6xl mx-auto">
        {/* Airbnb */}
        <a
          href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-red-300 transition-all duration-200 text-sm md:text-lg min-w-[120px] justify-center"
        >
          <Image
            src="/airbnb-color-svgrepo-com.svg"
            alt="Airbnb"
            width={28}
            height={20}
            className="w-7 h-5"
          />
          <span className="">AirBnb</span>
        </a>
        {/* Instagram */}
        <a
          href="https://instagram.com/central_am_brukenthal"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-all duration-200 text-sm md:text-lg min-w-[120px] justify-center"
        >
          <Image
            src="/instagram-svgrepo-com.svg"
            alt="Instagram"
            width={28}
            height={20}
            className="w-7 h-5"
          />
          <span className="">Instagram</span>
        </a>
        {/* Booking.com */}
        <a
          href="https://www.booking.com/Share-HyJ79e"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 text-sm md:text-lg min-w-[120px] justify-center"
        >
          <Image
            src="/booking-svgrepo-com.svg"
            alt="Booking.com"
            width={28}
            height={20}
            className="w-7 h-5"
          />
          <span className="">Booking.com</span>
        </a>
      </div>
    </footer>
  );
}
