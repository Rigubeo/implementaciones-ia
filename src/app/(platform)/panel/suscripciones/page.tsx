import { CalendarDays, CheckCircle2, Repeat2 } from "lucide-react";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const subscriptions = user
    ? await prisma.subscription.findMany({
        where: { client: { userId: user.id } },
        orderBy: { nextBillingAt: "asc" }
      })
    : [];

  if (subscriptions.length === 0) {
    return (
      <PanelEmptyState
        icon={Repeat2}
        title="Suscripciones"
        description="Consulta planes de soporte, mantenimiento, alojamiento y operación continua de tus automatizaciones."
        note="Cuando actives un servicio recurrente, aquí aparecerán su estado, importe y próxima renovación."
      />
    );
  }

  return (
    <>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Servicios recurrentes</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Suscripciones</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Consulta el estado, importe y próxima fecha de renovación de tus servicios activos.
        </p>
      </section>

      <section className="mt-8 space-y-5">
        {subscriptions.map((subscription) => (
          <article
            key={subscription.id}
            className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-panel"
          >
            <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-start md:p-8">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-electric">
                    <Repeat2 size={23} />
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                    <CheckCircle2 size={15} />
                    Activa
                  </span>
                </div>
                <h2 className="mt-5 text-3xl font-black">{subscription.name}</h2>
                <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                  {subscription.description ?? "Servicio recurrente asociado a tu cuenta."}
                </p>
              </div>

              <div className="rounded-2xl bg-ink px-6 py-5 text-white md:min-w-[230px]">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-mint">Importe mensual</p>
                <p className="mt-2 text-3xl font-black">
                  {formatMoney(subscription.amountCents, subscription.currency)}
                </p>
                <p className="mt-1 text-sm text-slate-300">por mes</p>
              </div>
            </div>

            <div className="grid gap-4 border-t border-line bg-cloud/70 p-6 sm:grid-cols-2 md:p-8">
              <div className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 text-ocean" size={21} />
                <div>
                  <p className="text-sm font-black">Próxima renovación</p>
                  <p className="mt-1 text-slate-600">{formatDate(subscription.nextBillingAt)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Repeat2 className="mt-0.5 text-ocean" size={21} />
                <div>
                  <p className="text-sm font-black">Periodicidad</p>
                  <p className="mt-1 text-slate-600">Mensual, cada día {subscription.billingDay}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0
  }).format(amountCents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
