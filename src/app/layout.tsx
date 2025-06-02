import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        <div className="bg-amber-100 py-23">{children}</div>
        <Footer></Footer>
      </body>
    </html>
  );
}
