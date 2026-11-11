"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function joinCard(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(slug)) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !user.email_confirmed_at) return;
  const business = await prisma.loyaltyBusiness.findFirst({ where: { slug, active: true }, include: { programs: { where: { active: true }, take: 1, orderBy: { createdAt: "asc" } } } });
  const program = business?.programs[0];
  if (!program) return;
  const existing = await prisma.user.findUnique({ where: { email: user.email } });
  if (existing && existing.id !== user.id) return;
  await prisma.user.upsert({ where: { id: user.id }, update: {}, create: { id: user.id, email: user.email } });
  await prisma.loyaltyCard.upsert({ where: { programId_userId: { programId: program.id, userId: user.id } }, update: {}, create: { programId: program.id, userId: user.id } });
  revalidatePath(`/tarjeta/${slug}`);
}

export async function switchCardEmail(form: FormData) {
  const slug = String(form.get("slug") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(slug)) return;
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/tarjeta/${slug}`);
}
