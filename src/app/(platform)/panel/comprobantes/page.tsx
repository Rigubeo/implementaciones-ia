import { Download, FileCheck2 } from "lucide-react";
import { PanelEmptyState } from "@/components/panel/PanelEmptyState";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export default async function ReceiptsPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const receipts = user
    ? await prisma.receipt.findMany({
        where: { client: { userId: user.id } },
        orderBy: { issuedAt: "desc" }
      })
    : [];

  if (!receipts.length) {
    return (
      <PanelEmptyState
        icon={FileCheck2}
        title="Comprobantes"
        description="Aquí encontrarás recibos, facturas y documentos relacionados con tus pagos."
        note="Cuando nuestro equipo cargue un documento, aparecerá automáticamente en esta sección."
      />
    );
  }

  return (
    <>
      <section>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Documentos privados</p>
        <h1 className="mt-3 text-4xl font-black md:text-5xl">Comprobantes</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Descarga recibos, facturas y comprobantes asociados a tu cuenta.
        </p>
      </section>

      <section className="mt-8 grid gap-4">
        {receipts.map((receipt) => (
          <article
            key={receipt.id}
            className="grid gap-5 rounded-[1.5rem] border border-line bg-white p-6 shadow-sm md:grid-cols-[auto_1fr_auto] md:items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink text-electric">
              <FileCheck2 size={22} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black">{receipt.title}</h2>
                <span className="rounded-full bg-cloud px-3 py-1 text-xs font-black text-slate-500">
                  {receiptTypeLabel(receipt.type)}
                </span>
              </div>
              <p className="mt-2 truncate text-sm text-slate-500">{receipt.fileName}</p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-slate-500">
                <span>{formatDate(receipt.issuedAt)}</span>
                {receipt.amountCents !== null ? (
                  <span>{formatMoney(receipt.amountCents, receipt.currency)}</span>
                ) : null}
                {receipt.documentNumber ? <span>Folio: {receipt.documentNumber}</span> : null}
              </div>
            </div>
            <a
              href={`/api/comprobantes/${receipt.id}/descargar`}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ocean px-4 py-2.5 text-sm font-black text-white transition hover:bg-electric"
            >
              <Download size={17} />
              Descargar
            </a>
          </article>
        ))}
      </section>

      <aside className="mt-6 rounded-xl border border-ocean/15 bg-ocean/5 p-5 text-sm leading-6 text-slate-600">
        Los enlaces de descarga son privados y expiran automáticamente.
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

function formatMoney(amountCents: number, currency: string) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0
  }).format(amountCents / 100);
}

function receiptTypeLabel(type: "RECEIPT" | "INVOICE" | "PAYMENT_PROOF" | "OTHER") {
  return {
    RECEIPT: "Recibo",
    INVOICE: "Factura",
    PAYMENT_PROOF: "Comprobante de pago",
    OTHER: "Otro"
  }[type];
}
