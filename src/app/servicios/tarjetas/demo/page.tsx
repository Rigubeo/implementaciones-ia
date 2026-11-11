import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { LoyaltyEditor } from "@/components/loyalty/LoyaltyEditor";

export default function CardDemoPage() {
  return <><Navbar /><main className="mx-auto max-w-7xl px-5 pb-20 pt-40 lg:px-8"><Link href="/servicios/tarjetas" className="text-sm font-bold text-ocean">← Volver a tarjetas</Link><div className="my-5 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">Esta es una demostración: puedes probar los diseños y ajustes sin guardar datos.</div><LoyaltyEditor demo initial={{ businessName: "Tu negocio", reward: "Tu recompensa especial", promotion: "", stampsRequired: 8, theme: "profesional" }} /></main></>;
}
