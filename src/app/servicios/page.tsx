import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Services } from "@/components/landing/Services";

export default function ServicesPage() {
  return <><Navbar /><main className="pt-28"><div className="mx-auto max-w-7xl px-5 pt-10 lg:px-8"><Link href="/" className="text-sm font-bold text-ocean">← Volver al inicio</Link></div><Services /></main><Footer /></>;
}
