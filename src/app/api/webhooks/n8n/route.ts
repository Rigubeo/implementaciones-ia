import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("x-webhook-secret");

    if (process.env.N8N_WEBHOOK_SECRET && secret !== process.env.N8N_WEBHOOK_SECRET) {
      return fail("Webhook no autorizado", 401);
    }

    const payload = await request.json();

    // Persist project updates or customer events here once the database is connected.
    return ok({ received: true, payloadType: payload?.type ?? "unknown" });
  } catch (error) {
    return handleApiError(error);
  }
}
