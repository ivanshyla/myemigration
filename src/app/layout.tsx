import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientRoot from "./ClientRoot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Белэміграцыя — колькі дзён ты ўжо па-за домам?",
    template: "%s — Белэміграцыя",
  },
  description:
    "Сайт-арта-лічыльнік: уводзіш дату адʼезду — атрымліваеш колькасць дзён і блізкі гістарычны прыклад.",
  openGraph: {
    title: "Белэміграцыя",
    description:
      "Колькі дзён у эміграцыі і хто з беларускіх дзеячаў мае падобны лёс?",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Белэміграцыя",
    description:
      "Колькі дзён у эміграцыі і гістарычны матчынг па прыкладзе беларускіх дзеячаў.",
    images: ["/api/og"],
  },
  metadataBase:
    typeof window === "undefined"
      ? new URL("https://myemigration.app")
      : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="be">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
