import Image from "next/image";
import Link from "next/link";
import { LogOut, UserRoundCog } from "lucide-react";
import { AdminNavigation } from "@/components/admin/AdminNavigation";
import { requireAdmin } from "@/lib/admin/auth";
import { signOutAction } from "../panel/actions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <main className="min-h-screen bg-cloud text-ink lg:flex">
      <AdminNavigation />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-line bg-cloud/90 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <Link href="/" className="ml-14 flex items-center gap-3 lg:ml-0">
              <Image
                src="/brand/logo-implementaciones-ia.png"
                alt=""
                width={38}
                height={38}
                className="rounded-full bg-white"
              />
              <span className="hidden text-sm font-black sm:block">
                Soluciones Tecnológicas para Todos
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-black">Administrador</p>
                <p className="max-w-[230px] truncate text-xs text-slate-500">{user.email}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-electric">
                <UserRoundCog size={19} />
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

        <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">{children}</div>
      </div>
    </main>
  );
}
