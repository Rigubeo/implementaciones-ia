import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Process() {
  return (
    <section id="proceso" className="section-pad bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Cómo funciona"
          title="Un proceso ordenado para implementar IA sin complicar tu operación"
          description="Primero entendemos el negocio, luego diseñamos el flujo, conectamos herramientas, probamos casos reales y dejamos soporte."
          tone="dark"
        />
        <div className="mx-auto mt-12 max-w-[80rem] overflow-hidden rounded-[2rem] border border-white/14 bg-white/8 p-2 shadow-glow backdrop-blur xl:max-w-[64rem]">
          <Image
            src="/brand/nodo-proceso-paso-a-paso.png"
            alt="Diagrama visual del proceso de trabajo: diagnóstico, diseño, implementación, pruebas, capacitación y soporte"
            width={1674}
            height={866}
            sizes="(max-width: 1024px) 100vw, 1180px"
            className="h-auto w-full rounded-[1.55rem] object-cover"
          />
        </div>
      </div>
    </section>
  );
}
