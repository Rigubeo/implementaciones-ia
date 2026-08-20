import {
  ArrowLeft,
  BellRing,
  Building2,
  Download,
  FileCheck2,
  Mail,
  Phone,
  Repeat2,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { prisma } from "@/lib/db";
import {
  cancelReminderAction,
  deleteReceiptAction,
  saveReminderAction,
  saveSubscriptionAction,
  scheduleStandardRemindersAction,
  uploadReceiptAction,
  updateClientAction
} from "../actions";

type ClientDetailPageProps = {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ notice?: string; error?: string }>;
};

const fieldClass =
  "min-h-11 w-full rounded-lg border border-line bg-cloud px-3 py-2.5 outline-none transition focus:border-ocean focus:bg-white";

export default async function ClientDetailPage({
  params,
  searchParams
}: ClientDetailPageProps) {
  const [{ clientId }, feedback] = await Promise.all([params, searchParams]);
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      user: true,
      subscriptions: { orderBy: { createdAt: "desc" } },
      reminders: {
        include: { subscription: true },
        orderBy: { scheduledFor: "asc" }
      },
      receipts: { orderBy: { issuedAt: "desc" } }
    }
  });

  if (!client) {
    notFound();
  }

  return (
    <>
      <Link
        href="/admin/clientes"
        className="inline-flex items-center gap-2 text-sm font-black text-ocean"
      >
        <ArrowLeft size={17} />
        Volver a clientes
      </Link>

      <section className="mt-5 overflow-hidden rounded-[2rem] bg-ink p-7 text-white shadow-glow md:p-9">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-mint">Ficha del cliente</p>
            <h1 className="mt-3 text-4xl font-black md:text-5xl">{client.name}</h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <Mail size={16} />
                {client.user?.email ?? "Sin correo vinculado"}
              </span>
              {client.phone ? (
                <span className="inline-flex items-center gap-2">
                  <Phone size={16} />
                  {client.phone}
                </span>
              ) : null}
              {client.company ? (
                <span className="inline-flex items-center gap-2">
                  <Building2 size={16} />
                  {client.company}
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Metric label="Suscripciones" value={String(client.subscriptions.length)} />
            <Metric
              label="Avisos activos"
              value={String(client.reminders.filter((item) => item.status === "SCHEDULED").length)}
            />
          </div>
        </div>
      </section>

      {feedback.notice ? <Feedback kind="notice">{feedback.notice}</Feedback> : null}
      {feedback.error ? <Feedback kind="error">{feedback.error}</Feedback> : null}

      <section className="mt-7 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <UserRound className="text-ocean" size={22} />
            <h2 className="text-2xl font-black">Información del cliente</h2>
          </div>

          <form action={updateClientAction} className="mt-6 space-y-4">
            <input type="hidden" name="clientId" value={client.id} />
            <Field label="Nombre completo">
              <input name="name" required defaultValue={client.name} className={fieldClass} />
            </Field>
            <Field label="Empresa o negocio">
              <input name="company" defaultValue={client.company ?? ""} className={fieldClass} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Teléfono">
                <input name="phone" defaultValue={client.phone ?? ""} className={fieldClass} />
              </Field>
              <Field label="Industria">
                <input name="industry" defaultValue={client.industry ?? ""} className={fieldClass} />
              </Field>
            </div>
            <Field label="Notas internas">
              <textarea
                name="notes"
                rows={5}
                defaultValue={client.notes ?? ""}
                className={fieldClass}
                placeholder="Contexto, acuerdos y observaciones del cliente."
              />
            </Field>
            <SubmitButton>Guardar información</SubmitButton>
          </form>
        </article>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Repeat2 className="text-ocean" size={22} />
              <div>
                <h2 className="text-2xl font-black">Suscripciones</h2>
                <p className="mt-1 text-sm text-slate-500">Alta y configuración de servicios recurrentes.</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {client.subscriptions.map((subscription) => (
                <SubscriptionForm
                  key={subscription.id}
                  clientId={client.id}
                  subscription={subscription}
                />
              ))}
              <SubscriptionForm clientId={client.id} />
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BellRing className="text-ocean" size={22} />
              <div>
                <h2 className="text-2xl font-black">Recordatorios</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Programa avisos relacionados con pagos y servicios.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {client.reminders.map((reminder) => (
                <ReminderForm
                  key={reminder.id}
                  clientId={client.id}
                  subscriptions={client.subscriptions}
                  reminder={reminder}
                />
              ))}
              <ReminderForm clientId={client.id} subscriptions={client.subscriptions} />
            </div>
          </section>

          <section className="rounded-[1.5rem] border border-line bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <FileCheck2 className="text-ocean" size={22} />
              <div>
                <h2 className="text-2xl font-black">Comprobantes</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Carga recibos, facturas y comprobantes visibles para el cliente.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {client.receipts.map((receipt) => (
                <ReceiptRow key={receipt.id} receipt={receipt} clientId={client.id} />
              ))}
              <ReceiptUploadForm clientId={client.id} />
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

type SubscriptionRecord = {
  id: string;
  name: string;
  description: string | null;
  status: "ACTIVE" | "PAUSED" | "CANCELLED" | "PAST_DUE";
  amountCents: number;
  currency: string;
  billingDay: number;
  nextBillingAt: Date;
};

function SubscriptionForm({
  clientId,
  subscription
}: {
  clientId: string;
  subscription?: SubscriptionRecord;
}) {
  return (
    <details
      className="rounded-xl border border-line bg-cloud/55 p-5"
      open={!subscription}
    >
      <summary className="cursor-pointer list-none font-black">
        {subscription ? subscription.name : "Dar de alta una suscripción"}
        {subscription ? (
          <span className="ml-3 rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
            {subscriptionStatusLabel(subscription.status)}
          </span>
        ) : null}
      </summary>

      <form action={saveSubscriptionAction} className="mt-5 space-y-4">
        <input type="hidden" name="clientId" value={clientId} />
        {subscription ? (
          <input type="hidden" name="subscriptionId" value={subscription.id} />
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Servicio">
            <input
              name="name"
              required
              defaultValue={subscription?.name ?? ""}
              className={fieldClass}
              placeholder="Secretaría Virtual"
            />
          </Field>
          <Field label="Estado">
            <select
              name="status"
              defaultValue={subscription?.status ?? "ACTIVE"}
              className={fieldClass}
            >
              <option value="ACTIVE">Activa</option>
              <option value="PAUSED">Pausada</option>
              <option value="PAST_DUE">Pago vencido</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </Field>
        </div>
        <Field label="Descripción">
          <textarea
            name="description"
            rows={3}
            defaultValue={subscription?.description ?? ""}
            className={fieldClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Importe">
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue={subscription ? subscription.amountCents / 100 : ""}
              className={fieldClass}
            />
          </Field>
          <Field label="Moneda">
            <select
              name="currency"
              defaultValue={subscription?.currency ?? "usd"}
              className={fieldClass}
            >
              <option value="usd">USD</option>
              <option value="mxn">MXN</option>
            </select>
          </Field>
          <Field label="Día de cobro">
            <input
              name="billingDay"
              type="number"
              min="1"
              max="28"
              required
              defaultValue={subscription?.billingDay ?? 1}
              className={fieldClass}
            />
          </Field>
          <Field label="Próxima renovación">
            <input
              name="nextBillingAt"
              type="date"
              required
              defaultValue={subscription ? inputDate(subscription.nextBillingAt) : ""}
              className={fieldClass}
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-3">
          <SubmitButton>{subscription ? "Actualizar suscripción" : "Crear suscripción"}</SubmitButton>
        </div>
      </form>

      {subscription ? (
        <form action={scheduleStandardRemindersAction} className="mt-3">
          <input type="hidden" name="subscriptionId" value={subscription.id} />
          <SubmitButton variant="secondary">Programar avisos de 5 y 1 día</SubmitButton>
        </form>
      ) : null}
    </details>
  );
}

type ReminderRecord = {
  id: string;
  subscriptionId: string | null;
  title: string;
  message: string;
  daysBefore: number | null;
  scheduledFor: Date;
  status: "SCHEDULED" | "SENT" | "CANCELLED";
};

type ReceiptRecord = {
  id: string;
  title: string;
  documentNumber: string | null;
  type: "RECEIPT" | "INVOICE" | "PAYMENT_PROOF" | "OTHER";
  amountCents: number | null;
  currency: string;
  issuedAt: Date;
  fileName: string;
  sizeBytes: number;
};

function ReceiptRow({ receipt, clientId }: { receipt: ReceiptRecord; clientId: string }) {
  return (
    <article className="rounded-xl border border-line bg-cloud/55 p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-black">{receipt.title}</p>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500">
              {receiptTypeLabel(receipt.type)}
            </span>
          </div>
          <p className="mt-2 truncate text-sm text-slate-500">{receipt.fileName}</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-slate-500">
            <span>{formatDate(receipt.issuedAt)}</span>
            <span>{formatFileSize(receipt.sizeBytes)}</span>
            {receipt.amountCents !== null ? (
              <span>{formatMoney(receipt.amountCents, receipt.currency)}</span>
            ) : null}
            {receipt.documentNumber ? <span>Folio: {receipt.documentNumber}</span> : null}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/api/comprobantes/${receipt.id}/descargar`}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-black text-ocean"
          >
            <Download size={16} />
            Descargar
          </a>
          <form action={deleteReceiptAction}>
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="receiptId" value={receipt.id} />
            <SubmitButton variant="danger">Eliminar</SubmitButton>
          </form>
        </div>
      </div>
    </article>
  );
}

function ReceiptUploadForm({ clientId }: { clientId: string }) {
  return (
    <details className="rounded-xl border border-dashed border-ocean/35 bg-ocean/5 p-5">
      <summary className="cursor-pointer list-none font-black text-ocean">
        Cargar nuevo comprobante
      </summary>
      <form action={uploadReceiptAction} className="mt-5 space-y-4">
        <input type="hidden" name="clientId" value={clientId} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <input
              name="title"
              required
              className={fieldClass}
              placeholder="Recibo de julio 2026"
            />
          </Field>
          <Field label="Tipo">
            <select name="type" defaultValue="RECEIPT" className={fieldClass}>
              <option value="RECEIPT">Recibo</option>
              <option value="INVOICE">Factura</option>
              <option value="PAYMENT_PROOF">Comprobante de pago</option>
              <option value="OTHER">Otro documento</option>
            </select>
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Folio o referencia">
            <input name="documentNumber" className={fieldClass} />
          </Field>
          <Field label="Importe">
            <input name="amount" type="number" min="0.01" step="0.01" className={fieldClass} />
          </Field>
          <Field label="Moneda">
            <select name="currency" defaultValue="usd" className={fieldClass}>
              <option value="usd">USD</option>
              <option value="mxn">MXN</option>
            </select>
          </Field>
          <Field label="Fecha de emisión">
            <input name="issuedAt" type="date" required className={fieldClass} />
          </Field>
        </div>
        <Field label="Archivo privado">
          <input
            name="file"
            type="file"
            required
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className="block w-full rounded-lg border border-line bg-white p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-ink file:px-4 file:py-2 file:font-black file:text-white"
          />
        </Field>
        <p className="text-xs text-slate-500">PDF, JPG, PNG o WebP. Máximo 8 MB.</p>
        <SubmitButton>Cargar comprobante</SubmitButton>
      </form>
    </details>
  );
}

function ReminderForm({
  clientId,
  subscriptions,
  reminder
}: {
  clientId: string;
  subscriptions: SubscriptionRecord[];
  reminder?: ReminderRecord;
}) {
  return (
    <details className="rounded-xl border border-line bg-cloud/55 p-5" open={!reminder}>
      <summary className="cursor-pointer list-none font-black">
        {reminder ? reminder.title : "Crear recordatorio"}
        {reminder ? (
          <span className="ml-3 rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
            {reminderStatusLabel(reminder.status)}
          </span>
        ) : null}
      </summary>

      <form action={saveReminderAction} className="mt-5 space-y-4">
        <input type="hidden" name="clientId" value={clientId} />
        {reminder ? <input type="hidden" name="reminderId" value={reminder.id} /> : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título">
            <input
              name="title"
              required
              defaultValue={reminder?.title ?? ""}
              className={fieldClass}
              placeholder="Próxima renovación"
            />
          </Field>
          <Field label="Suscripción relacionada">
            <select
              name="subscriptionId"
              defaultValue={reminder?.subscriptionId ?? ""}
              className={fieldClass}
            >
              <option value="">Sin suscripción</option>
              {subscriptions.map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  {subscription.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Mensaje">
          <textarea
            name="message"
            rows={3}
            required
            defaultValue={reminder?.message ?? ""}
            className={fieldClass}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Fecha programada">
            <input
              name="scheduledFor"
              type="date"
              required
              defaultValue={reminder ? inputDate(reminder.scheduledFor) : ""}
              className={fieldClass}
            />
          </Field>
          <Field label="Días antes">
            <input
              name="daysBefore"
              type="number"
              min="0"
              max="365"
              defaultValue={reminder?.daysBefore ?? ""}
              className={fieldClass}
            />
          </Field>
          <Field label="Estado">
            <select
              name="status"
              defaultValue={reminder?.status ?? "SCHEDULED"}
              className={fieldClass}
            >
              <option value="SCHEDULED">Programado</option>
              <option value="SENT">Enviado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </Field>
        </div>
        <SubmitButton>{reminder ? "Actualizar recordatorio" : "Crear recordatorio"}</SubmitButton>
      </form>

      {reminder && reminder.status !== "CANCELLED" ? (
        <form action={cancelReminderAction} className="mt-3">
          <input type="hidden" name="clientId" value={clientId} />
          <input type="hidden" name="reminderId" value={reminder.id} />
          <SubmitButton variant="danger">Cancelar recordatorio</SubmitButton>
        </form>
      ) : null}
    </details>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-center">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-bold text-slate-300">{label}</p>
    </div>
  );
}

function Feedback({
  kind,
  children
}: {
  kind: "notice" | "error";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`mt-5 rounded-xl border px-5 py-4 text-sm font-bold ${
        kind === "notice"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {children}
    </div>
  );
}

function inputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
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

function formatFileSize(sizeBytes: number) {
  if (sizeBytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(sizeBytes / 1024))} KB`;
  }
  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function receiptTypeLabel(type: ReceiptRecord["type"]) {
  return {
    RECEIPT: "Recibo",
    INVOICE: "Factura",
    PAYMENT_PROOF: "Comprobante de pago",
    OTHER: "Otro"
  }[type];
}

function subscriptionStatusLabel(status: SubscriptionRecord["status"]) {
  return {
    ACTIVE: "Activa",
    PAUSED: "Pausada",
    CANCELLED: "Cancelada",
    PAST_DUE: "Pago vencido"
  }[status];
}

function reminderStatusLabel(status: ReminderRecord["status"]) {
  return {
    SCHEDULED: "Programado",
    SENT: "Enviado",
    CANCELLED: "Cancelado"
  }[status];
}
