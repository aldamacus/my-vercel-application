"use client";

import Image from "next/image";

const areaData = [
  {
    title: "Oldies (Pub) but Goldies",
    img: "/oldies.jpg",
    desc: "Oldies Pub in Sibiu is one of the city’s most iconic nightlife spots, famous for its vibrant atmosphere and great music. Located right in the heart of the old town, Oldies is known for its retro-themed parties, live concerts, and energetic DJ nights that keep the dance floor packed until morning.",
    map: "https://maps.app.goo.gl/4NFaxSGKNhdwydpB7",
  },
  {
    title: "Crama Sibiana",
    img: "/cramasibiana.jpg",
    desc: "Crama Sibiana is a beloved traditional restaurant located right in Sibiu’s historic center. Step into a cozy, vaulted cellar and enjoy authentic Romanian cuisine, hearty stews, grilled meats, and local wines. The friendly staff and live folk music create a warm, unforgettable atmosphere—perfect for a true taste of Transylvania.",
    map: "https://maps.app.goo.gl/6Qn1Qn1Qn1Qn1Qn1A",
  },
  {
    title: "Pardon Café & Bistro",
    img: "/pardon-by-night.jpg",
    desc: "Pardon Café & Bistro is a chic spot with a leafy terrace, creative cocktails, and a menu blending Romanian and international flavors. Enjoy brunch, coffee, or a romantic dinner in a stylish setting with live music nights.",
    map: "https://maps.app.goo.gl/U2ZFXctVRs2ShM6T6",
  },
  {
    title: "Kulinarium",
    img: "/kulinarium.jpg",
    desc: "Kulinarium offers elegant dining with a view of the Small Square. Savor Transylvanian specialties, fine wines, and a stylish, historic ambiance. Perfect for a special night out in Sibiu.",
    map: "https://maps.app.goo.gl/ZqdaVnCDdKbPfjkQ6",
  },
  {
    title: "La Turn",
    img: "/laturn.jpg",
    desc: "La Turn is an iconic restaurant at the Council Tower, offering panoramic views and a menu of local classics. Try the papanasi for dessert and enjoy the lively square below.",
    map: "https://maps.app.goo.gl/J6mPrcX5WXprxLZD8",
  },
  {
    title: "Benjamin Steakhouse & Bar",
    img: "/benjamin.jpg",
    desc: "Benjamin Steakhouse & Bar is a carnivore’s paradise with premium steaks, craft beers, and a lively vibe. Great for groups, celebrations, and anyone craving a hearty meal.",
    map: "https://maps.app.goo.gl/JkXfKMDmoc4CPhx88",
  },
  {
    title: "Hermania",
    img: "/hermania.jpg",
    desc: "Hermania is a well-loved restaurant in Sibiu, Romania, known for its inviting atmosphere and authentic Transylvanian-Saxon cuisine. Located in a beautifully restored historic building, Hermania offers a menu that highlights traditional German and Romanian dishes.",
    map: "https://maps.app.goo.gl/DfSwnJMEYDqyxqys6",
  },
  {
    title: "Cafe Wien",
    img: "/cafewien.jpg",
    desc: "Cafe Wien brings a slice of Vienna to Sibiu. Enjoy strudel, coffee, and classical music on the terrace overlooking the city walls. A must for dessert lovers.",
    map: "https://maps.app.goo.gl/L2qBcr7oWtZURFD7A",
  },
  {
    title: "Old City Walls",
    img: "/walls.jpg",
    desc: "Stroll along Sibiu’s medieval fortifications, climb the towers, and soak in centuries of history and stunning city views. Great for a scenic walk.",
    map: "https://maps.app.goo.gl/raMcpgpKZYD3nUWj7",
  },
  {
    title: "Bridge of Lies",
    img: "/bridge.jpg",
    desc: "Legend says the Bridge of Lies will creak if you tell a lie while crossing. A must-see photo spot and a symbol of Sibiu’s charm and folklore.",
    map: "https://maps.app.goo.gl/oejEDABkTLuK7H2H6",
  },
  {
    title: "ASTRA Museum",
    img: "/astra.jpg",
    desc: "The ASTRA Museum is Romania’s largest open-air museum, with traditional houses, windmills, and crafts set in a beautiful forest park. Perfect for families and culture lovers.",
    map: "https://maps.app.goo.gl/dnmq5NxDTZcoHLCX9",
  },
  {
    title: "Piata Mare (Great Square)",
    img: "/piata.jpg",
    desc: "Piata Mare is the vibrant heart of Sibiu, surrounded by colorful baroque buildings, lively cafes, and frequent festivals. The perfect place to people-watch and soak up the city’s energy.",
    map: "https://maps.app.goo.gl/ewHMDAMBAX4izNWD8",
  },
  {
    title: "Brukenthal Palace",
    img: "/palace.jpg",
    desc: "Brukenthal Palace is home to one of Eastern Europe’s oldest art museums. Admire masterpieces, stroll the elegant palace gardens, and discover Sibiu’s rich cultural heritage.",
    map: "https://maps.app.goo.gl/JwW6iAJQPoBvYB7T7",
  },
  {
    title: "Sub Arini Park",
    img: "/arini.jpg",
    desc: "Sub Arini Park is a green oasis for jogging, picnics, or a peaceful walk among ancient trees and playful squirrels. A favorite for locals and visitors alike.",
    map: "https://maps.app.goo.gl/N4mKuwccUPtmACeu9",
  },
  {
    title: "The Stairs Passage",
    img: "/stairs.jpg",
    desc: "The Stairs Passage is a winding set of steps connecting the Upper and Lower Towns, lined with charming houses and hidden cafes. A picturesque shortcut through history.",
    map: "https://maps.app.goo.gl/NXGX233CKXubeLNu7",
  },
  {
    title: "Sibiu Festivals",
    img: "/teatru.jpg",
    desc: "Sibiu, Romania hosts several vibrant summer festivals, including the Sibiu International Theatre Festival (FITS)—one of Europe’s largest performing arts events, the Sibiu Jazz Festival with world-class open-air concerts, ARTmania Rock Festival for rock and metal fans, and the Astra Film Festival celebrating documentary cinema. These festivals fill the city with music, art, and culture all summer long.Every summer, Sibiu swings to the sound of world-class jazz. Open-air concerts and a festive atmosphere for all ages make this a highlight of the city s cultural calendar.",
    map: "http://www.sibiu-turism.ro/Ce-facem-Evenimente-Targuri-si-festivaluri.aspx",
  },
];

export default function InTheArea() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-neutral-50 px-4 py-12 md:px-16">
      <div className="grid w-full max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {areaData.map((item, i) => (
          <div
            key={i}
            className="group flex flex-col items-center rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-transform hover:scale-[1.02]"
          >
            <a
              href={item.map}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Image
                src={item.img}
                alt={item.title}
                width={340}
                height={220}
                className="mb-3 h-48 w-full rounded-xl object-cover shadow-sm transition-opacity hover:opacity-90"
              />
            </a>
            <div className="mb-2 text-center text-xl font-semibold text-neutral-900">
              {item.title}
            </div>
            <div className="max-h-0 overflow-hidden rounded-xl bg-neutral-100 p-0 text-center text-base text-neutral-600 opacity-0 shadow-inner transition-all duration-500 group-hover:max-h-96 group-hover:py-4 group-hover:opacity-100">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
