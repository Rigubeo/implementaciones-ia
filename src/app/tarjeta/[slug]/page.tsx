import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Gift } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { prisma } from "@/lib/db";
import { getCardholderEmail } from "@/lib/loyalty-session";
import { EmailAccess } from "@/components/loyalty/EmailAccess";
import { joinCard, switchCardEmail } from "./actions";

export const dynamic = "force-dynamic";
const colors: Record<string, [string, string]> = { profesional: ["#031d4f", "#0758ed"], moderno: ["#26374c", "#567da5"], fresco: ["#00684f", "#04b88b"], calido: ["#482083", "#9963ee"], minimalista: ["#273343", "#8291a5"] };

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.loyaltyBusiness.findFirst({ where: { slug, active: true }, include: { programs: { where: { active: true }, take: 1, orderBy: { createdAt: "asc" } } } });
  const program = business?.programs[0];
  if (!business || !program) notFound();
  const email = await getCardholderEmail();
  const card = email ? await prisma.loyaltyCard.findUnique({ where: { programId_holderEmail: { programId: program.id, holderEmail: email } }, include: { events: { select: { stampsDelta: true } } } }) : null;
  const stamps = Math.max(0, card?.events.reduce((sum, event) => sum + event.stampsDelta, 0) ?? 0);
  const [background, accent] = colors[program.theme] ?? colors.profesional;
  return <main className="min-h-screen bg-[#f4f7fc] px-5 py-8 text-ink sm:py-12"><div className="mx-auto max-w-xl">
    <Link href="/" className="inline-flex items-center gap-3 text-sm font-black"><Image src="/brand/logo-implementaciones-ia.png" alt="" width={40} height={40} className="rounded-full" /> Soluciones Tecnológicas para Todos</Link>
    <div className="mt-9 flex items-center justify-between gap-3"><Link href="/mis-tarjetas" className="text-sm font-bold text-ocean">← Mis tarjetas</Link>{card && <span className="text-xs font-semibold text-slate-500">Tu tarjeta digital</span>}</div>
    <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-panel"><div className="px-7 py-8 text-white sm:px-9" style={{ backgroundColor: background }}><p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70">Tarjeta de fidelidad</p><h1 className="mt-3 break-words text-3xl font-black tracking-tight">{business.name}</h1><p className="mt-3 text-sm leading-6 text-white/75">Cada visita te acerca a tu premio.</p></div>
      <div className="p-7 sm:p-9"><div className="flex items-center justify-between gap-2"><h2 className="text-lg font-black">Tus sellos</h2><span className="text-sm font-bold text-slate-500">{card ? `${stamps} de ${program.stampsRequired}` : `0 de ${program.stampsRequired}`}</span></div><div className="mt-5 flex flex-wrap gap-3" aria-label={`${stamps} de ${program.stampsRequired} sellos`}>{Array.from({ length: program.stampsRequired }, (_, i) => <span key={i} className="flex h-11 w-11 items-center justify-center rounded-full border-2" style={{ borderColor: i < stamps ? accent : "#d6e0ec", background: i < stamps ? accent : "#f8fafc", color: "white" }}>{i < stamps && <Check size={22} />}</span>)}</div>
        <div className="mt-7 flex gap-3 rounded-2xl bg-slate-50 p-4"><Gift className="shrink-0" style={{ color: accent }} /><p><strong>Tu recompensa</strong><br /><span className="text-sm leading-6 text-slate-600">{program.reward}</span></p></div>{program.promotion && <p className="mt-4 text-sm font-bold" style={{ color: accent }}>{program.promotion}</p>}
        {!email ? <EmailAccess slug={slug} /> : !card ? <form action={joinCard} className="mt-6"><input type="hidden" name="slug" value={slug} /><p className="mb-3 break-all text-sm text-slate-600">Tu tarjeta se vinculará a {email}.</p><button className="w-full rounded-xl px-4 py-3 font-bold text-white" style={{ backgroundColor: accent }}>Registrar mi tarjeta</button></form> : <p className="mt-6 break-all text-sm text-slate-500">Vinculada a {email}</p>}
        {card && <div className="mt-6 border-t border-line pt-6 text-center"><p className="font-black">Muestra tu código</p><p className="mt-1 text-sm text-slate-600">El negocio lo escaneará para registrar tu visita.</p><div className="mt-4 flex justify-center"><QRCodeSVG value={`STPTT:LOYALTY:1:${card.id}`} size={180} marginSize={4} title="Código QR de tu tarjeta de fidelidad" /></div></div>}
        {email && <form action={switchCardEmail} className="mt-4 text-center"><input type="hidden" name="slug" value={slug} /><button className="text-sm font-bold text-ocean underline">Usar otro correo</button></form>}
      </div></div>
  </div></main>;
}
