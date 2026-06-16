type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
};

export function SectionHeader({ eyebrow, title, description, align = "left", tone = "light" }: SectionHeaderProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-ocean">{eyebrow}</p>
      <h2 className={tone === "dark" ? "text-3xl font-black leading-tight text-white md:text-5xl" : "text-3xl font-black leading-tight text-ink md:text-5xl"}>{title}</h2>
      {description ? (
        <p className={tone === "dark" ? "mt-5 text-lg leading-8 text-slate-300" : "mt-5 text-lg leading-8 text-slate-600"}>{description}</p>
      ) : null}
    </div>
  );
}
