"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ font = "" }: { font?: string }) {
  const pathname = usePathname();

  return (
    <header
      className={`py-10 px-5 bg-blue-900 text-gray-100  flex-col ${font} 
     justify-between items-start`}
    >
      <div className="flex items-center gap-4 pl-5 columns-4 rounded-lg shadow-lg">
        {pathname !== "/" && (
          <Link
            href="/"
            className="text-xl font-semibold hover:text-yellow-400 transition-colors  pr-5"
          >
            {"< "} Home
          </Link>
        )}
      </div>
      <div className="flex flex-col pr-5 gap-4  justify-between items-start columns-4">
        {pathname == "/" && (
          <div className="flex items-center gap-4 ">
            <Link
              href="/book-your-stay"
              className={`flex items-center gap-2 text-xl  font-semibold transition-colors hover:text-yellow-400 text-gray-100 ${font}`}
            >
              Book your stay {">"}
            </Link>
            <img src="/beds-bedroom-svgrepo-com.svg" width={24} height={24} />
            <Link
              href="/county"
              className=" text-xl font-semibold hover:text-yellow-400 transition-colors"
            >
              Visit our County {">"}
            </Link>
            <img src="/city-svgrepo-com.svg" width={24} height={24} />
          </div>
        )}
      </div>
    </header>
  );
}
