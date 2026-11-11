"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  businessName: z.string().trim().min(2).max(80),
  reward: z.string().trim().min(2).max(120),
  promotion: z.string().trim().max(180),
  stampsRequired: z.coerce.number().int().min(4).max(12),
  theme: z.enum(["profesional", "moderno", "fresco", "calido", "minimalista"])
});

export type SaveState = { message: string; error: boolean };

export async function saveLoyaltySettings(_previous: SaveState, form: FormData): Promise<SaveState> {
  const parsed = schema.safeParse(Object.fromEntries(form.entries()));
  if (!parsed.success) return { error: true, message: "Revisa los datos y vuelve a intentarlo." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email_confirmed_at) return { error: true, message: "Inicia sesión con tu correo confirmado." };

  const client = await prisma.client.findUnique({ where: { userId: user.id }, select: { id: true } });
  if (!client) return { error: true, message: "No encontramos tu perfil de negocio." };

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Serialize initial creation and edits for this client.
      await tx.$queryRaw`SELECT id FROM "Client" WHERE id = ${client.id} FOR UPDATE`;
      let business = await tx.loyaltyBusiness.findFirst({ where: { clientId: client.id }, orderBy: { createdAt: "asc" } });
      if (!business) {
        business = await tx.loyaltyBusiness.create({ data: { clientId: client.id, name: parsed.data.businessName, slug: randomUUID() } });
      }
      const program = await tx.loyaltyProgram.findFirst({ where: { businessId: business.id }, orderBy: { createdAt: "asc" }, include: { _count: { select: { cards: true } } } });
      if (program && program._count.cards > 0 && (program.stampsRequired !== parsed.data.stampsRequired || program.reward !== parsed.data.reward)) {
        return false;
      }
      await tx.loyaltyBusiness.update({ where: { id: business.id }, data: { name: parsed.data.businessName } });
      const data = { name: "Tarjeta de fidelidad", reward: parsed.data.reward, promotion: parsed.data.promotion || null, stampsRequired: parsed.data.stampsRequired, theme: parsed.data.theme };
      if (program) await tx.loyaltyProgram.update({ where: { id: program.id }, data });
      else await tx.loyaltyProgram.create({ data: { ...data, businessId: business.id } });
      return true;
    });
    if (!result) return { error: true, message: "Esta tarjeta ya tiene titulares. Por ahora no se pueden cambiar el premio ni los sellos necesarios." };
    revalidatePath("/panel/fidelidad");
    return { error: false, message: "Los cambios de tu tarjeta se guardaron." };
  } catch {
    return { error: true, message: "No pudimos guardar los cambios. Inténtalo de nuevo." };
  }
}

export async function addStamp(_previous: SaveState, form: FormData): Promise<SaveState> {
  const email = z.string().trim().email().max(254).safeParse(form.get("email"));
  const cardId = z.string().cuid().safeParse(form.get("cardId"));
  const requestId = z.string().uuid().safeParse(form.get("requestId"));
  const operation = z.enum(["stamp", "redeem"]).safeParse(form.get("operation"));
  if ((!email.success && !cardId.success) || !requestId.success || !operation.success) return { error: true, message: "Revisa la tarjeta o el correo de tu cliente." };
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email_confirmed_at) return { error: true, message: "Inicia sesión con tu cuenta de negocio." };
  try {
    const outcome = await prisma.$transaction(async (tx) => {
      const business = await tx.loyaltyBusiness.findFirst({ where: { client: { userId: user.id }, active: true }, orderBy: { createdAt: "asc" }, include: { programs: { where: { active: true }, take: 1, orderBy: { createdAt: "asc" } } } });
      const program = business?.programs[0];
      if (!program) return "missing";
      const card = await tx.loyaltyCard.findFirst({ where: { programId: program.id, ...(cardId.success ? { id: cardId.data } : { user: { email: { equals: email.data!, mode: "insensitive" } } }) } });
      if (!card) return "missing";
      await tx.$queryRaw`SELECT id FROM "LoyaltyCard" WHERE id = ${card.id} FOR UPDATE`;
      const existing = await tx.loyaltyStampEvent.findUnique({ where: { idempotencyKey: requestId.data } });
      if (existing) return existing.cardId === card.id && existing.actorId === user.id && existing.type === (operation.data === "stamp" ? "STAMP" : "REDEMPTION") ? "duplicate" : "missing";
      const total = await tx.loyaltyStampEvent.aggregate({ where: { cardId: card.id }, _sum: { stampsDelta: true } });
      const stamps = total._sum.stampsDelta ?? 0;
      if (operation.data === "stamp" && stamps >= program.stampsRequired) return "complete";
      if (operation.data === "redeem" && stamps < program.stampsRequired) return "incomplete";
      await tx.loyaltyStampEvent.create({ data: { cardId: card.id, actorId: user.id, type: operation.data === "stamp" ? "STAMP" : "REDEMPTION", stampsDelta: operation.data === "stamp" ? 1 : -program.stampsRequired, idempotencyKey: requestId.data } });
      return "ok";
    });
    if (outcome === "missing") return { error: true, message: "No encontramos una tarjeta registrada con ese correo en tu negocio." };
    if (outcome === "complete") return { error: true, message: "Esta tarjeta ya completó sus sellos." };
    if (outcome === "incomplete") return { error: true, message: "La tarjeta todavía no tiene los sellos necesarios para el premio." };
    revalidatePath("/panel/fidelidad");
    return { error: false, message: outcome === "duplicate" ? "Esta operación ya se había registrado." : operation.data === "stamp" ? "Sello agregado correctamente." : "Premio canjeado y tarjeta reiniciada." };
  } catch { return { error: true, message: "No pudimos agregar el sello. Inténtalo de nuevo." }; }
}

export async function findScannedCard(cardId: string) {
  if (!z.string().cuid().safeParse(cardId).success) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email_confirmed_at) return null;
  const business = await prisma.loyaltyBusiness.findFirst({ where: { client: { userId: user.id }, active: true }, orderBy: { createdAt: "asc" }, include: { programs: { where: { active: true }, take: 1, orderBy: { createdAt: "asc" } } } });
  if (!business?.programs[0]) return null;
  const card = await prisma.loyaltyCard.findFirst({
    where: { id: cardId, programId: business.programs[0].id },
    select: { id: true, user: { select: { email: true } }, program: { select: { stampsRequired: true, reward: true } }, events: { select: { stampsDelta: true } } }
  });
  if (!card) return null;
  return { id: card.id, email: card.user.email, stamps: card.events.reduce((sum, event) => sum + event.stampsDelta, 0), required: card.program.stampsRequired, reward: card.program.reward };
}
