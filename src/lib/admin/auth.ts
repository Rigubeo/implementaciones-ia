import { redirect } from "next/navigation";
import { canAccessAdmin, getUserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/iniciar-sesion?redirectTo=/admin");
  }

  const role = getUserRole(user.user_metadata, user.app_metadata);

  if (!canAccessAdmin(role)) {
    redirect("/panel");
  }

  return user;
}
