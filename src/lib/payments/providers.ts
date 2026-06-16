export type PaymentProvider = "stripe" | "mercado_pago";

export type CheckoutDraft = {
  provider: PaymentProvider;
  customerId: string;
  projectId?: string;
  amountCents: number;
  currency: "mxn" | "usd";
  mode: "one_time" | "subscription";
};

export async function createCheckoutSession(input: CheckoutDraft) {
  if (input.provider === "stripe") {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { provider: input.provider, configured: false };
    }

    // Stripe SDK wiring belongs here once products, prices and credentials are defined.
    return { provider: input.provider, configured: true, checkoutUrl: null };
  }

  if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
    return { provider: input.provider, configured: false };
  }

  // Mercado Pago preference creation belongs here once products and credentials are defined.
  return { provider: input.provider, configured: true, checkoutUrl: null };
}
