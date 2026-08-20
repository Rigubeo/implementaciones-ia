"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/db";
import { createAdminClient } from "@/lib/supabase/admin";

const RECEIPTS_BUCKET = "client-documents";
const MAX_RECEIPT_SIZE = 8 * 1024 * 1024;
const ALLOWED_RECEIPT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

const clientSchema = z.object({
  clientId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160),
  phone: z.string().trim().max(30),
  industry: z.string().trim().max(120),
  notes: z.string().trim().max(2000)
});

const subscriptionSchema = z.object({
  subscriptionId: z.string().optional(),
  clientId: z.string().min(1),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(1000),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED", "PAST_DUE"]),
  amount: z.coerce.number().positive().max(1_000_000),
  currency: z.enum(["usd", "mxn"]),
  billingDay: z.coerce.number().int().min(1).max(28),
  nextBillingAt: z.string().date()
});

const reminderSchema = z.object({
  reminderId: z.string().optional(),
  clientId: z.string().min(1),
  subscriptionId: z.string().optional(),
  title: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(1200),
  daysBefore: z.union([z.coerce.number().int().min(0).max(365), z.literal("")]).optional(),
  scheduledFor: z.string().date(),
  status: z.enum(["SCHEDULED", "SENT", "CANCELLED"])
});

const receiptSchema = z.object({
  clientId: z.string().min(1),
  title: z.string().trim().min(2).max(160),
  documentNumber: z.string().trim().max(120),
  type: z.enum(["RECEIPT", "INVOICE", "PAYMENT_PROOF", "OTHER"]),
  amount: z.union([z.coerce.number().positive().max(1_000_000), z.literal("")]).optional(),
  currency: z.enum(["usd", "mxn"]),
  issuedAt: z.string().date()
});

export async function updateClientAction(formData: FormData) {
  await requireAdmin();
  const parsed = clientSchema.safeParse(readForm(formData));

  if (!parsed.success) {
    redirectWithMessage(String(formData.get("clientId") ?? ""), "error", "Revisa la información del cliente.");
  }

  const data = parsed.data;
  const client = await prisma.client.findUnique({ where: { id: data.clientId } });

  if (!client) {
    redirect("/admin/clientes");
  }

  await prisma.$transaction([
    prisma.client.update({
      where: { id: data.clientId },
      data: {
        name: data.name,
        company: emptyToNull(data.company),
        phone: emptyToNull(data.phone),
        industry: emptyToNull(data.industry),
        notes: emptyToNull(data.notes)
      }
    }),
    ...(client.userId
      ? [
          prisma.user.update({
            where: { id: client.userId },
            data: { name: data.name }
          })
        ]
      : [])
  ]);

  refreshClient(data.clientId);
  redirectWithMessage(data.clientId, "notice", "Información del cliente actualizada.");
}

export async function saveSubscriptionAction(formData: FormData) {
  await requireAdmin();
  const parsed = subscriptionSchema.safeParse(readForm(formData));
  const clientId = String(formData.get("clientId") ?? "");

  if (!parsed.success) {
    redirectWithMessage(clientId, "error", "Revisa los datos de la suscripción.");
  }

  const data = parsed.data;
  const payload = {
    clientId: data.clientId,
    name: data.name,
    description: emptyToNull(data.description),
    status: data.status,
    amountCents: Math.round(data.amount * 100),
    currency: data.currency,
    billingInterval: "month",
    billingDay: data.billingDay,
    nextBillingAt: dateAtNoonUtc(data.nextBillingAt)
  } as const;

  if (data.subscriptionId) {
    await prisma.subscription.update({
      where: { id: data.subscriptionId },
      data: payload
    });
  } else {
    await prisma.subscription.create({ data: payload });
  }

  refreshClient(data.clientId);
  redirectWithMessage(
    data.clientId,
    "notice",
    data.subscriptionId ? "Suscripción actualizada." : "Suscripción creada."
  );
}

export async function scheduleStandardRemindersAction(formData: FormData) {
  await requireAdmin();
  const subscriptionId = String(formData.get("subscriptionId") ?? "");
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { client: true }
  });

  if (!subscription) {
    redirect("/admin/clientes");
  }

  const amount = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: subscription.currency.toUpperCase(),
    minimumFractionDigits: 0
  }).format(subscription.amountCents / 100);

  const specs = [
    {
      daysBefore: 5,
      title: "Próxima renovación",
      message: `Tu suscripción de ${subscription.name} se renovará en 5 días por ${amount}.`
    },
    {
      daysBefore: 1,
      title: "Renovación mañana",
      message: `Tu suscripción de ${subscription.name} se renovará mañana por ${amount}.`
    }
  ];

  await prisma.$transaction(
    specs.map((spec) => {
      const scheduledFor = subtractDays(subscription.nextBillingAt, spec.daysBefore);
      return prisma.reminder.upsert({
        where: {
          subscriptionId_daysBefore_scheduledFor: {
            subscriptionId: subscription.id,
            daysBefore: spec.daysBefore,
            scheduledFor
          }
        },
        update: {
          title: spec.title,
          message: spec.message,
          status: "SCHEDULED"
        },
        create: {
          clientId: subscription.clientId,
          subscriptionId: subscription.id,
          title: spec.title,
          message: spec.message,
          daysBefore: spec.daysBefore,
          scheduledFor,
          status: "SCHEDULED"
        }
      });
    })
  );

  refreshClient(subscription.clientId);
  redirectWithMessage(subscription.clientId, "notice", "Recordatorios de 5 y 1 día programados.");
}

