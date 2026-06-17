import type { Metadata } from "next";
import "./globals.css";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://solucionestecnologicasparatodos.com";

export const metadata: Metadata = {
  title: "Implementaciones de IA | Automatización para negocios",
  description:
    "Automatizamos procesos con IA, agentes para WhatsApp, Telegram y sistemas de atención 24/7 para negocios locales y pequeñas empresas.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "Implementaciones de IA",
    description:
      "Agentes IA, secretarías virtuales y automatizaciones para ahorrar tiempo, reducir costos y atender clientes 24/7.",
    images: ["/brand/hero-nodo-transformacion-negocio.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
