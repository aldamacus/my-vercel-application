import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="pt-1  items-baseline justify-between bg-center from-blue-100 via-white to-yellow-100"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1590631196293-61172b43d06d?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Header with navigation tabs */}

      <section className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl gap-12 px-8 py-16">
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
        </div>
        {/* Right: Apartment Image */}
        <div className="static w-full md:w-1/2 max-w-md">
          <Image
            src="/163308128.jpg"
            alt="Apartment Living Room"
            width={480}
            height={340}
            className="rounded-2xl shadow-2xl object-cover border-4 border-white absolute inset-y-60 right-0 w-120"
            priority
          />
        </div>
      </section>
    </main>
  );
}
