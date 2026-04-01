import Link from "next/link";

const areas = [
  {
    name: "Cisnădioara",
    description:
      "A picturesque Saxon village at the foot of the Cindrel Mountains, famous for its medieval fortress, cobbled streets, and tranquil rural setting.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=Cisnadioara%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1156249&dest_type=city&place_id=city%2F-1156249",
  },
  {
    name: "Rășinari",
    description:
      "A charming mountain village known for its traditional houses, cheese, and beautiful hiking trails through forests and meadows.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=Rasinari%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1156248&dest_type=city&place_id=city%2F-1156248",
  },
  {
    name: "Păltiniș",
    description:
      "Romania’s oldest mountain resort, ideal for hiking in summer and skiing in winter, surrounded by forests and fresh mountain air.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=Paltinis%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1156243&dest_type=city&place_id=city%2F-1156243",
  },
  {
    name: "Gura Râului",
    description:
      "A peaceful village near the mountains and lakes, perfect for nature lovers, fishing, and outdoor activities.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=Gura+R%C3%A2ului%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1156244&dest_type=city&place_id=city%2F-1156244",
  },
  {
    name: "Săliște",
    description:
      "A traditional town with rich folklore, close to the Transalpina road and scenic landscapes of Mărginimea Sibiului.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=S%C4%83li%C8%99te%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1156245&dest_type=city&place_id=city%2F-1156245",
  },
  {
    name: "Orlat",
    description:
      "A historic village with beautiful Orthodox churches and easy access to hiking and cycling routes.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=Orlat",
  },
  {
    name: "Tilișca",
    description:
      "A scenic village with ancient Dacian ruins, traditional architecture, and panoramic views of the Cindrel Mountains.",
    link: "https://www.booking.com/searchresults.en-gb.html?ss=Tili%C8%99ca%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1163384&dest_type=city&place_id=city%2F-1163384",
  },
];

export default function County() {
  return (
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <p className="mb-4 text-lg text-neutral-600">
        Explore the beautiful landscapes, rich history, and vibrant culture of
        Sibiu County.
      </p>
      <p className="mb-4 text-lg text-neutral-600">
        From the stunning Carpathian Mountains to the charming medieval towns,
        Sibiu County offers a unique blend of natural beauty and cultural
        heritage.
      </p>
      <p className="mb-4 text-lg text-neutral-600">
        Whether you&apos;re interested in hiking, exploring historical sites, or
        enjoying local cuisine, there&apos;s something for everyone in Sibiu
        County.
      </p>

      <p className="mb-4 text-lg text-neutral-600">
        <span className="font-semibold text-neutral-900">Sibiu County</span> is known for its
        picturesque villages, fortified churches, and vibrant cultural
        festivals. Don&apos;t miss the chance to experience the warmth and
        hospitality of the local communities.
      </p>
      <p className="mb-4 text-lg text-neutral-600">
        Whether you&apos;re here for a short visit or planning a longer stay,
        Sibiu County promises an unforgettable experience filled with adventure
        and discovery.
      </p>
      <main className="w-full max-w-4xl mx-auto py-10 px-4">
        <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Explore villages & areas around Sibiu
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-neutral-600">
          Discover the most beautiful villages and mountain resorts near Sibiu.
          Book your stay in the countryside and experience authentic
          Transylvanian hospitality!
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Fantanele */}
          <div className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                Fântânele
              </h2>
              <p className="mb-4 text-neutral-600">
                A quiet village surrounded by rolling hills and forests, perfect
                for a peaceful rural escape and hiking.
              </p>
            </div>
            <Link
              href="https://www.booking.com/searchresults.en-gb.html?ss=Fantanele"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block rounded-lg bg-primary px-5 py-2 text-center text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              Discover
            </Link>
          </div>
          {/* Cisnădie */}
          <div className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                Cisnădie
              </h2>
              <p className="mb-4 text-neutral-600">
                A small town with a beautiful fortified church, colorful houses,
                and a relaxed atmosphere just south of Sibiu.
              </p>
            </div>
            <Link
              href="https://www.booking.com/searchresults.en-gb.html?ss=Cisnadie%2C+Sibiu+County%2C+Romania&src_elem=sb&src=index&dest_id=-1156247&dest_type=city&place_id=city%2F-1156247"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block rounded-lg bg-primary px-5 py-2 text-center text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              Discover
            </Link>
          </div>
          {/* Dynamic Booking.com areas */}
          {areas.map((area) => (
            <div
              key={area.name}
              className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div>
                <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                  {area.name}
                </h2>
                <p className="mb-4 text-neutral-600">{area.description}</p>
              </div>
              <Link
                href={area.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-block rounded-lg bg-primary px-5 py-2 text-center text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
              >
                Discover
              </Link>
            </div>
          ))}
          {/* Balea */}
          <div className="flex h-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <h2 className="mb-2 text-xl font-semibold text-neutral-900">
                Bâlea Lac & Transfăgărășan
              </h2>
              <p className="mb-4 text-neutral-600">
                Experience the breathtaking Bâlea Lake, nestled high in the
                Făgăraș Mountains and accessible via the famous Transfăgărășan
                road—one of the most spectacular alpine drives in the world.
                Perfect for mountain adventures, hiking, and stunning scenery.
              </p>
            </div>
            <Link
              href="https://www.booking.com/searchresults.en-gb.html?ss=Balea+Lac"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block rounded-lg bg-primary px-5 py-2 text-center text-base font-semibold text-primary-foreground shadow-sm transition hover:opacity-95"
            >
              Discover
            </Link>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-neutral-500">
          Affiliate links: Booking.com &copy; {new Date().getFullYear()}
        </p>
      </main>
    </div>
  );
}
