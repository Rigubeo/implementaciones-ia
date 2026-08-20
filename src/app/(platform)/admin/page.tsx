import { BellRing, CircleDollarSign, Repeat2, UsersRound } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminPage() {
  const [clientCount, activeSubscriptions, scheduledReminders, monthlyRevenue] =
    await Promise.all([
      prisma.client.count(),
      prisma.subscription.count({ where: { status: "ACTIVE" } }),
      prisma.reminder.count({ where: { status: "SCHEDULED" } }),
      prisma.subscription.aggregate({
        where: { status: "ACTIVE", currency: "usd" },
        _sum: { amountCents: true }
      })
    ]);

  const cards = [
    { label: "Clientes", value: clientCount, icon: UsersRound },
    { label: "Suscripciones activas", value: activeSubscriptions, icon: Repeat2 },
    { label: "Recordatorios programados", value: scheduledReminders, icon: BellRing },
    {
      label: "Ingreso mensual registrado",
      value: formatUsd(monthlyRevenue._sum.amountCents ?? 0),
      icon: CircleDollarSign
    }
  ];

  const upcoming = await prisma.reminder.findMany({
    where: { status: "SCHEDULED" },
    include: { client: true },
    orderBy: { scheduledFor: "asc" },
    take: 5
  });

  return (
    <>
      <section className="overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-glow md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-mint">Administración</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
          Control de clientes y servicios
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Configura perfiles, suscripciones y recordatorios desde un solo espacio.
        </p>
        <Link
          href="/admin/clientes"
          className="mt-7 inline-flex rounded-lg bg-ocean px-5 py-3 font-black text-white transition hover:bg-electric"
        >
          Administrar clientes
        </Link>
      </section>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-electric">
                <Icon size={21} />
              </div>
              <p className="mt-5 text-3xl font-black">{card.value}</p>
              <p className="mt-1 text-sm font-bold text-slate-500">{card.label}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-7 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-ocean">
              Próximos avisos
            </p>
            <h2 className="mt-2 text-2xl font-black">Actividad programada</h2>
          </div>
          <Link href="/admin/clientes" className="text-sm font-black text-ocean">
            Ver clientes
          </Link>
        </div>

        <div className="mt-5 divide-y divide-line">
          {upcoming.length ? (
            upcoming.map((reminder) => (
              <Link
                key={reminder.id}
                href={`/admin/clientes/${reminder.clientId}`}
                className="grid gap-2 py-4 transition hover:text-ocean sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-black">{reminder.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{reminder.client.name}</p>
                </div>
                <p className="text-sm font-bold text-slate-500">
                  {formatDate(reminder.scheduledFor)}
                </p>
              </Link>
            ))
          ) : (
            <p className="py-6 text-slate-500">No hay recordatorios programados.</p>
          )}
        </div>
      </section>
    </>
  );
}

function formatUsd(amountCents: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0
  }).format(amountCents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
