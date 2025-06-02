import Link from "next/link";

export default function Header({ font = "" }: { font?: string }) {
  return (
    <header className={`py-2 bg-gray-900 text-gray-100 ${font}`}>
      <div className="max-w-400 px-12 mx-auto flex justify-between items-center">
        <Link href="/book-your-stay">
          <h2 className={`text-xl font-bold text-gray-100 ${font}`}>
            Book your stay
          </h2>
        </Link>
        <Link
          href="/sibiu"
          className="text-green-700 text-xl py-2 hover:text-yellow-400 transition-colors"
        >
          Visit our Town {">"}
        </Link>
      </div>
    </header>
  );
}
