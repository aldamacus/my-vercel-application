"use client";
import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobile && pathname === "/book-your-stay") {
      router.replace("/book-your-stay-mobile");
    }
    if (!isMobile && pathname === "/book-your-stay-mobile") {
      router.replace("/book-your-stay");
    }
  }, [pathname, router]);

  return (
    <html lang="en" className={fontSans.variable}>
      <head>
        <title>Central am Brukenthal | Historic Apartment in Sibiu</title>
        <meta
          name="description"
          content="Stay at Central am Brukenthal, a beautifully historic apartment in Sibiu Old Town. Perfect location, modern amenities, and authentic Transylvanian experience. Book now!"
        />
        <meta
          name="keywords"
          content="Sibiu cazare centru, Cazare ieftina Sibiu, Cazare lux Sibiu, Sibiu apartment, accommodation, old town, Central am Brukenthal, Romania, booking, historic stay"
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "Central am Brukenthal",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Samuel von Brukenthal, No. 1, Ap 6",
                "addressLocality": "Sibiu",
                "addressCountry": "RO"
              },
              "url": "https://www.centralambruckenthal.ro/"
            }
          `}
        </script>
      </head>
      <body className={`${fontSans.className} min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-1 w-full bg-neutral-50">{children}</div>
        <Footer />
        <Script
          src="https://www.anrdoezrs.net/am/101457820/include/allCj/exclude/5096493/impressions/page/am.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
