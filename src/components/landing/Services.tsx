import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

const services = [
  { title: "Agentes de IA", text: "Atiende preguntas, organiza conversaciones y acompaña a tus clientes con un asistente adaptado a tu negocio.", href: "/servicios/agentes" as const },
  { title: "Tarjetas de fidelidad", text: "Premia las visitas de tus clientes con una tarjeta digital de sellos y una recompensa creada por ti.", href: "/servicios/tarjetas" as const }
];

export function Services() {
  return <section id="servicios" className="section-pad bg-cloud"><div className="mx-auto max-w-7xl px-5 lg:px-8">
    <div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Servicios</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-ink md:text-5xl">Una solución para cada siguiente paso</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">Elige cómo quieres conectar mejor con tus clientes.</p></div><Link href="/servicios" className="font-bold text-ocean hover:text-ink">Ver todos los servicios <ArrowRight size={18} className="ml-1 inline" /></Link></div>
    <div className="mt-10 grid gap-5 md:grid-cols-2">{services.map((service, index) => <Link href={service.href} key={service.href} className="group flex min-h-[260px] flex-col rounded-2xl border border-line bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-ocean hover:shadow-panel"><span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-ink text-electric">{index === 0 ? <Image src="/brand/nodo-agent-icon.png" alt="" width={56} height={56} /> : <Gift size={27} />}</span><h3 className="mt-6 text-2xl font-black">{service.title}</h3><p className="mt-3 max-w-lg leading-7 text-slate-600">{service.text}</p><span className="mt-auto pt-6 text-sm font-black text-ocean">Conocer servicio <ArrowRight size={17} className="ml-1 inline transition group-hover:translate-x-1" /></span></Link>)}</div>
  </div></section>;
}
