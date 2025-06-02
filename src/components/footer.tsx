import Image from "next/image";

export default function Footer({ font = "" }: { font?: string }) {
  return (
    <footer className={`py-12 bg-blue-900 columns-4 text-gray-100 ${font}`}>
      <div className="gap-10 items-start z-5 flex  justify-between px-20">
        <div className="flex gap-10 w-full">
          <a
            href="https://www.airbnb.com/rooms/29024999?guests=1&adults=1&s=67&unique_share_id=8d98beea-95de-435b-932e-fe4ffcec89ad"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-15 py-3 bg-blue-900 text-white  rounded-lg shadow-lg hover:bg-red-300 transition-all duration-200 text-lg"
          >
            <Image
              src="/airbnb-color-svgrepo-com.svg"
              alt="Airbnb"
              width={40}
              height={30}
            />
            AirBnb
          </a>
        </div>
        <div className="flex gap-10 w-full">
          <a
            href="https://instagram.com/central_am_brukenthal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-15 py-3 bg-blue-900 text-white  rounded-lg shadow-lg hover:bg-pink-600 transition-all duration-200 text-lg"
          >
            <Image
              src="/instagram-svgrepo-com.svg"
              alt="Instagram"
              width={40}
              height={24}
            />
            Instagram
          </a>
        </div>

        <div className="flex gap-10 w-full">
          <a
            href="https://www.booking.com/Share-HyJ79e"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-15 py-3 bg-blue-900 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 text-lg"
          >
            <Image
              src="/booking-svgrepo-com.svg"
              alt="Instagram"
              width={40}
              height={24}
            />
            Booking.com
          </a>
        </div>
      </div>
    </footer>
  );
}
