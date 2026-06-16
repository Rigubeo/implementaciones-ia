import Image from "next/image";
import { CreditCard, FileText, ShieldCheck, UserRound, Workflow } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";

const paymentBlocks = [
  {
    title: "Pagos únicos",
    text: "Implementaciones, diagnósticos y landing pages podrán cobrarse con Stripe o Mercado Pago más adelante.",
    icon: CreditCard
  },
  {
    title: "Suscripciones",
    text: "Soporte mensual, mantenimiento de agentes IA y optimización de flujos preparados para billing recurrente.",
    icon: Workflow
  },
  {
    title: "Comprobantes",
    text: "Base lista para historial de pagos, recibos, facturación y comprobantes descargables.",
    icon: FileText
  },
  {
    title: "Portal de clientes",
    text: "Área privada para proyectos, solicitudes, entregables, pagos y soporte cuando activemos autenticación.",
    icon: UserRound
  }
];

export function PaymentsPortal() {
  return (
    <section id="pagos" className="section-pad bg-[#061225] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-electric">Base SaaS preparada</p>
          <h2 className="text-3xl font-black leading-tight md:text-5xl">
            La landing ya nace lista para vender servicios, gestionar clientes y recibir pagos
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Dejamos la experiencia comercial conectada con una arquitectura futura para usuarios, proyectos, pagos únicos,
            suscripciones, webhooks, comprobantes y panel administrativo.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/portal">Ver portal base</ButtonLink>
            <ButtonLink href="#contacto" variant="secondary">Solicitar diagnóstico</ButtonLink>
          </div>
          <div className="mt-8 max-w-md overflow-hidden rounded-lg border border-white/12 bg-white/[0.05] p-3">
            <Image
              src="/brand/nodo-pagos-comprobantes.png"
              alt="Nodo sosteniendo una tarjeta y un comprobante"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 100vw, 34vw"
              className="rounded-md object-contain"
            />
          </div>
        </div>

        <div className="rounded-lg border border-white/14 bg-white/[0.06] p-4 shadow-glow backdrop-blur">
          <div className="rounded-md border border-white/10 bg-[#071a31] p-5">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-sm font-bold text-mint">Stripe / Mercado Pago</p>
                <h3 className="mt-1 text-2xl font-black">Flujo comercial preparado</h3>
              </div>
              <span className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-black text-mint">
                Sin cobros reales
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {paymentBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <article key={block.title} className="rounded-md border border-white/10 bg-white/[0.06] p-4">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-ocean/14 text-electric">
                      <Icon size={21} />
                    </div>
                    <h4 className="font-black">{block.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{block.text}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-md border border-mint/20 bg-mint/10 p-4 text-sm leading-6 text-slate-200">
              <ShieldCheck className="mt-0.5 shrink-0 text-mint" size={20} />
              <p>
                La integración real se activará cuando definamos proveedor, precios, credenciales, webhooks y reglas de acceso por rol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
