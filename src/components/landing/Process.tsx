import { LifeBuoy, PenTool, Rocket, SearchCheck, ShieldCheck, TestTube2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/config/site";

const icons = [SearchCheck, PenTool, Rocket, TestTube2, ShieldCheck, LifeBuoy];

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
        <div className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {siteConfig.process.map((step, index) => {
            const Icon = icons[index];
            return (
              <div key={step} className="rounded-lg border border-white/12 bg-white/7 p-5">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-md bg-electric/14 text-electric">
                  <Icon size={22} />
                </div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Paso {index + 1}</p>
                <h3 className="text-lg font-black">{step}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
