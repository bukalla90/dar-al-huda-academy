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
    default: "Dar Al Huda Online Quran Academy | Learn Quran Online",
    template: "%s - Dar Al Huda",
  },
  description: "Dar Al Huda Online Quran Academy offers professional Quran teaching with qualified teachers. Learn Tajweed, Hifz, Nazirah, Arabic, Fiqh, Hadith, Aqidah and Islamic Studies online from anywhere in the world.",
  keywords: [
    "online Quran academy",
    "learn Quran online",
    "Quran memorization",
    "Tajweed classes",
    "Hifz program",
    "Nazirah Quran reading",
    "Arabic language learning",
    "Islamic studies online",
    "Fiqh classes",
    "Hadith studies",
    "Aqidah learning",
    "Quran teacher online",
    "kids Quran classes",
    "Dar Al Huda Academy",
    "Ethiopian Quran academy",
    "online Islamic education",
  ],
  authors: [{ name: "Dar Al Huda Academy", url: "https://dar-al-huda-academy.vercel.app" }],
  creator: "Dar Al Huda Academy",
  publisher: "Dar Al Huda Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://dar-al-huda-academy.vercel.app"),
  icons: {
    icon: "/dar-al-huda-favicon.svg",
    shortcut: "/dar-al-huda-favicon.svg",
    apple: "/dar-al-huda-favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Dar Al Huda Academy",
    title: "Dar Al Huda Online Quran Academy | Learn Quran Online",
    description: "Professional online Quran teaching with qualified teachers. Learn Tajweed, Hifz, Nazirah, Arabic, and Islamic Studies from anywhere.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dar Al Huda Online Quran Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dar Al Huda Online Quran Academy",
    description: "Learn Quran online with expert teachers. Start your journey today.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Education",
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" type="image/svg+xml" href="/dar-al-huda-favicon.svg" />
        <link rel="apple-touch-icon" href="/dar-al-huda-favicon.svg" />
        <meta name="theme-color" content="#4F46E5" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-text">
        {children}
      </body>
    </html>
  );
}