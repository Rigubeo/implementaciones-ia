import { BriefcaseBusiness, ClipboardCheck, LayoutDashboard, UsersRound } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const solutions = [
  {
    title: "Secretaría Virtual IA",
    text: "Responde por WhatsApp, agenda citas, confirma asistencia y envía recordatorios con contexto del negocio.",
    icon: ClipboardCheck,
    metric: "24/7"
  },
  {
    title: "Automatización de Procesos",
    text: "Conecta formularios, CRM, hojas de cálculo, documentos, correo y calendario mediante n8n.",
    icon: LayoutDashboard,
    metric: "n8n"
  },
  {
    title: "Landing Pages Profesionales",
    text: "Sitios rápidos y claros con formularios, eventos, conversiones y preparación para pagos.",
    icon: BriefcaseBusiness,
    metric: "Web + CRM"
  },
  {
    title: "IA para Equipos de Trabajo",
    text: "Agentes internos para clasificar solicitudes, resumir información y reducir tareas repetitivas.",
    icon: UsersRound,
    metric: "Equipo IA"
  }
];

export function FeaturedSolutions() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Soluciones destacadas"
          title="Paquetes de implementación que pueden crecer hacia una plataforma completa"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {solutions.map((solution) => {
            const Icon = solution.icon;
            return (
              <article key={solution.title} className="rounded-lg border border-line bg-cloud p-7">
                <div className="mb-7 flex items-start justify-between gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-ink text-electric">
                    <Icon size={24} />
                  </div>
                  <span className="text-right text-3xl font-black text-ocean md:text-4xl">{solution.metric}</span>
                </div>
                <h3 className="text-2xl font-black text-ink">{solution.title}</h3>
                <p className="mt-4 leading-7 text-slate-600">{solution.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
