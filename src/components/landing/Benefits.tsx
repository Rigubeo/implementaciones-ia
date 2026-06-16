import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/config/site";

export function Benefits() {
  return (
    <section className="section-pad bg-cloud">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <div>
          <SectionHeader
            eyebrow="Beneficios"
            title="Resultados prácticos que se sienten en la operación diaria"
            description="La meta no es tener IA por moda. La meta es reducir tiempos muertos, ordenar solicitudes y dar mejor respuesta sin saturar a tu equipo."
          />
          <div className="mt-8 overflow-hidden rounded-lg border border-line bg-white p-3 shadow-sm">
            <Image
              src="/brand/industria-dashboard-ia.png"
              alt="Persona revisando un panel de IA con agenda, mensajes y métricas de negocio"
              width={1586}
              height={992}
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="rounded-md object-cover"
            />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:content-center">
          {siteConfig.benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-3 rounded-lg border border-line bg-white p-5">
              <CheckCircle2 className="shrink-0 text-mint" size={24} />
              <p className="font-black text-ink">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
