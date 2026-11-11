import { z } from "zod";

export const diagnosticSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(24),
  businessType: z.string().min(2).max(120),
  message: z.string().min(10).max(1200),
  services: z.array(z.string().max(120)).max(32).default([])
});

export type DiagnosticInput = z.infer<typeof diagnosticSchema>;
