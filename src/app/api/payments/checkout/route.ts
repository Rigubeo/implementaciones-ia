import { NextRequest } from "next/server";
import { z } from "zod";
import { ok, handleApiError } from "@/lib/api/response";
import { createCheckoutSession } from "@/lib/payments/providers";

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
    const input = checkoutSchema.parse(await request.json());
    const session = await createCheckoutSession(input);
    return ok(session, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
