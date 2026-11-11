import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, fail, handleApiError } from "@/lib/api/response";
import { createCheckoutSession } from "@/lib/payments/providers";
import { readBoundedJson, RequestBodyTooLargeError } from "@/lib/security/bounded-json";

const checkoutSchema = z.object({
  provider: z.enum(["stripe", "mercado_pago"]),
  customerId: z.string().min(1),
  projectId: z.string().optional(),
  amountCents: z.number().int().positive(),
  currency: z.enum(["mxn", "usd"]).default("mxn"),
  mode: z.enum(["one_time", "subscription"]).default("one_time")
});

export async function POST(request: NextRequest) {
  try {
    const input = checkoutSchema.parse(await readBoundedJson(request, 32 * 1024));
    const session = await createCheckoutSession(input);
    return ok(session, 201);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return fail("La solicitud es demasiado grande.", 413);
    if (error instanceof SyntaxError) return fail("El formato de la solicitud no es válido.", 400);
    return handleApiError(error);
  }
}
