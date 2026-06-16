import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MERCADO_PAGO_WEBHOOK_SECRET) {
      return fail("Mercado Pago webhook no configurado", 501);
    }

    const payload = await request.json();

    // Verify Mercado Pago signature and persist payment events here after credentials are configured.
    return ok({ received: true, action: payload?.action ?? null });
  } catch (error) {
    return handleApiError(error);
  }
}
