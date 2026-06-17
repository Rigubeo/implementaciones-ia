import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";
import { sendNodoChatToN8n } from "@/lib/integrations/n8n";
import { rateLimit } from "@/lib/security/rate-limit";
import { nodoChatSchema } from "@/lib/validation/nodo-chat";

function getFallbackReply(message: string) {
  const normalized = message.toLowerCase();

  if (
    normalized.includes("agendar") ||
    normalized.includes("agenda") ||
    normalized.includes("cita") ||
    normalized.includes("seguimiento") ||
    normalized.includes("diagnóstico") ||
    normalized.includes("diagnostico")
  ) {
    return "Perfecto. Para preparar tu diagnóstico, cuéntame brevemente: giro de tu negocio, qué proceso quieres automatizar y cuál es el mejor correo o medio para darte seguimiento.";
  }

  if (normalized.includes("servicio") || normalized.includes("cotizar") || normalized.includes("cotización") || normalized.includes("cotizacion")) {
    return "Claro. Puedo ayudarte a levantar la solicitud. Dime qué servicio necesitas, qué herramienta usas hoy y qué resultado esperas lograr para preparar el resumen.";
  }

  if (normalized.includes("secretaria") || normalized.includes("secretaría")) {
    return "Una secretaría virtual puede atender 24/7, agendar citas en calendario, crear archivos, organizar documentos, enviar recordatorios y dar seguimiento a clientes.";
  }

  if (normalized.includes("automat") || normalized.includes("integr")) {
    return "La automatización puede conectar la página, tus mensajes, bases de datos, calendarios y documentos para reducir trabajo manual y mejorar el seguimiento.";
  }

  return "Podemos revisar procesos repetitivos como agenda, seguimiento, captura de datos, reportes, recordatorios, atención a clientes y tareas administrativas.";
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limit = rateLimit(`nodo-chat:${ip}`, 20);

    if (!limit.allowed) {
      return fail("Demasiados mensajes. Intenta de nuevo en un minuto.", 429);
    }

    const input = nodoChatSchema.parse(await request.json());
    const automation = await sendNodoChatToN8n(input);

    return ok({
      reply: automation.reply ?? getFallbackReply(input.message),
      source: automation.skipped ? "local" : "automation",
      telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ?? "http://t.me/RigubeoDemoBot"
    });
  } catch (error) {
    return handleApiError(error);
  }
}
