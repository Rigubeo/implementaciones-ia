import Image from "next/image";
import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";
import { redirect } from "next/navigation";
import { PanelNavigation } from "@/components/panel/PanelNavigation";
import { canAccessAdmin, getUserRole } from "@/lib/auth/roles";
import { ensureClientProfile } from "@/lib/clients/ensure-profile";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "./actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/iniciar-sesion");
  }

  const fullName =
    typeof user.user_metadata.full_name === "string" && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name
      : "Cliente";
  const role = getUserRole(user.user_metadata, user.app_metadata);

  if (role === "CLIENT") {
    await ensureClientProfile(user);
  }

  return (
    <main className="min-h-screen bg-cloud text-ink lg:flex">
      <PanelNavigation />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-line bg-cloud/90 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="ml-14 flex items-center gap-3 lg:ml-0">
                <Image
                  src="/brand/logo-implementaciones-ia.png"
                  alt=""
                  width={38}
                  height={38}
                  className="rounded-full bg-white"
                />
                <span className="hidden text-sm font-black sm:block">Soluciones Tecnológicas para Todos</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {canAccessAdmin(role) ? (
                <Link
                  href="/admin"
                  className="hidden rounded-lg border border-line bg-white px-3 py-2 text-xs font-black text-ocean transition hover:border-ocean sm:block"
                >
                  Administración
                </Link>
              ) : null}
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black">{fullName}</p>
                <p className="max-w-[230px] truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-electric">
                <UserRound size={19} />
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white text-slate-500 transition hover:border-red-200 hover:text-red-600"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={18} />
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-10">{children}</div>
      </div>
    </main>
  );
}
