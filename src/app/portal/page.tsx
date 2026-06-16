import Image from "next/image";
import Link from "next/link";
import { CreditCard, FileText, LockKeyhole, MessageSquareText, PanelsTopLeft, UserRound } from "lucide-react";

const modules = [
  {
    title: "Proyectos",
    text: "Seguimiento de implementaciones, entregables, estado y próximos pasos.",
    icon: PanelsTopLeft
  },
  {
    title: "Pagos",
    text: "Historial de pagos, suscripciones, recibos y comprobantes.",
    icon: CreditCard
  },
  {
    title: "Solicitudes",
    text: "Diagnósticos, soporte, cambios y nuevas automatizaciones.",
    icon: MessageSquareText
  },
  {
    title: "Documentos",
    text: "Contratos, facturas, propuestas, manuales y reportes.",
    icon: FileText
  }
];

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-cloud text-ink">
      <section className="relative overflow-hidden bg-ink px-5 py-20 text-white lg:px-8">
        <div className="absolute right-[-12%] top-[-20%] h-96 w-96 rounded-full bg-ocean/25 blur-[120px]" />
        <div className="relative mx-auto max-w-7xl">
          <Link href="/" className="text-sm font-bold text-electric transition hover:text-white">
            Volver al sitio
          </Link>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <div>
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-mint">Portal de clientes</p>
              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                Área privada preparada para usuarios, pagos y proyectos
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Esta pantalla queda vacía funcionalmente por ahora, pero define la base visual para activar autenticación,
                roles, base de datos, pagos y seguimiento de implementaciones.
              </p>
              <div className="mt-8 rounded-lg border border-white/12 bg-white/[0.07] p-6 shadow-glow backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-ocean text-white">
                    <LockKeyhole size={22} />
                  </div>
                  <div>
                    <p className="font-black">Acceso pendiente</p>
                    <p className="text-sm text-slate-300">Autenticación y roles se conectarán en backend.</p>
                  </div>
                </div>
                <div className="mt-6 rounded-md border border-white/10 bg-[#071a31] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-mint">
                    <UserRound size={17} />
                    Rol futuro: cliente
                  </div>
                  <p className="text-sm leading-6 text-slate-300">
                    Próximo flujo: registro, inicio de sesión, proyectos activos, pagos, facturación y soporte.
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/14 bg-white/[0.06] p-3 shadow-glow">
              <Image
                src="/brand/portal-clientes-dashboard.png"
                alt="Mockup de portal de clientes con proyectos, pagos, comprobantes, solicitudes y soporte"
                width={1586}
                height={992}
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="rounded-md object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <article key={module.title} className="rounded-lg border border-line bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-ink text-electric">
                  <Icon size={22} />
                </div>
                <h2 className="text-xl font-black">{module.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">{module.text}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
