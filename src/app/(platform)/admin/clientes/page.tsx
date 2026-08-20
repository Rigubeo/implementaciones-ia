import { BellRing, Building2, Mail, Repeat2, Search, UserRound } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

type ClientsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const clients = await prisma.client.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { company: { contains: query, mode: "insensitive" } },
            { user: { email: { contains: query, mode: "insensitive" } } }
          ]
        }
      : undefined,
    include: {
      user: true,
      subscriptions: {
        where: { status: "ACTIVE" },
        orderBy: { nextBillingAt: "asc" }
      },
      reminders: {
        where: { status: "SCHEDULED" },
        orderBy: { scheduledFor: "asc" }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <>
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Directorio</p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Clientes</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Consulta y configura perfiles, suscripciones y recordatorios.
          </p>
        </div>

        <form className="flex w-full max-w-md items-center gap-2 rounded-xl border border-line bg-white p-2 shadow-sm">
          <Search size={19} className="ml-2 shrink-0 text-slate-400" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por nombre, empresa o correo"
            className="min-h-10 min-w-0 flex-1 bg-transparent px-2 outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-ink px-4 py-2.5 text-sm font-black text-white"
          >
            Buscar
          </button>
        </form>
      </section>

      <section className="mt-8 grid gap-4">
        {clients.length ? (
          clients.map((client) => {
            const activeSubscription = client.subscriptions[0];
            const nextReminder = client.reminders[0];

            return (
              <Link
                key={client.id}
                href={`/admin/clientes/${client.id}`}
                className="group grid gap-5 rounded-[1.5rem] border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ocean hover:shadow-panel md:grid-cols-[1fr_auto] md:items-center md:p-6"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink text-electric">
                    <UserRound size={22} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-black group-hover:text-ocean">
                      {client.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <Mail size={15} />
                        {client.user?.email ?? "Sin correo vinculado"}
                      </span>
                      {client.company ? (
                        <span className="inline-flex items-center gap-2">
                          <Building2 size={15} />
                          {client.company}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2 md:min-w-[390px]">
                  <div className="rounded-xl bg-cloud px-4 py-3">
                    <p className="flex items-center gap-2 font-black">
                      <Repeat2 size={16} className="text-ocean" />
                      Suscripción
                    </p>
                    <p className="mt-1 truncate text-slate-500">
                      {activeSubscription?.name ?? "Sin servicio activo"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-cloud px-4 py-3">
                    <p className="flex items-center gap-2 font-black">
                      <BellRing size={16} className="text-ocean" />
                      Próximo aviso
                    </p>
                    <p className="mt-1 text-slate-500">
                      {nextReminder ? formatDate(nextReminder.scheduledFor) : "Sin programar"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-line bg-white p-10 text-center">
            <p className="text-xl font-black">No encontramos clientes</p>
            <p className="mt-2 text-slate-500">Prueba con otro nombre, empresa o correo.</p>
          </div>
        )}
      </section>
    </>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
