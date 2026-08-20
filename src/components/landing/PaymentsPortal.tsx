import Image from "next/image";
import { BellRing, CreditCard, FileCheck2, LockKeyhole, Repeat2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

const panelModules = [
  {
    title: "Pagos únicos",
    text: "Consulta órdenes relacionadas con implementaciones, diagnósticos y proyectos específicos.",
    icon: CreditCard
  },
  {
    title: "Suscripciones",
    text: "Revisa servicios recurrentes, mantenimiento, soporte y próximas renovaciones.",
    icon: Repeat2
  },
  {
    title: "Comprobantes",
    text: "Encuentra recibos, referencias, facturas e historial de documentos asociados.",
    icon: FileCheck2
  },
  {
    title: "Recordatorios",
    text: "Mantén visibles pagos pendientes, renovaciones, documentos y próximas acciones.",
    icon: BellRing
  }
];

export function PaymentsPortal() {
  return (
    <section id="mi-panel" className="section-pad bg-[#061225] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-center lg:px-8">
        <div>
          <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-electric">Mi Panel</p>
          <h2 className="text-3xl font-black leading-tight md:text-5xl">
            Toda la información de tus servicios, en un solo lugar
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Creamos un espacio privado para consultar pagos únicos, suscripciones, comprobantes y recordatorios de forma clara y segura.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/iniciar-sesion">Entrar a Mi Panel</ButtonLink>
            <ButtonLink href="/registro" variant="secondary">Crear cuenta</ButtonLink>
          </div>
          <div className="mt-7 flex items-start gap-3 rounded-xl border border-mint/20 bg-mint/10 p-4 text-sm leading-6 text-slate-200">
            <LockKeyhole className="mt-0.5 shrink-0 text-mint" size={20} />
            <p>
              El acceso utiliza sesiones seguras con Supabase. Los espacios de pagos todavía son informativos y no procesan cobros reales.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/14 bg-white/[0.06] p-4 shadow-glow backdrop-blur">
          <div className="mb-4 overflow-hidden rounded-[1.4rem] border border-white/10 bg-white">
            <Image
              src="/brand/portal-clientes-dashboard.png"
              alt="Vista conceptual de Mi Panel"
              width={1586}
              height={992}
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="max-h-[330px] w-full object-cover object-top"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {panelModules.map((module) => {
              const Icon = module.icon;
              return (
                <article key={module.title} className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ocean/15 text-electric">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-4 font-black">{module.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{module.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
