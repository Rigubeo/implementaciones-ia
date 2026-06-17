import Image from "next/image";
import { Building2, Calculator, Coffee, Hotel, Stethoscope } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const cases = [
  {
    title: "Clínicas y consultorios",
    icon: Stethoscope,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80",
    text: "Agenda, confirmación, recordatorios, preguntas frecuentes y seguimiento de pacientes."
  },
  {
    title: "Hoteles",
    icon: Hotel,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    text: "Respuestas inmediatas sobre disponibilidad, servicios, horarios y solicitudes de huéspedes."
  },
  {
    title: "Cafeterías",
    icon: Coffee,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80",
    text: "Pedidos, promociones, reservas, feedback y seguimiento a clientes frecuentes."
  },
  {
    title: "Contadores",
    icon: Calculator,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
    text: "Recepción de documentos, recordatorios fiscales, control de pendientes y reportes."
  },
  {
    title: "Negocios locales",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    text: "Automatización de ventas, consultas, agenda, seguimiento y reportes operativos."
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
              <article key={item.title} className="group overflow-hidden rounded-lg border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel">
                <div className="relative h-52 overflow-hidden bg-ink">
                  <Image
                    src={item.image}
                    alt={`Ejemplo visual para ${item.title.toLowerCase()}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/68 via-ink/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-md bg-white text-ocean shadow-sm">
                    <Icon size={23} />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-black text-ink">{item.title}</h3>
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
