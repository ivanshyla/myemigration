import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientRoot from "./ClientRoot";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Base URL for absolute OpenGraph/Twitter images
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
// Use a simple JPEG without spaces in the name to satisfy FB/X scrapers
const defaultOg = `${baseUrl}/og-simple.jpeg`;

export const metadata: Metadata = {
  title: {
    default: "Белэміграцыя — колькі дзён ты ўжо па-за домам?",
    template: "%s — Белэміграцыя",
  },
  description:
    "Сайт-арта-лічыльнік: уводзіш дату адʼезду — атрымліваеш колькасць дзён і блізкі гістарычны прыклад.",
            icons: {
            icon: [
              { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
              { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
              { url: "/favicon.ico", sizes: "16x16", type: "image/x-icon" },
            ],
            shortcut: "/favicon.ico",
            apple: "/favicon.ico",
          },
  openGraph: {
    title: "Белэміграцыя",
    description:
      "Колькі дзён у эміграцыі і хто з беларускіх дзеячаў мае падобны лёс?",
    type: "website",
    images: [{ url: defaultOg, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Белэміграцыя",
    description:
      "Колькі дзён у эміграцыі і гістарычны матчынг па прыкладзе беларускіх дзеячаў.",
    images: [defaultOg],
  },
  metadataBase: new URL(baseUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="be">
      <head>
        <link rel="icon" href="/belarus-outline.jpg?v=2" type="image/jpeg" />
        <link rel="shortcut icon" href="/belarus-outline.jpg?v=2" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/belarus-outline.jpg?v=2" type="image/jpeg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientRoot>
          <header className="sticky top-0 z-10 backdrop-blur bg-white/40 border-b border-black/5">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
              <Image src="/belarus-outline.jpg" alt="Белэміграцыя" width={20} height={20} className="sm:w-6 sm:h-6 rounded-sm" />
              <span className="text-xs sm:text-sm font-medium">Белэміграцыя</span>
            </div>
          </header>
          {children}
        </ClientRoot>
      </body>
    </html>
  );
}
