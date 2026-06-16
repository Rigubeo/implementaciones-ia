import { MessageCircle, PhoneCall } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section id="contacto" className="bg-ink px-5 py-20 text-white lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(135deg,rgba(10,124,255,.24),rgba(36,210,143,.12)_42%,rgba(255,255,255,.06))] p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-electric">Agenda diagnóstico</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">¿Listo para automatizar tu negocio?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Agenda una llamada y revisamos qué procesos de tu negocio pueden automatizarse con IA.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <ButtonLink href={siteConfig.cta.demo}>
              <PhoneCall size={18} />
              Agendar llamada
            </ButtonLink>
            <ButtonLink href={siteConfig.cta.whatsapp} variant="secondary">
              <MessageCircle size={18} />
              Enviar WhatsApp
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
