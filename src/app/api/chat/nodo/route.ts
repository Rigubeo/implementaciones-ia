import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";
import { sendNodoChatToN8n } from "@/lib/integrations/n8n";
import { rateLimit } from "@/lib/security/rate-limit";
import { nodoChatSchema } from "@/lib/validation/nodo-chat";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limit = rateLimit(`nodo-chat:${ip}`, 20);

    if (!limit.allowed) {
      return fail("Demasiados mensajes. Intenta de nuevo en un minuto.", 429);
    }

    const input = nodoChatSchema.parse(await request.json());
    const automation = await sendNodoChatToN8n(input);

    if (automation.skipped) {
      return fail("Nodo no tiene configurado el webhook de automatización.", 503);
    }

    if (!automation.reply) {
      return fail("Nodo recibió el mensaje, pero el workflow no devolvió una respuesta.", 502);
    }

    return ok({
      reply: automation.reply,
      source: "automation"
    });
  } catch (error) {
    return handleApiError(error);
  }
}
