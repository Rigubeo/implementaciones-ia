import Image from "next/image";
import { Building2, Calculator, Coffee, Hotel, Stethoscope } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cases = [
  {
    title: "Clínicas y consultorios",
    icon: Stethoscope,
    image: "/brand/conceptual-whatsapp-agenda.png",
    text: "Agenda, confirmación, recordatorios, preguntas frecuentes y seguimiento."
  },
  {
    title: "Hoteles",
    icon: Hotel,
    image: "/brand/conceptual-atencion-whatsapp.png",
    text: "Respuestas inmediatas sobre disponibilidad, servicios y solicitudes."
  },
  {
    title: "Cafeterías",
    icon: Coffee,
    image: "/brand/conceptual-orden-conversaciones.png",
    text: "Pedidos, promociones, reservas, feedback y clientes frecuentes."
  },
  {
    title: "Contadores",
    icon: Calculator,
    image: "/brand/conceptual-whatsapp-agenda.png",
    text: "Recepción de documentos, recordatorios fiscales y control de pendientes."
  },
  {
    title: "Negocios locales",
    icon: Building2,
    image: "/brand/industria-dashboard-ia.png",
    text: "Automatización de ventas, consultas, agenda y reportes operativos."
  }
];

export function UseCases() {
  return (
    <section id="casos" className="section-pad grid-surface bg-cloud">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Casos de uso"
          title="Sistemas pensados para negocios que necesitan operar mejor hoy"
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="overflow-hidden rounded-lg border border-line bg-white shadow-sm">
                <div className="case-image-frame">
                  <Image
                    src={item.image}
                    alt=""
                    width={520}
                    height={300}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="case-image"
                  />
                </div>
                <div className="p-5">
                  <Icon className="mb-4 text-ocean" size={24} />
                  <h3 className="text-lg font-black">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
