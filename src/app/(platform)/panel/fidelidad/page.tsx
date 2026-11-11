import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";
import { LoyaltyEditor } from "@/components/loyalty/LoyaltyEditor";
import { StampForm } from "@/components/loyalty/StampForm";
import { QrScanner } from "@/components/loyalty/QrScanner";

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
  return <><LoyaltyEditor initial={{ businessName: business?.name ?? "Tu negocio", reward: program?.reward ?? "Tu recompensa especial", promotion: program?.promotion ?? "", stampsRequired: program?.stampsRequired ?? 8, theme: program?.theme ?? "profesional" }} />{business && program ? <div className="mx-auto mt-8 max-w-7xl space-y-5"><div className="rounded-2xl border border-line bg-white p-6"><h2 className="text-xl font-black">Enlace para tus clientes</h2><p className="mt-2 text-sm text-slate-600">Comparte esta dirección para que puedan registrar su tarjeta con su correo.</p><a className="mt-3 inline-block break-all font-bold text-ocean underline" href={`/tarjeta/${business.slug}`}>Abrir la tarjeta de {business.name} ↗</a></div><div className="rounded-2xl border border-line bg-white p-6"><h2 className="text-xl font-black">Registrar una visita</h2><p className="mt-2 text-sm text-slate-600">Escanea el código QR de la tarjeta y confirma el sello.</p><QrScanner /><details className="mt-6 border-t border-line pt-4"><summary className="cursor-pointer text-sm font-bold text-ocean">Buscar por correo o canjear un premio</summary><StampForm /></details></div></div> : null}</>;
}
