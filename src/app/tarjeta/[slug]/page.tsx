import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Gift } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { EmailAccess } from "@/components/loyalty/EmailAccess";
import { joinCard, switchCardEmail } from "./actions";

export const dynamic = "force-dynamic";
const colors: Record<string, [string, string]> = { profesional: ["#031d4f", "#0758ed"], moderno: ["#26374c", "#567da5"], fresco: ["#00684f", "#04b88b"], calido: ["#482083", "#9963ee"], minimalista: ["#273343", "#8291a5"] };

export default async function CardPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const business = await prisma.loyaltyBusiness.findFirst({ where: { slug, active: true }, include: { programs: { where: { active: true }, take: 1, orderBy: { createdAt: "asc" } } } });
  const program = business?.programs[0];
  if (!business || !program) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const card = user?.email_confirmed_at ? await prisma.loyaltyCard.findUnique({ where: { programId_userId: { programId: program.id, userId: user.id } }, include: { events: { select: { stampsDelta: true } } } }) : null;
  const stamps = Math.max(0, card?.events.reduce((sum, event) => sum + event.stampsDelta, 0) ?? 0);
  const [background, accent] = colors[program.theme] ?? colors.profesional;
  return <main className="min-h-screen bg-slate-50 px-5 py-10"><div className="mx-auto max-w-xl"><Link href="/" className="flex items-center gap-3 text-sm font-black text-ink"><Image src="/brand/logo-implementaciones-ia.png" alt="" width={40} height={40} className="rounded-full" /> Soluciones Tecnológicas para Todos</Link><div className="mt-8 overflow-hidden rounded-3xl bg-white shadow-panel"><div className="p-7 text-white" style={{ backgroundColor: background }}><p className="text-sm text-white/70">Tarjeta de fidelidad</p><h1 className="mt-2 text-3xl font-black">{business.name}</h1><p className="mt-4 text-white/80">Cada visita te acerca a tu premio.</p></div><div className="p-7"><div className="flex justify-between gap-2"><h2 className="text-lg font-black">Tus sellos</h2><span className="text-sm font-bold text-slate-500">{card ? `${stamps} de ${program.stampsRequired}` : "Tu tarjeta"}</span></div><div className="mt-5 flex flex-wrap gap-3">{Array.from({ length: program.stampsRequired }, (_, i) => <span key={i} className="flex h-11 w-11 items-center justify-center rounded-full border-2" style={{ borderColor: i < stamps ? accent : "#d6e0ec", background: i < stamps ? accent : "#f8fafc", color: "white" }}>{i < stamps && <Check size={22} />}</span>)}</div><div className="mt-6 flex gap-3 rounded-xl bg-blue-50 p-4"><Gift className="shrink-0 text-ocean" /><p><strong>Tu recompensa</strong><br /><span className="text-sm text-slate-600">{program.reward}</span></p></div>{program.promotion && <p className="mt-4 text-sm font-bold text-ocean">{program.promotion}</p>}
    {!user ? <EmailAccess cardPath={`/tarjeta/${slug}`} /> : !card ? <form action={joinCard} className="mt-6"><input type="hidden" name="slug" value={slug} /><p className="mb-3 text-sm text-slate-600">Tu tarjeta se vinculará a {user.email}.</p><button className="w-full rounded-lg bg-ocean px-4 py-3 font-bold text-white">Registrar mi tarjeta</button></form> : <p className="mt-6 text-sm text-slate-600">Tarjeta vinculada a {user.email}</p>}
    {card && <div className="mt-6 rounded-xl border border-slate-200 p-5 text-center"><p className="font-black">Tu código QR</p><p className="mt-1 text-sm text-slate-600">Muéstralo al negocio para registrar tu visita.</p><div className="mt-4 flex justify-center"><QRCodeSVG value={`STPTT:LOYALTY:1:${card.id}`} size={180} marginSize={4} title="Código QR de tu tarjeta de fidelidad" /></div></div>}
    {user && <form action={switchCardEmail} className="mt-3"><input type="hidden" name="slug" value={slug} /><button className="text-sm font-bold text-ocean underline">Usar otro correo</button></form>}
  </div></div></div></main>;
}
