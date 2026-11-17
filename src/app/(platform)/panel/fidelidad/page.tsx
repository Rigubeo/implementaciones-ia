import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { LoyaltyEditor } from "@/components/loyalty/LoyaltyEditor";
import { StampForm } from "@/components/loyalty/StampForm";
import { QrScanner } from "@/components/loyalty/QrScanner";
import { ShareCardLink } from "@/components/loyalty/ShareCardLink";

export const dynamic = "force-dynamic";

export default async function LoyaltyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const business = user ? await prisma.loyaltyBusiness.findFirst({
    where: { client: { userId: user.id } },
    orderBy: { createdAt: "asc" },
    include: { programs: { orderBy: { createdAt: "asc" }, take: 1 } }
  }) : null;
  const program = business?.programs[0];
  const cards = program ? await prisma.loyaltyCard.findMany({ where: { programId: program.id }, orderBy: { createdAt: "desc" }, take: 50, select: { id: true, holderEmail: true, events: { select: { stampsDelta: true } } } }) : [];
  const totalCards = program ? await prisma.loyaltyCard.count({ where: { programId: program.id } }) : 0;
  return <><LoyaltyEditor initial={{ businessName: business?.name ?? "Tu negocio", reward: program?.reward ?? "Tu recompensa especial", promotion: program?.promotion ?? "", stampsRequired: program?.stampsRequired ?? 8, theme: program?.theme ?? "profesional" }} />{business && program ? <div className="mx-auto mt-8 max-w-7xl space-y-5"><div className="rounded-2xl border border-line bg-white p-6"><h2 className="text-xl font-black">Enlace para tus clientes</h2><p className="mt-2 text-sm text-slate-600">Comparte este enlace para que puedan registrar su tarjeta con su correo.</p><ShareCardLink slug={business.slug} /></div><div className="rounded-2xl border border-line bg-white p-6"><h2 className="text-xl font-black">Registrar una visita</h2><p className="mt-2 text-sm text-slate-600">Escanea el código QR de la tarjeta y confirma el sello.</p><QrScanner /><details className="mt-6 border-t border-line pt-4"><summary className="cursor-pointer text-sm font-bold text-ocean">Buscar por correo o canjear un premio</summary><StampForm /></details></div><div className="rounded-2xl border border-line bg-white p-6"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black">Clientes con tarjeta</h2><span className="text-sm font-bold text-slate-500">{totalCards} {totalCards === 1 ? "tarjeta" : "tarjetas"}</span></div>{cards.length ? <><ul className="mt-4 divide-y divide-line">{cards.map((card) => { const stamps = Math.max(0, card.events.reduce((sum, event) => sum + event.stampsDelta, 0)); return <li key={card.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"><span className="break-all text-slate-700">{card.holderEmail}</span><span className="font-bold text-ink">{stamps} / {program.stampsRequired} sellos</span></li>; })}</ul>{totalCards > cards.length && <p className="mt-3 text-xs text-slate-500">Se muestran las 50 tarjetas más recientes.</p>}</> : <p className="mt-3 text-sm text-slate-600">Todavía no hay tarjetas registradas. Comparte el enlace para recibir a tus primeros clientes.</p>}</div></div> : null}</>;
}
