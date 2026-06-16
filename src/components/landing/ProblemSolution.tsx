import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/config/site";

export function ProblemSolution() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Problema a solución"
          title="Menos fricción operativa, más tiempo para vender y atender"
        />
        <div className="mt-12 grid gap-4">
          {siteConfig.problems.map(([problem, solution]) => (
            <div key={problem} className="grid items-center gap-4 rounded-lg border border-line bg-cloud p-5 md:grid-cols-[1fr_auto_1fr]">
              <p className="text-lg font-black text-ink">{problem}</p>
              <ArrowRight className="hidden text-ocean md:block" />
              <div className="flex gap-3 rounded-md bg-white p-4">
                <CheckCircle2 className="mt-1 shrink-0 text-mint" size={22} />
                <p className="font-semibold leading-7 text-slate-700">{solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
