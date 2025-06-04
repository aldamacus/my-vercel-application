import Image from "next/image";

export default function Home() {
  // Only 5 images in total, distributed as described
  return (
    <main className="pt-1 items-baseline justify-between bg-white">
      <section className="flex justify-center w-full">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-16 w-full max-w-6xl"
          style={{ maxWidth: "65vw" }}
        >
          {/* Info block above the first column */}
          <div className="md:col-span-3 flex columns-2 justify-center w-full flex-col items-baseline pt-10 pb-5 mb-8">
            <div className="text-left text-4xl font-semibold text-blue-800">
              Central am Brukenthal
            </div>
            <div className="text-left font-normal text-gray-700 mt-3">
              <div className="font-bold text-blue-900 mb-1">
                Beautifully historic flat in downtown
              </div>
              <div>
                Samuel von Brukenthal, No. 1, Ap 6, Sibiu Old Town, Sibiu, Romania
                <br />
                Excellent location – show map
              </div>
            </div>
          </div>
          {/* First column: one large image */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="w-full h-[36rem] rounded-xl overflow-hidden shadow-2xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
              <Image
                src="/163426986.jpg"
                alt="Apartment highlight 1"
                width={800}
                height={1200}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
          </div>
          {/* Second column: two stacked images */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
              <Image
                src="/163308132.jpg"
                alt="Apartment highlight 2"
                width={600}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority={false}
              />
            </div>
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
              <Image
                src="/175330372.jpg"
                alt="Apartment highlight 3"
                width={600}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority={false}
              />
            </div>
          </div>
          {/* Third column: two stacked images */}
          <div className="col-span-1 flex flex-col gap-4">
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
              <Image
                src="/175330474.jpg"
                alt="Apartment highlight 4"
                width={600}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority={false}
              />
            </div>
            <div className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl">
              <Image
                src="/175330495.jpg"
                alt="Apartment highlight 5"
                width={600}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority={false}
              />
            </div>
          </div>
        </div>
      </section>
      {/* Description at the bottom as before */}
      <section className="w-full flex justify-center mt-8">
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-3xl">
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
              culture, then retreat to the comfort of your modern apartment.
              Central am Bruckenthal is more than a place to stay; it&apos;s
              your home away from home in Romania.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}
