"use server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { setCardholderEmail } from "@/lib/loyalty-session";
export async function accessCardholder(form: FormData): Promise<{ error?: string }> {
  const email = z.string().trim().toLowerCase().email().max(254).safeParse(form.get("email"));
  const confirmation = z.string().trim().toLowerCase().email().max(254).safeParse(form.get("confirmEmail"));
  if (!email.success || !confirmation.success) return { error: "Escribe un correo válido en ambos campos." };
  if (email.data !== confirmation.data) return { error: "Los correos no coinciden. Revísalos e inténtalo de nuevo." };
  const slug = String(form.get("slug") ?? "");
  if (slug && !z.string().uuid().safeParse(slug).success) return { error: "El enlace de la tarjeta no es válido." };
  try {
    if (slug) {
      const program = await prisma.loyaltyProgram.findFirst({ where: { active: true, business: { slug, active: true } }, orderBy: { createdAt: "asc" } });
      if (!program) return { error: "Esta tarjeta no está disponible." };
      await prisma.loyaltyCard.upsert({ where: { programId_holderEmail: { programId: program.id, holderEmail: email.data } }, update: {}, create: { programId: program.id, holderEmail: email.data } });
    }
    await setCardholderEmail(email.data);
    return {};
  } catch { return { error: "No pudimos abrir tu tarjeta. Inténtalo de nuevo." }; }
}
