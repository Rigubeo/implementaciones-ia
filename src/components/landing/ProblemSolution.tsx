import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ProblemSolution() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Problemas a solucionar"
          title="Menos fricción operativa, más tiempo para vender y atender"
        />
        <div className="mt-12 overflow-hidden rounded-[2rem] border border-line bg-cloud p-2 shadow-sm">
          <Image
            src="/brand/nodo-problemas-soluciones.png"
            alt="Nodo mostrando problemas comunes del negocio y sus soluciones con IA: mensajes fuera de horario, tareas manuales, clientes esperando respuesta e información desordenada"
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
