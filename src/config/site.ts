import { whatsappLink } from "@/lib/utils";

const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL;

export const siteConfig = {
  name: "Soluciones Tecnológicas para Todos",
  shortName: "Soluciones Tecnológicas",
  telegramBotUrl: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ?? "http://t.me/RigubeoDemoBot",
  cta: {
    demo: demoUrl && demoUrl.length > 0 ? demoUrl : "/#contacto",
    whatsapp: whatsappLink("Hola, quiero automatizar mi negocio con IA.")
  },
  nav: [
    { label: "Servicios", href: "/servicios" },
    { label: "Casos de uso", href: "/#casos" },
    { label: "Proceso", href: "/#proceso" },
    { label: "Mi Panel", href: "/panel" },
    { label: "Contacto", href: "/#contacto" }
  ],
  problems: [
    ["Pierdes mensajes fuera de horario", "Agente IA disponible 24/7 con respuestas consistentes."],
    ["Tu equipo repite tareas manuales", "Automatizaciones que capturan, organizan y notifican."],
    ["Tus clientes esperan respuesta", "Asistentes inteligentes que atienden en segundos."],
    ["Tu información está desordenada", "Integraciones con hojas, calendarios, sistemas de clientes y documentos."]
  ],
  industries: [
    "Clínicas y consultorios",
    "Hoteles",
    "Cafeterías",
    "Contadores",
    "Negocios locales"
  ],
  process: ["Diagnóstico", "Diseño", "Implementación", "Pruebas", "Capacitación", "Soporte"],
  benefits: [
    "Atención 24/7",
    "Menos carga administrativa",
    "Respuestas más rápidas",
    "Más citas o ventas",
    "Integración con herramientas actuales",
    "Escalable según necesidad"
  ]
};
