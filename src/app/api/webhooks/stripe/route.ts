import { NextRequest } from "next/server";
import { ok, fail, handleApiError } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return fail("Stripe webhook no configurado", 501);
    }

    const rawBody = await request.text();

    // Verify Stripe signature and persist payment events here after credentials are configured.
    return ok({ received: true, bytes: rawBody.length });
  } catch (error) {
    return handleApiError(error);
  }
}
