import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Psicóloga Pau",
    category: "Psicología y educación",
    description: "Un espacio para compartir contenido de psicología, cursos y contacto profesional.",
    url: "https://paupsicologa.com/",
    domain: "paupsicologa.com",
    image: "/portfolio/psicologa-pau.png",
    imageAlt: "Vista de la página principal de Psicóloga Pau"
  },
  {
    name: "Pepa & Lola Café",
    category: "Cafetería y hospitalidad",
    description: "Una página para descubrir el café, consultar su menú y conocer el espacio.",
    url: "https://pepaylolacafe.com/",
    domain: "pepaylolacafe.com",
    image: "/portfolio/pepa-y-lola.png",
    imageAlt: "Vista de la página principal de Pepa & Lola Café"
  }
] as const;

export function Portfolio() {
  return (
    <section id="portafolio" aria-labelledby="portfolio-title" className="section-pad bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Portafolio</p>
          <h2 id="portfolio-title" className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
            Ideas que ya están en línea
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Cada proyecto tiene una historia propia. Conoce algunos de los sitios que he creado para hacerlas realidad.
          </p>
        </div>

        <div className="mt-10 grid gap-7 md:grid-cols-2 lg:gap-8">
          {projects.map((project) => (
            <article key={project.url} className="group overflow-hidden rounded-2xl border border-line bg-cloud shadow-sm transition hover:border-ocean/40 hover:shadow-panel">
              <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label={`Visitar ${project.name} (abre en otra pestaña)`} className="focus-ring block overflow-hidden bg-slate-100">
                <Image src={project.image} alt={project.imageAlt} width={1440} height={900} sizes="(max-width: 768px) 100vw, 50vw" className="aspect-[16/10] w-full object-cover object-top transition duration-500 group-hover:scale-[1.025]" />
              </a>
              <div className="p-6 sm:p-7">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-ocean">{project.category}</p>
                <h3 className="mt-2 text-2xl font-black text-ink">{project.name}</h3>
                <p className="mt-3 min-h-[3.5rem] leading-7 text-slate-600">{project.description}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                  <span className="text-sm text-slate-500">{project.domain}</span>
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="focus-ring inline-flex items-center gap-2 text-sm font-black text-ocean hover:text-ink">
                    Visitar sitio <ArrowUpRight size={17} aria-hidden="true" />
                    <span className="sr-only">: {project.name} (abre en otra pestaña)</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
