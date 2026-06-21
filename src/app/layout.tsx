// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dar Al Huda Online Quran Academy",
    template: "%s - Dar Al Huda",
  },
  description: "Learn Quran online with qualified teachers. Tajweed, Hifz, Arabic Reading, and Islamic Studies for students worldwide.",
  keywords: ["Quran", "online learning", "Tajweed", "Hifz", "Islamic studies", "Arabic", "Quran academy"],
  authors: [{ name: "Dar Al Huda Academy" }],
  creator: "Dar Al Huda Academy",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daralhuda.com",
    siteName: "Dar Al Huda Online Quran Academy",
    title: "Dar Al Huda Online Quran Academy",
    description: "Learn Quran online with qualified teachers. Tajweed, Hifz, Arabic Reading, and Islamic Studies.",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoNaskhArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-text">
        {children}
      </body>
    </html>
  );
}