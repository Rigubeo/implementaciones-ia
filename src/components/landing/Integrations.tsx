import Image from "next/image";
import { DatabaseZap, FileText, MessageSquareText } from "lucide-react";
import { integrationIcons } from "@/components/brand/IntegrationIcons";

const integrations = [
  {
    name: "Telegram y WhatsApp",
    detail: "Conversaciones, seguimiento y recordatorios",
    Icon: integrationIcons.whatsapp
  },
  {
    name: "n8n",
    detail: "Automatización visual por flujos y webhooks",
    Icon: integrationIcons.n8n
  },
  {
    name: "Google Calendar",
    detail: "Agenda, confirmaciones y disponibilidad",
    Icon: integrationIcons.calendar
  },
  {
    name: "Google Sheets",
    detail: "Registros, reportes y tableros operativos",
    Icon: integrationIcons.sheets
  },
  {
    name: "CRM y correo",
    detail: "Leads, tareas, notificaciones y pipeline",
    Icon: MessageSquareText
  },
  {
    name: "Documentos",
    detail: "Comprobantes, briefs y expedientes",
    Icon: FileText
  }
];

export function Integrations() {
  return (
    <section className="border-y border-line bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:px-8">
        <div className="relative overflow-hidden rounded-lg border border-line bg-cloud p-3">
          <Image
            src="/brand/nodo-automatizaciones-integraciones.png"
            alt="Nodo conectando automatizaciones con Telegram, WhatsApp, calendario, Sheets, clientes y correo"
            width={1254}
            height={1254}
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="rounded-md object-contain"
          />
        </div>
        <div>
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-ocean">Integraciones reales</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Conectamos las herramientas que ya usa tu negocio</h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
              <DatabaseZap className="text-mint" size={18} />
              Preparado para CRM, webhooks y base de datos.
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {integrations.map(({ name, detail, Icon }) => (
              <article key={name} className="flex items-center gap-4 rounded-lg border border-line bg-cloud p-4">
                <div className="brand-icon-lockup flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-white shadow-sm">
                  <Icon className="h-6 w-6 text-ocean" />
                </div>
                <div>
                  <h3 className="font-black text-ink">{name}</h3>
                  <p className="mt-1 text-sm leading-5 text-slate-600">{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
