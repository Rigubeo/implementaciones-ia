import { z } from "zod";

export const nodoChatSchema = z.object({
  message: z.string().trim().min(1).max(800),
  sessionId: z.string().trim().min(1).max(120).optional()
});

export type NodoChatInput = z.infer<typeof nodoChatSchema>;
