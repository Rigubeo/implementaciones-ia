import Image from "next/image";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[#030914] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/brand/logo-implementaciones-ia.png" alt="" width={42} height={42} className="rounded-full bg-white" />
            <p className="font-black">{siteConfig.name}</p>
          </div>
          <p className="mt-5 max-w-sm leading-7 text-slate-400">
            Automatizamos procesos con Inteligencia Artificial para que tu negocio ahorre tiempo, reduzca costos y atienda clientes 24/7.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-4 font-black">Servicios</h3>
            <a className="block py-1 text-slate-400 hover:text-white" href="#servicios">Agentes IA</a>
            <a className="block py-1 text-slate-400 hover:text-white" href="#servicios">Automatizaciones</a>
            <a className="block py-1 text-slate-400 hover:text-white" href="#servicios">Landing pages</a>
          </div>
          <div>
            <h3 className="mb-4 font-black">Plataforma</h3>
            <a className="block py-1 text-slate-400 hover:text-white" href="#pagos">Pagos</a>
            <a className="block py-1 text-slate-400 hover:text-white" href="/portal">Portal clientes</a>
            <a className="block py-1 text-slate-400 hover:text-white" href="#contacto">Agendar con Nodo</a>
          </div>
          <div>
            <h3 className="mb-4 font-black">Contacto</h3>
            <a className="block py-1 text-slate-400 hover:text-white" href="#contacto">Nodo web</a>
            <p className="py-1 text-slate-500">LinkedIn e Instagram próximamente</p>
            <p className="py-1 text-slate-500">Aviso de privacidad pendiente</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
