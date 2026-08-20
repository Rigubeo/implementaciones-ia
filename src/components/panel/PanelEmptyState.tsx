import type { LucideIcon } from "lucide-react";

type PanelEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  note: string;
};

export function PanelEmptyState({ icon: Icon, title, description, note }: PanelEmptyStateProps) {
  return (
    <section className="rounded-[1.75rem] border border-line bg-white p-6 shadow-sm md:p-9">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-ink text-electric">
        <Icon size={25} />
      </div>
      <h1 className="mt-6 text-3xl font-black text-ink md:text-4xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{description}</p>
      <div className="mt-8 rounded-xl border border-dashed border-ocean/35 bg-sky-50 p-6">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Sin movimientos todavía</p>
        <p className="mt-2 leading-7 text-slate-600">{note}</p>
      </div>
    </section>
  );
}
