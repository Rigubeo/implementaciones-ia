import Image from "next/image";
import { Zap } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig } from "@/config/site";
import { integrationIcons } from "@/components/brand/IntegrationIcons";

const stack = [
  { label: "WhatsApp", icon: integrationIcons.whatsapp },
  { label: "Telegram", icon: integrationIcons.telegram },
  { label: "Email", icon: integrationIcons.gmail },
  { label: "Calendar", icon: integrationIcons.calendar },
  { label: "Docs", icon: integrationIcons.docs },
  { label: "Sheets", icon: integrationIcons.sheets }
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink pt-32 text-white lg:pt-28">
      <div className="absolute left-[-18%] top-[-20%] h-[520px] w-[520px] rounded-full bg-ocean/24 blur-[130px]" />
      <div className="absolute bottom-10 right-[-12%] h-[460px] w-[460px] rounded-full bg-mint/14 blur-[140px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(35,167,255,.18),transparent_32%),linear-gradient(180deg,#061225_0%,#061225_72%,#f4f8fb_100%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-8 lg:min-h-[760px] lg:grid-cols-[0.86fr_1.14fr] lg:px-8 lg:pb-24 lg:pt-14">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-md border border-electric/30 bg-white/8 px-3 py-2 text-sm font-semibold text-sky-100 backdrop-blur">
            <Zap size={16} className="text-electric" />
            Automatización aplicada a resultados de negocio
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[1.02] md:text-6xl">
            Automatiza tu negocio con Inteligencia Artificial
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
            Creamos agentes IA, secretarías virtuales y automatizaciones que responden clientes, agendan citas y eliminan tareas repetitivas.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={siteConfig.cta.demo}>Solicitar demostración</ButtonLink>
            <ButtonLink href="#servicios" variant="secondary">Ver soluciones</ButtonLink>
          </div>
          <div className="hero-stack mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
            {stack.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-white/16 bg-[#081a31]/72 p-4 backdrop-blur">
                  <Icon className="mb-3 h-7 w-7" aria-hidden="true" />
                  <p className="text-sm font-bold text-white">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center">
          <HeroNodoVisual />
        </div>
      </div>
    </section>
  );
}

function HeroNodoVisual() {
  return (
    <div className="w-full animate-fade-up rounded-lg border border-white/18 bg-white/10 p-2 shadow-glow backdrop-blur-xl sm:p-3">
      <div className="overflow-hidden rounded-md border border-sky-100/15 bg-[#071a31]">
        <Image
          src="/brand/hero-nodo-transformacion-negocio.png"
          alt="Nodo transformando un entorno administrativo saturado en un panel ordenado con mensajes, agenda, tareas y métricas"
          width={1674}
          height={866}
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="hero-flow-image"
        />
      </div>
    </div>
  );
}
