import { BellRing, CalendarClock, CheckCircle2 } from "lucide-react";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function RemindersPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const reminders = user
    ? await prisma.reminder.findMany({
        where: {
          client: { userId: user.id },
          status: "SCHEDULED"
        },
        include: { subscription: true },
        orderBy: { scheduledFor: "asc" }
      })
    : [];

  if (reminders.length === 0) {
    return (
      <PanelEmptyState
        icon={BellRing}
        title="Recordatorios"
        description="Consulta próximas renovaciones, pagos pendientes, documentos solicitados y acciones relacionadas con tu servicio."
        note="Cuando programemos un aviso, aquí aparecerán su fecha, motivo y servicio relacionado."
      />
    );
  }

  return (
    <>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Próximos avisos</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Recordatorios</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Mantén visibles las fechas importantes relacionadas con tus servicios y renovaciones.
        </p>
      </section>

      <section className="mt-8 space-y-4">
        {reminders.map((reminder) => (
          <article
            key={reminder.id}
            className="grid gap-5 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-electric">
              <BellRing size={22} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black">{reminder.title}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                  <CheckCircle2 size={14} />
                  Programado
                </span>
              </div>
              <p className="mt-2 leading-7 text-slate-600">{reminder.message}</p>
              {reminder.subscription ? (
                <p className="mt-3 text-sm font-bold text-ocean">{reminder.subscription.name}</p>
              ) : null}
            </div>

            <div className="rounded-xl bg-cloud px-5 py-4 md:min-w-[190px]">
              <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                <CalendarClock size={18} className="text-ocean" />
                {formatDate(reminder.scheduledFor)}
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {reminder.daysBefore === 1
                  ? "1 día antes"
                  : `${reminder.daysBefore ?? 0} días antes`}
              </p>
            </div>
          </article>
        ))}
      </section>

      <aside className="mt-6 rounded-xl border border-ocean/15 bg-ocean/5 p-5 text-sm leading-6 text-slate-600">
        Por ahora los avisos se muestran dentro de Mi Panel. El siguiente paso será activar su envío
        automático por correo.
      </aside>
    </>
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}
