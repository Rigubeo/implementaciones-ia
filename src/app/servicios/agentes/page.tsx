import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { siteConfig } from "@/config/site";

export default function AgentsPage() {
  return <><Navbar /><main className="mx-auto grid min-h-[75vh] max-w-7xl items-center gap-12 px-5 pb-20 pt-40 lg:grid-cols-2 lg:px-8"><div><Link href="/servicios" className="text-sm font-bold text-ocean">← Servicios</Link><h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">Un agente de IA que acompaña a tus clientes</h1><p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">Responde preguntas frecuentes, organiza conversaciones y canaliza las solicitudes importantes para que tu equipo pueda concentrarse en lo que más importa.</p><a href={siteConfig.cta.whatsapp} className="mt-8 inline-flex rounded-lg bg-ocean px-6 py-4 font-bold text-white">Quiero conocer más</a></div><Image src="/brand/nodo-chat-telegram.png" alt="Nodo, asistente de inteligencia artificial" width={800} height={800} className="max-h-[500px] w-full rounded-3xl object-cover" /></main><Footer /></>;
}
