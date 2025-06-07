"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Script from "next/script";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Device detection and redirect logic
  if (typeof window !== "undefined") {
    const router = require("next/navigation").useRouter();
    const pathname = require("next/navigation").usePathname();
    useEffect(() => {
      const isMobile =
        typeof window !== "undefined" &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      if (
        isMobile &&
        pathname === "/book-your-stay" &&
        typeof window !== "undefined"
      ) {
        router.replace("/book-your-stay-mobile");
      }
      if (
        !isMobile &&
        pathname === "/book-your-stay-mobile" &&
        typeof window !== "undefined"
      ) {
        router.replace("/book-your-stay");
      }
    }, [pathname]);
  }

  return (
    <html lang="en" className={inter.className}>
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
        {/* ...other head tags... */}
      </head>
      <body>
        <Header />
        <div className="bg-white-100">{children}</div>
        <Footer></Footer>
        {/* Enable Deep Link Automation for your site */}
        <Script
          src="https://www.anrdoezrs.net/am/101457820/include/allCj/exclude/5096493/impressions/page/am.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
