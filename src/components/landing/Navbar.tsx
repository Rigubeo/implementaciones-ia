import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/15 bg-ink/95 shadow-[0_12px_40px_rgba(0,0,0,.22)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8 lg:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/brand/logo-implementaciones-ia.png"
            alt="Logo Implementaciones de IA"
            width={40}
            height={40}
            className="rounded-full bg-white"
            priority
          />
          <span className="text-sm font-black uppercase tracking-[0.12em] text-white">
            Implementaciones <span className="text-electric">IA</span>
          </span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className="text-sm font-bold text-white/90 transition hover:text-electric">
              {item.label}
            </a>
          ))}
        </div>
        <ButtonLink href={siteConfig.cta.demo} className="hidden lg:inline-flex">
          <CalendarCheck size={18} />
          Agendar demo
        </ButtonLink>
        <a
          href={siteConfig.cta.demo}
          className="focus-ring inline-flex rounded-md bg-ocean px-4 py-2 text-sm font-bold text-white lg:hidden"
        >
          Agendar
        </a>
      </nav>
      <div className="border-t border-white/10 bg-[#04101f]/96 lg:hidden">
        <div className="mobile-nav-scroll mx-auto flex max-w-7xl gap-4 overflow-x-auto px-5 py-2 text-xs font-bold text-white/80">
          {siteConfig.nav.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 rounded-full px-1 py-1 transition hover:text-electric">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
