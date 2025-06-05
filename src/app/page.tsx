"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [expanded, setExpanded] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);

  // Close expanded photo on Escape key
  useEffect(() => {
    if (!expandedPhoto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpandedPhoto(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedPhoto]);

  // Only 5 images in total, distributed as described
  return (
    <main className="pt-1 items-baseline justify-between bg-white">
      {/* ...gallery section... */}
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
                Beautifully historic apartment in downtown
              </div>
              <div>
                Samuel von Brukenthal, No. 1, Ap 6, Sibiu Old Town, Sibiu,
                Romania
                <br />
                <a
                  href="https://maps.app.goo.gl/n9sN3Bf35QJsCd2Y9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline hover:text-blue-900 font-semibold"
                >
                  Excellent location – show map
                </a>
              </div>
            </div>
          </div>
          {/* First column: one large image */}
          <div className="col-span-1 flex flex-col gap-4">
            <div
              className="w-full h-[36rem] rounded-xl overflow-hidden shadow-2xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl cursor-pointer"
              onClick={() => setExpandedPhoto("/163426986.jpg")}
            >
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
            <div
              className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl cursor-pointer"
              onClick={() => setExpandedPhoto("/163308132.jpg")}
            >
              <Image
                src="/163308132.jpg"
                alt="Apartment highlight 2"
                width={600}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority={false}
              />
            </div>
            <div
              className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl cursor-pointer"
              onClick={() => setExpandedPhoto("/175330372.jpg")}
            >
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
            <div
              className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl cursor-pointer"
              onClick={() => setExpandedPhoto("/175330474.jpg")}
            >
              <Image
                src="/175330474.jpg"
                alt="Apartment highlight 4"
                width={600}
                height={400}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                priority={false}
              />
            </div>
            <div
              className="w-full h-72 rounded-xl overflow-hidden shadow-xl bg-white flex items-center justify-center group transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl cursor-pointer"
              onClick={() => setExpandedPhoto("/175330495.jpg")}
            >
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
        {/* Expanded photo modal */}
        {expandedPhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setExpandedPhoto(null)}
          >
            <div
              className="relative max-w-3xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition"
                onClick={() => setExpandedPhoto(null)}
                aria-label="Close expanded photo"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-700"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <Image
                src={expandedPhoto}
                alt="Expanded apartment photo"
                width={900}
                height={700}
                className="rounded-xl shadow-2xl object-contain max-h-[80vh] w-auto h-auto"
                priority
              />
            </div>
          </div>
        )}
      </section>
      {/* Description at the bottom as before */}
      <section className="flex justify-center w-full">
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-7xl w-full">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            A Home in the Heart of the City
          </h2>
          <div className="relative">
            <p
              className={`text-lg text-gray-700 mb-4 max-w-xl transition-all duration-300 ease-in-out ${
                expanded ? "" : "max-h-[10rem] overflow-hidden line-clamp-2"
              }`}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: expanded ? "none" : 10,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              Welcome to Central am Brukenthal, your cozy haven set in the
              enchanting heart of Sibiu&apos;s Old Town. Here, you&apos;ll find
              an inviting atmosphere that feels just like home. As the summer
              heat envelops the city, our apartment remains a refreshing
              retreat, maintaining a perfect temperature that ensures a
              comfortable night&apos;s sleep, even on the warmest of evenings.
              <br />
              <br />
              Imagine unwinding on your private terrace, sipping a cool drink
              while soaking in the lively ambiance of the bustling streets
              below. With fast and free WiFi, you can easily share your
              delightful experiences with friends and family or catch up on your
              favorite shows on the flat-screen TV after a day of exploration.
              <br />
              <br />
              Our beautifully renovated space boasts a warm and cozy bedroom
              that invites rest, alongside a modern bathroom stocked with
              complimentary toiletries and a hairdryer. The fully equipped
              kitchen is perfect for whipping up a casual meal to enjoy at your
              own pace.
            </p>
            {!expanded && (
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            )}
            <button
              className="text-blue-700 font-semibold underline hover:text-blue-900 transition-colors mt-2"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          </div>
          <br />
          <br />

          <h3 className="text-2xl font-semibold mb-4 text-blue-700">
            About this property
          </h3>
          <p className="text-lg text-gray-700">
            About this property Reliable info: Guests say the description and
            photos for this property are very accurate.
            <strong className="block mt-2 mb-1">
              Comfortable Living Space:
            </strong>
            Central am Brukenthal in Sibiu offers a one-bedroom apartment with a
            terrace and free WiFi. The ground-floor unit features a kitchenette,
            dining area, and a sofa bed.
            <strong className="block mt-2 mb-1">Modern Amenities:</strong>
            Guests enjoy a fully equipped kitchen with a refrigerator, stovetop,
            microwave, and coffee machine. Additional amenities include a
            terrace, patio, outdoor furniture, and a dining table.
            <strong className="block mt-2 mb-1">Convenient Location:</strong>
            Located 2.5 mi from Sibiu International Airport, the apartment is
            near attractions such as The Stairs Passage (a few steps), The
            Council Tower of Sibiu (3-minute walk), and Piata Mare Sibiu (656
            feet). Highly rated for its central location and room cleanliness.
          </p>
        </div>
      </section>
    </main>
  );
}