export async function saveReminderAction(formData: FormData) {
  await requireAdmin();
  const parsed = reminderSchema.safeParse(readForm(formData));
  const clientId = String(formData.get("clientId") ?? "");

  if (!parsed.success) {
    redirectWithMessage(clientId, "error", "Revisa los datos del recordatorio.");
  }

  const data = parsed.data;
  const payload = {
    clientId: data.clientId,
    subscriptionId: emptyToNull(data.subscriptionId ?? ""),
    title: data.title,
    message: data.message,
    daysBefore: data.daysBefore === "" || data.daysBefore === undefined ? null : data.daysBefore,
    scheduledFor: dateAtNoonUtc(data.scheduledFor),
    status: data.status
  } as const;

  if (data.reminderId) {
    await prisma.reminder.update({
      where: { id: data.reminderId },
      data: payload
    });
  } else {
    await prisma.reminder.create({ data: payload });
  }

  refreshClient(data.clientId);
  redirectWithMessage(
    data.clientId,
    "notice",
    data.reminderId ? "Recordatorio actualizado." : "Recordatorio creado."
  );
}

export async function cancelReminderAction(formData: FormData) {
  await requireAdmin();
  const reminderId = String(formData.get("reminderId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");

  await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: "CANCELLED" }
  });

  refreshClient(clientId);
  redirectWithMessage(clientId, "notice", "Recordatorio cancelado.");
}

export async function uploadReceiptAction(formData: FormData) {
  await requireAdmin();
  const parsed = receiptSchema.safeParse(readForm(formData));
  const clientId = String(formData.get("clientId") ?? "");
  const file = formData.get("file");

  if (!parsed.success || !(file instanceof File)) {
    redirectWithMessage(clientId, "error", "Revisa la información y selecciona un archivo.");
  }

  if (file.size === 0 || file.size > MAX_RECEIPT_SIZE) {
    redirectWithMessage(clientId, "error", "El archivo debe pesar menos de 8 MB.");
  }

  if (!ALLOWED_RECEIPT_TYPES.has(file.type)) {
    redirectWithMessage(clientId, "error", "Solo se permiten archivos PDF, JPG, PNG o WebP.");
  }

  const data = parsed.data;
  const storage = createAdminClient();
  const receiptId = crypto.randomUUID();
  const safeFileName = sanitizeFileName(file.name);
  const storagePath = `${data.clientId}/${receiptId}-${safeFileName}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await storage.storage
    .from(RECEIPTS_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    redirectWithMessage(clientId, "error", "No pudimos guardar el archivo en este momento.");
  }

  try {
    await prisma.receipt.create({
      data: {
        id: receiptId,
        clientId: data.clientId,
        title: data.title,
        documentNumber: emptyToNull(data.documentNumber),
        type: data.type,
        amountCents:
          data.amount === "" || data.amount === undefined ? null : Math.round(data.amount * 100),
        currency: data.currency,
        issuedAt: dateAtNoonUtc(data.issuedAt),
        storagePath,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size
      }
    });
  } catch (error) {
    await storage.storage.from(RECEIPTS_BUCKET).remove([storagePath]);
    throw error;
  }

  refreshClient(data.clientId);
  revalidatePath("/panel/comprobantes");
  redirectWithMessage(data.clientId, "notice", "Comprobante cargado correctamente.");
}

export async function deleteReceiptAction(formData: FormData) {
  await requireAdmin();
  const receiptId = String(formData.get("receiptId") ?? "");
  const clientId = String(formData.get("clientId") ?? "");
  const receipt = await prisma.receipt.findUnique({ where: { id: receiptId } });

  if (!receipt || receipt.clientId !== clientId) {
    redirectWithMessage(clientId, "error", "No encontramos el comprobante solicitado.");
  }

  const storage = createAdminClient();
  const { error } = await storage.storage
    .from(RECEIPTS_BUCKET)
    .remove([receipt.storagePath]);

  if (error) {
    redirectWithMessage(clientId, "error", "No pudimos eliminar el archivo almacenado.");
  }

  await prisma.receipt.delete({ where: { id: receipt.id } });
  refreshClient(clientId);
  revalidatePath("/panel/comprobantes");
  redirectWithMessage(clientId, "notice", "Comprobante eliminado.");
}

function readForm(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function emptyToNull(value: string) {
  return value.trim() ? value.trim() : null;
}

function dateAtNoonUtc(value: string) {
  return new Date(`${value}T12:00:00.000Z`);
}

function subtractDays(value: Date, days: number) {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() - days);
  return result;
}

function refreshClient(clientId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/clientes");
  revalidatePath(`/admin/clientes/${clientId}`);
  revalidatePath("/panel");
  revalidatePath("/panel/suscripciones");
  revalidatePath("/panel/recordatorios");
  revalidatePath("/panel/comprobantes");
}

function redirectWithMessage(clientId: string, key: "notice" | "error", message: string): never {
  redirect(`/admin/clientes/${clientId}?${key}=${encodeURIComponent(message)}`);
}

function sanitizeFileName(fileName: string) {
  const normalized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "documento";
}
