import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { siteConfig } from "@/config/site";

export default function WebsitesServicePage() {
  return <><Navbar /><main className="bg-cloud pt-36 lg:pt-32"><div className="mx-auto max-w-7xl px-5 pb-20 lg:px-8"><Link href="/servicios" className="text-sm font-bold text-ocean">← Servicios</Link><div className="grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-16"><div><h1 className="max-w-2xl text-4xl font-black leading-tight text-ink md:text-6xl">Tu idea merece un espacio propio en internet</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Creamos sitios web y aplicaciones personalizadas para mostrar tu negocio, conectar con tus clientes y dar forma a tus ideas.</p><div className="mt-8 flex flex-wrap gap-3"><a href={siteConfig.cta.whatsapp} className="inline-flex items-center gap-2 rounded-lg bg-ocean px-6 py-4 font-black text-white">Platiquemos de tu proyecto <ArrowRight size={19} /></a><Link href="/#portafolio" className="rounded-lg border border-line bg-white px-6 py-4 font-bold text-ink">Ver portafolio</Link></div></div><div className="overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-panel"><Image src="/portfolio/pepa-y-lola.png" alt="Sitio web de Pepa y Lola Café, uno de nuestros proyectos" width={1440} height={900} sizes="(max-width: 1024px) 100vw, 50vw" className="rounded-xl" /><a href="https://pepaylolacafe.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-ocean">Conocer Pepa &amp; Lola Café <ExternalLink size={15} /><span className="sr-only"> (abre en otra pestaña)</span></a></div></div></div></main><Footer /></>;
}
