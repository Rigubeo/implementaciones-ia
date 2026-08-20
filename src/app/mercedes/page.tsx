import type { Metadata, Viewport } from "next";
import { MercedesVoiceApp } from "@/components/mercedes/MercedesVoiceApp";

export const metadata: Metadata = {
  title: "Mercedes | Dictado clínico",
  description: "Sistema privado de dictado clínico por voz.",
  manifest: "/mercedes/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Mercedes",
    statusBarStyle: "black-translucent"
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  },
  robots: {
    index: false,
    follow: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#061225"
};

export default function MercedesPage() {
  return <MercedesVoiceApp />;
}
