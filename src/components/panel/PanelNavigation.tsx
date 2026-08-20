"use client";

import {
  BellRing,
  CreditCard,
  FileCheck2,
  LayoutDashboard,
  Menu,
  Repeat2,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/panel", label: "Inicio", icon: LayoutDashboard },
  { href: "/panel/pagos", label: "Pagos únicos", icon: CreditCard },
  { href: "/panel/suscripciones", label: "Suscripciones", icon: Repeat2 },
  { href: "/panel/comprobantes", label: "Comprobantes", icon: FileCheck2 },
  { href: "/panel/recordatorios", label: "Recordatorios", icon: BellRing }
] as const;

export function PanelNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="focus-ring fixed left-5 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white text-ink shadow-sm lg:hidden"
        aria-label="Abrir navegación"
      >
        <Menu size={20} />
      </button>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-ink/55 backdrop-blur-sm transition lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-0 z-50 w-[290px] border-r border-white/10 bg-ink p-5 text-white transition-transform lg:static lg:z-auto lg:w-[270px] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm font-black uppercase tracking-[0.15em]">
            Mi <span className="text-electric">Panel</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Cerrar navegación"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="mt-10 space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/panel" ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition",
                  active
                    ? "bg-ocean text-white shadow-glow"
                    : "text-slate-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.06] p-4">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-mint">En preparación</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Los módulos mostrarán información real conforme activemos cada servicio.
          </p>
        </div>
      </aside>
    </>
  );
}
