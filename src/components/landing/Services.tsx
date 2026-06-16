import { Bot, Globe2, MessagesSquare, Workflow } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/config/site";

const icons = [Bot, Workflow, MessagesSquare, Globe2];

export function Services() {
  return (
    <section id="servicios" className="section-pad bg-cloud">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Qué hacemos"
          title="Implementaciones claras para problemas reales del negocio"
          description="Diseñamos sistemas que atienden, organizan y ejecutan tareas conectando tus herramientas actuales."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {siteConfig.services.map((service, index) => {
            const Icon = icons[index];
            return (
              <article key={service.title} className="rounded-lg border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-panel">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-ink text-electric">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black text-ink">{service.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
