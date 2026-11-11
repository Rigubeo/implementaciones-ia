import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";
import { sendDiagnosticToN8n } from "@/lib/integrations/n8n";
import { rateLimit } from "@/lib/security/rate-limit";
import { readBoundedJson, RequestBodyTooLargeError } from "@/lib/security/bounded-json";
import { diagnosticSchema } from "@/lib/validation/diagnostic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limit = rateLimit(`diagnostic:${ip}`);

    if (!limit.allowed) {
      return fail("Demasiadas solicitudes. Intenta de nuevo en un minuto.", 429);
    }

    const input = diagnosticSchema.parse(await readBoundedJson(request, 32 * 1024));
    const automation = await sendDiagnosticToN8n(input);

    return ok({
      message: "Solicitud recibida",
      automation
    }, 201);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return fail("La solicitud es demasiado grande.", 413);
    if (error instanceof SyntaxError) return fail("El formato de la solicitud no es válido.", 400);
    return handleApiError(error);
  }
}
