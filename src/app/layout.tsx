import type { Metadata } from "next";
import "./globals.css";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://solucionestecnologicasparatodos.com";

export const metadata: Metadata = {
  title: "Soluciones Tecnológicas para Todos | IA y automatización",
  description:
    "Automatizamos procesos, atención al cliente, agendas y tareas administrativas con soluciones de IA y desarrollo web para negocios.",
  metadataBase: new URL(appUrl),
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  },
  openGraph: {
    title: "Soluciones Tecnológicas para Todos",
    description:
      "Agentes IA, secretarías virtuales, automatizaciones y páginas web para ahorrar tiempo, reducir costos y atender mejor a tus clientes.",
    images: ["/brand/hero-nodo-transformacion-negocio.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
