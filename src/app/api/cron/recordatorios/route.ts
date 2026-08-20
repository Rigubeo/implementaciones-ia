import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_REMINDERS_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      {
        ok: false,
        configurationNeeded: true,
        message: "Falta configurar N8N_WEBHOOK_REMINDERS_URL."
      },
      { status: 503 }
    );
  }

  const reminders = await prisma.reminder.findMany({
    where: {
      status: "SCHEDULED",
      scheduledFor: { lte: new Date() }
    },
    include: {
      client: { include: { user: true } },
      subscription: true
    },
    orderBy: { scheduledFor: "asc" },
    take: 50
  });

  const results = [];

  for (const reminder of reminders) {
    if (!reminder.client.user?.email) {
      results.push({ id: reminder.id, sent: false, reason: "Cliente sin correo." });
      continue;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.N8N_WEBHOOK_SECRET
            ? { "x-webhook-secret": process.env.N8N_WEBHOOK_SECRET }
            : {})
        },
        body: JSON.stringify({
          reminderId: reminder.id,
          client: {
            name: reminder.client.name,
            email: reminder.client.user.email
          },
          reminder: {
            title: reminder.title,
            message: reminder.message,
            scheduledFor: reminder.scheduledFor.toISOString(),
            daysBefore: reminder.daysBefore
          },
          subscription: reminder.subscription
            ? {
                name: reminder.subscription.name,
                amountCents: reminder.subscription.amountCents,
                currency: reminder.subscription.currency,
                nextBillingAt: reminder.subscription.nextBillingAt.toISOString()
              }
            : null
        }),
        signal: AbortSignal.timeout(15_000)
      });

      if (!response.ok) {
        results.push({
          id: reminder.id,
          sent: false,
          reason: `Webhook respondió ${response.status}.`
        });
        continue;
      }

      await prisma.reminder.update({
        where: { id: reminder.id },
        data: {
          status: "SENT",
          sentAt: new Date()
        }
      });

      results.push({ id: reminder.id, sent: true });
    } catch (error) {
      results.push({
        id: reminder.id,
        sent: false,
        reason: error instanceof Error ? error.message : "Error desconocido."
      });
    }
  }

  return NextResponse.json({
    ok: true,
    processed: results.length,
    sent: results.filter((result) => result.sent).length,
    results
  });
}
