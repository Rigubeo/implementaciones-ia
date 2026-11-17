import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Ticket, WalletCards } from "lucide-react";
import { EmailAccess } from "@/components/loyalty/EmailAccess";
import { prisma } from "@/lib/db";
import { getCardholderEmail } from "@/lib/loyalty-session";
import { signOutCardholder } from "./actions";

export const dynamic = "force-dynamic";

export default async function MyCardsPage() {
  const email = await getCardholderEmail();
  const cards = email ? await prisma.loyaltyCard.findMany({
    where: { holderEmail: email, program: { active: true, business: { active: true } } },
    orderBy: { createdAt: "desc" },
    select: { id: true, events: { select: { stampsDelta: true } }, program: { select: { reward: true, stampsRequired: true, business: { select: { name: true, slug: true } } } } }
  }) : [];

  return <main className="min-h-screen bg-[#f4f7fc] px-5 py-8 text-ink sm:py-12"><div className="mx-auto max-w-3xl">
    <Link href="/" className="inline-flex items-center gap-3 text-sm font-black"><Image src="/brand/logo-implementaciones-ia.png" width={42} height={42} alt="" className="rounded-full" /><span>Soluciones Tecnológicas para Todos</span></Link>
    <div className="mt-10 sm:mt-14"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-ocean"><WalletCards size={24} /></div><h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">Mis tarjetas</h1><p className="mt-3 max-w-xl leading-7 text-slate-600">Tus visitas, recompensas y códigos QR en un solo lugar.</p></div>
    {!email ? <div className="mt-8 rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-black">Entra con tu correo</h2><p className="mt-2 text-sm leading-6 text-slate-600">Escribe tu correo dos veces para acceder a tus tarjetas. No necesitas contraseña.</p><EmailAccess /></div> : <>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><p className="break-all text-sm text-slate-500">Correo: {email}</p><form action={signOutCardholder}><button className="text-sm font-bold text-ocean underline">Usar otro correo</button></form></div>
      {cards.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2">{cards.map((card) => { const stamps = Math.max(0, card.events.reduce((sum, event) => sum + event.stampsDelta, 0)); return <Link key={card.id} href={`/tarjeta/${card.program.business.slug}` as `/tarjeta/${string}`} className="group rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-ocean hover:shadow-panel"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-ocean"><Ticket size={21} /></div><ArrowUpRight size={20} className="text-slate-400 group-hover:text-ocean" /></div><h2 className="mt-5 text-xl font-black">{card.program.business.name}</h2><p className="mt-2 text-sm text-slate-600">{stamps} de {card.program.stampsRequired} sellos</p><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-ocean" style={{ width: `${Math.min(100, (stamps / card.program.stampsRequired) * 100)}%` }} /></div><p className="mt-4 text-sm text-slate-500">Recompensa: {card.program.reward}</p></Link>})}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-7"><h2 className="text-xl font-black">Aún no tienes tarjetas</h2><p className="mt-2 leading-7 text-slate-600">Pide al negocio su enlace de registro para añadir tu primera tarjeta.</p></div>}
    </>}
  </div></main>;
}
