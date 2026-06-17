"use client";

import Image from "next/image";
import { ChevronDown, Globe2, MessagesSquare, Workflow } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { siteConfig } from "@/config/site";

const serviceDetails = [
  {
    Icon: null,
    summary: "Atención conversacional entrenada para responder dudas frecuentes, filtrar prospectos, resolver preguntas y dar seguimiento sin depender de horarios.",
    example: "Una clínica recibe mensajes fuera de horario y Nodo responde, solicita datos básicos, detecta urgencias, da seguimiento y avisa al equipo cuando necesita intervención humana."
  },
  {
    Icon: Workflow,
    summary: "Flujos que conectan formularios, mensajes, hojas de cálculo, calendarios, CRM, correo y documentos para reducir trabajo manual.",
    example: "Un cliente llena un formulario, se crea el registro, se agenda una cita, se envía confirmación y se notifica al equipo automáticamente."
  },
  {
    Icon: MessagesSquare,
    summary: "Asistentes que conversan con el cliente, detectan disponibilidad, agendan citas directamente en Google Calendar, crean archivos, organizan documentos y envían confirmaciones o recordatorios.",
    example: "Un paciente pregunta por horarios disponibles; la secretaria virtual propone opciones, confirma la elegida, crea el evento en calendario, genera el expediente básico y guarda los documentos en la carpeta correspondiente."
  },
  {
    Icon: Globe2,
    summary: "Páginas rápidas, claras y preparadas para captar prospectos, medir conversiones y crecer hacia un portal o sistema interno.",
    example: "Una cafetería lanza una landing con menú, promociones, formulario de eventos y seguimiento automático de solicitudes."
  }
];

export function Services() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = siteConfig.services[activeIndex];
  const activeDetail = serviceDetails[activeIndex];

  return (
    <section id="servicios" className="section-pad bg-cloud">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeader
          eyebrow="Qué hacemos"
          title="Implementaciones claras para problemas reales del negocio"
          description="Diseñamos sistemas que atienden, organizan y ejecutan tareas conectando tus herramientas actuales."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {siteConfig.services.map((service, index) => {
            const detail = serviceDetails[index];
            const Icon = detail.Icon;
            const isActive = activeIndex === index;

            return (
              <button
                key={service.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`focus-ring group flex min-h-[255px] flex-col items-start rounded-lg border bg-white p-6 text-left shadow-sm transition ${
                  isActive ? "border-ocean shadow-panel" : "border-line hover:-translate-y-1 hover:shadow-panel"
                }`}
                aria-expanded={isActive}
                aria-controls="service-detail"
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-ink text-electric">
                  {index === 0 ? (
                    <Image
                      src="/brand/nodo-agent-icon.png"
                      alt=""
                      width={64}
                      height={64}
                      sizes="48px"
                      className="h-full w-full object-cover"
                    />
                  ) : Icon ? (
                    <Icon size={24} />
                  ) : null}
                </span>
                <span className="flex w-full items-start justify-between gap-4">
                  <span className="text-xl font-black text-ink">{service.title}</span>
                  <ChevronDown
                    size={18}
                    className={`mt-1 shrink-0 text-ocean transition ${isActive ? "rotate-180" : ""}`}
                  />
                </span>
                <span className="mt-3 block leading-7 text-slate-600">{service.description}</span>
                <span className="mt-auto pt-5 text-xs font-black uppercase tracking-[0.16em] text-ocean">
                  Ver cómo funciona
                </span>
              </button>
            );
          })}
        </div>

        <div id="service-detail" className="mt-5 overflow-hidden rounded-lg border border-ocean/20 bg-white p-5 shadow-sm md:p-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">Detalle de solución</p>
          <div className="mt-3 grid gap-4 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <h3 className="text-2xl font-black text-ink">{activeService.title}</h3>
            <div>
              <p className="leading-7 text-slate-700">{activeDetail.summary}</p>
              <p className="mt-3 rounded-md bg-cloud p-4 text-sm leading-6 text-slate-600">
                <span className="font-black text-ink">Ejemplo de uso: </span>
                {activeDetail.example}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
