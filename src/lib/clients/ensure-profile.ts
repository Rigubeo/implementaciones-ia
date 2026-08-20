import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getUserRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";

export async function ensureClientProfile(user: SupabaseUser) {
  const role = getUserRole(user.user_metadata, user.app_metadata);

  if (role !== "CLIENT" || !user.email) {
    return null;
  }

  const fullName =
    typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : user.email.split("@")[0];

  const databaseUser = await prisma.user.upsert({
    where: { email: user.email },
    update: { id: user.id, name: fullName, role: "CLIENT" },
    create: {
      id: user.id,
      email: user.email,
      name: fullName,
      role: "CLIENT"
    }
  });

  return prisma.client.upsert({
    where: { userId: databaseUser.id },
    update: { name: fullName },
    create: {
      userId: databaseUser.id,
      name: fullName
    }
  });
}
