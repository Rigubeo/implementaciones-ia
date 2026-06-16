import type { DiagnosticInput } from "@/lib/validation/diagnostic";
import type { NodoChatInput } from "@/lib/validation/nodo-chat";

export async function sendDiagnosticToN8n(payload: DiagnosticInput) {
  const url = process.env.N8N_WEBHOOK_DIAGNOSTIC_URL;

  if (!url) {
    return { skipped: true, reason: "N8N_WEBHOOK_DIAGNOSTIC_URL is not configured" };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "landing",
      receivedAt: new Date().toISOString(),
      payload
    })
  });

  if (!response.ok) {
    throw new Error(`n8n webhook failed with status ${response.status}`);
  }

  return { skipped: false };
}

type NodoChatWebhookResponse = {
  reply?: string;
  message?: string;
  text?: string;
};

export async function sendNodoChatToN8n(payload: NodoChatInput) {
  const url = process.env.N8N_WEBHOOK_NODO_CHAT_URL;

  if (!url) {
    return { skipped: true, reason: "N8N_WEBHOOK_NODO_CHAT_URL is not configured", reply: undefined };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      source: "landing:nodo-chat",
      channel: "web",
      telegramBot: process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL ?? "http://t.me/RigubeoDemoBot",
      receivedAt: new Date().toISOString(),
      payload
    })
  });

  if (!response.ok) {
    throw new Error(`n8n Nodo chat webhook failed with status ${response.status}`);
  }

  const data = (await response.json().catch(() => ({}))) as NodoChatWebhookResponse;

  return {
    skipped: false,
    reply: data.reply ?? data.message ?? data.text
  };
}
