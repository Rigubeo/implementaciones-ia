"use client";

import { ArrowRight, CalendarCheck } from "lucide-react";

const agendaPrompt = "Quiero agendar un diagnóstico con Nodo para revisar qué procesos de mi negocio podemos automatizar.";

function openNodoAgenda() {
  window.dispatchEvent(
    new CustomEvent("nodo-chat:open", {
      detail: { message: agendaPrompt }
    })
  );
}

export function FinalCta() {
  return (
    <section id="contacto" className="bg-ink px-5 py-20 text-white lg:px-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-lg border border-white/12 bg-[linear-gradient(135deg,rgba(10,124,255,.24),rgba(36,210,143,.12)_42%,rgba(255,255,255,.06))] p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-electric">Agenda diagnóstico</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">¿Listo para automatizar tu negocio?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
              Habla con Nodo, cuéntale qué necesitas automatizar y preparará la solicitud para que podamos darte seguimiento.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <button
              type="button"
              onClick={openNodoAgenda}
              className="focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-ocean px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-[#006ce0]"
            >
              <CalendarCheck size={18} />
              Agendar con Nodo
              <ArrowRight size={17} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
