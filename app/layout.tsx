import type { Metadata, Viewport } from "next";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rsl-ai-fusion-tracker.app";
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RSL Fusion Tracker",
  applicationCategory: "GameApplication",
  operatingSystem: "Any",
  url: siteUrl,
  description:
    "AI-powered Raid: Shadow Legends fusion calendar tracker for events, tournaments, fragments, leaderboard rewards, and earned progress.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "RSL Fusion Tracker",
  title: {
    default: "RSL Fusion Tracker",
    template: "%s | RSL Fusion Tracker"
  },
  description:
    "Track Raid: Shadow Legends fusion events, tournaments, fragments, leaderboard rewards, and earned progress with an AI-powered fusion calendar timeline.",
  keywords: [
    "Raid Shadow Legends fusion tracker",
    "RSL fusion calendar",
    "Raid fusion schedule",
    "Raid Shadow Legends fragment tracker",
    "Folan Silverhart fusion",
    "Masahiro the Bell Monk fusion",
    "Raid tournament tracker",
    "Raid event tracker"
  ],
  authors: [{ name: "RSL Fusion Tracker" }],
  creator: "RSL Fusion Tracker",
  publisher: "RSL Fusion Tracker",
  category: "gaming",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "RSL Fusion Tracker",
    title: "RSL Fusion Tracker",
    description:
      "AI-powered Raid: Shadow Legends fusion calendar tracker for events, tournaments, fragments, and leaderboard rewards.",
    images: [
      {
        url: "/Folan Silverhart.webp",
        width: 1200,
        height: 630,
        alt: "RSL Fusion Tracker"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "RSL Fusion Tracker",
    description:
      "Track Raid: Shadow Legends fusion calendars, fragments, events, tournaments, and leaderboard rewards.",
    images: ["/Folan Silverhart.webp"]
  },
  appleWebApp: {
    capable: true,
    title: "RSL Fusion Tracker",
    statusBarStyle: "black-translucent"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
        <PwaInstallPrompt />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
