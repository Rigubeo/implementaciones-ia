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
  output?: string;
  response?: string;
};

function extractNodoReply(rawResponse: string) {
  if (!rawResponse.trim()) return undefined;

  try {
    const data = JSON.parse(rawResponse) as NodoChatWebhookResponse;
    return data.reply ?? data.output ?? data.message ?? data.text ?? data.response;
  } catch {
    return rawResponse;
  }
}

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

  const rawResponse = await response.text();

  return {
    skipped: false,
    reply: extractNodoReply(rawResponse)
  };
}
