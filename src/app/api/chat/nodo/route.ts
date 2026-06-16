import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";
import { sendNodoChatToN8n } from "@/lib/integrations/n8n";
import { rateLimit } from "@/lib/security/rate-limit";
import { nodoChatSchema } from "@/lib/validation/nodo-chat";

function getFallbackReply(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("telegram")) {
    return "Podemos conectar este chat con tu bot de Telegram mediante un webhook de n8n. Por ahora puedes abrir el bot demo para probar la conversación externa.";
  }

  if (normalized.includes("whatsapp")) {
    return "WhatsApp sigue siendo una integración comercial posible para clientes, pero el demo de Nodo lo prepararemos primero con Telegram y n8n.";
  }

  if (normalized.includes("secretaria") || normalized.includes("secretaría")) {
    return "Una secretaría virtual puede atender 24/7, confirmar citas, registrar datos y escalar conversaciones importantes a tu equipo.";
  }

  if (normalized.includes("n8n")) {
    return "n8n será el puente entre la página, Telegram, tus bases de datos y las herramientas del negocio mediante webhooks.";
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
      source: automation.skipped ? "local" : "n8n",
      telegramUrl: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ?? "http://t.me/RigubeoDemoBot"
    });
  } catch (error) {
    return handleApiError(error);
  }
}
