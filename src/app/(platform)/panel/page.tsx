import { BellRing, CreditCard, FileCheck2, Repeat2 } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function PanelHomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const firstName =
    typeof user?.user_metadata.full_name === "string"
      ? user.user_metadata.full_name.split(" ")[0]
      : "Cliente";

  const [activeSubscriptions, scheduledReminders, receiptCount] = user
    ? await Promise.all([
        prisma.subscription.count({
          where: {
            client: { userId: user.id },
            status: "ACTIVE"
          }
        }),
        prisma.reminder.count({
          where: {
            client: { userId: user.id },
            status: "SCHEDULED"
          }
        }),
        prisma.receipt.count({
          where: { client: { userId: user.id } }
        })
      ])
    : [0, 0, 0];

  const modules = [
    {
      title: "Pagos únicos",
      text: "Órdenes por implementaciones, diagnósticos y proyectos.",
      href: "/panel/pagos",
      icon: CreditCard,
      value: "0 pendientes"
    },
    {
      title: "Suscripciones",
      text: "Servicios recurrentes, mantenimiento y soporte mensual.",
      href: "/panel/suscripciones",
      icon: Repeat2,
      value:
        activeSubscriptions === 1
          ? "1 activa"
          : activeSubscriptions > 1
            ? `${activeSubscriptions} activas`
            : "Sin plan activo"
    },
    {
      title: "Comprobantes",
      text: "Recibos, referencias e historial descargable.",
      href: "/panel/comprobantes",
      icon: FileCheck2,
      value: receiptCount === 1 ? "1 documento" : `${receiptCount} documentos`
    },
    {
      title: "Recordatorios",
      text: "Renovaciones, pagos y acciones importantes.",
      href: "/panel/recordatorios",
      icon: BellRing,
      value:
        scheduledReminders === 1
          ? "1 programado"
          : scheduledReminders > 1
            ? `${scheduledReminders} programados`
            : "Todo al día"
    }
  ] as const;

  return (
    <>
      <section className="overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-glow md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-mint">Resumen personal</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Bienvenido, {firstName}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-300">
          Aquí puedes consultar la información relacionada con tus servicios, renovaciones y documentos.
        </p>
      </section>

      <section className="mt-7 grid gap-4 md:grid-cols-2">
        {modules.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[1.5rem] border border-line bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-ocean hover:shadow-panel"
            >
              <div className="flex items-start justify-between gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-electric">
                  <Icon size={22} />
                </div>
                <span className="rounded-full bg-cloud px-3 py-1 text-xs font-black text-slate-600">
                  {item.value}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-black group-hover:text-ocean">{item.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{item.text}</p>
            </Link>
          );
        })}
      </section>
    </>
  );
}
