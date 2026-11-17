"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { clearCardholderEmail, getCardholderEmail } from "@/lib/loyalty-session";

export async function joinCard(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(slug)) return;
  const email = await getCardholderEmail();
  if (!email) return;
  const business = await prisma.loyaltyBusiness.findFirst({ where: { slug, active: true }, include: { programs: { where: { active: true }, take: 1, orderBy: { createdAt: "asc" } } } });
  const program = business?.programs[0];
  if (!program) return;
  await prisma.loyaltyCard.upsert({ where: { programId_holderEmail: { programId: program.id, holderEmail: email } }, update: {}, create: { programId: program.id, holderEmail: email } });
  revalidatePath(`/tarjeta/${slug}`);
}

export async function switchCardEmail(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(slug)) return;
  await clearCardholderEmail();
  redirect(`/tarjeta/${slug}`);
}
