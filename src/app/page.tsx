import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-0 bg-gradient-to-br from-blue-100 via-white to-yellow-100"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1590631196293-61172b43d06d?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Header with navigation tabs */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-white/70 backdrop-blur-md shadow-md">
        <nav className="flex gap-8">
          <Link
            href="/"
            className="text-lg font-semibold text-blue-800 hover:underline underline-offset-4 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/book-your-stay"
            className="text-lg font-semibold text-blue-800 hover:underline underline-offset-4 transition-colors"
          >
            Book Your Stay
          </Link>
        </nav>
      </header>
      <section className="flex flex-col md:flex-row items-center justify-center flex-1 w-full max-w-5xl gap-12 px-8 py-16">
        {/* Left: Description & CTA */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6 bg-white/80 rounded-2xl shadow-xl p-8">
          <h1 className="text-5xl font-extrabold mb-2 text-blue-900 drop-shadow-lg">
            Welcome!
          </h1>
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            A Home in the Heart of the City
          </h2>
          <p className="text-lg text-gray-700 mb-4 max-w-xl">
            Welcome to your dream apartment in the heart of Sibiu, Romania!
            Nestled just steps away from the historic Bruckenthal Palace, this
            cozy and modern space offers the perfect blend of comfort and
            culture. Enjoy morning coffee with a view of cobblestone streets,
            explore vibrant local markets, and relax in a sunlit living room
            after a day of adventure. Whether you&apos;re here for business or
            leisure, Central am Bruckenthal is your gateway to the best of
            Sibiu.
            <br />
            <br />
            <span className="font-semibold">Sibiu</span> is a city where history
            meets vibrancy. Known for its colorful squares, medieval walls, and
            lively festivals, Sibiu is the proud home of the famous Christmas
            Market and a UNESCO World Heritage site. Discover the charm of
            Transylvania right outside your door!
            <br />
            <br />
            <span className="font-semibold">
              Stay in a beautiful apartment in Sibiu, close to many cafes and
              restaurants. Enjoy the city&apos;s rich history and vibrant
              culture.
            </span>
          </p>
          <div className="flex gap-4 w-full">
            <Link
              href="/book-your-stay"
              className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 text-center text-lg w-full md:w-auto"
            >
              Book Your Stay
            </Link>
            <a
              href="https://instagram.com/central_am_brukenthal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition-all duration-200 text-lg"
            >
              <Image
                src="/instagram-svgrepo-com.svg"
                alt="Instagram"
                width={24}
                height={24}
              />
              Instagram
            </a>
          </div>
        </div>
        {/* Right: Apartment Image */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/sufra.jpeg"
            alt="Apartment Living Room"
            width={480}
            height={340}
            className="rounded-2xl shadow-2xl object-cover border-4 border-white"
            priority
          />
        </div>
      </section>
      {/* Footer with additional links */}
      <footer className="w-full text-center py-4 bg-white/70 backdrop-blur-md shadow-inner">
        <p className="text-gray-500 text-sm">
          &copy; 2023 Central am Bruckenthal. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
