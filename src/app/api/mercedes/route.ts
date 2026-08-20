import { NextResponse } from "next/server";
import {
  MERCEDES_DEVICE_LABEL,
  MERCEDES_SOURCE,
  N8N_WEBHOOK_URL,
  WEBHOOK_TOKEN
} from "@/config/mercedes-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONNECTION_ERROR_MESSAGE =
  "No pude conectarme con Mercedes. Revise internet o intente de nuevo.";

function isConfigured() {
  return (
    N8N_WEBHOOK_URL !== "PEGAR_WEBHOOK_AQUI" &&
    WEBHOOK_TOKEN !== "PEGAR_TOKEN_AQUI" &&
    N8N_WEBHOOK_URL.startsWith("https://")
  );
}

function normalizeN8nResponse(
  value: unknown,
  fallbackSessionId: string
): { status: "ok" | "error"; message: string; session_id: string } {
  const data = Array.isArray(value) ? value[0] : value;

  if (!data || typeof data !== "object") {
    return {
      status: "error",
      message: "No pude procesar el audio. Intente de nuevo.",
      session_id: fallbackSessionId
    };
  }

  const record = data as Record<string, unknown>;
  const status = record.status === "error" ? "error" : "ok";
  const message =
    typeof record.message === "string" && record.message.trim().length > 0
      ? record.message
      : status === "ok"
        ? "Mercedes recibió el audio, pero no devolvió una respuesta."
        : "No pude procesar el audio. Intente de nuevo.";

  return {
    status,
    message,
    session_id:
      typeof record.session_id === "string" && record.session_id.trim().length > 0
        ? record.session_id
        : fallbackSessionId
  };
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        status: "error",
        message: CONNECTION_ERROR_MESSAGE
      },
      { status: 503 }
    );
  }

  try {
    const incomingForm = await request.formData();
    const audio = incomingForm.get("audio");

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "No recibí audio. Mantenga presionado el botón e intente de nuevo."
        },
        { status: 400 }
      );
    }

    const sessionId =
      typeof incomingForm.get("session_id") === "string"
        ? String(incomingForm.get("session_id"))
        : crypto.randomUUID();

    const outboundForm = new FormData();
    outboundForm.append("audio", audio, audio.name || "mercedes-audio.webm");
    outboundForm.append("session_id", sessionId);
    outboundForm.append("source", MERCEDES_SOURCE);
    outboundForm.append("timestamp", new Date().toISOString());
    outboundForm.append("device_label", MERCEDES_DEVICE_LABEL);

    const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "X-Mercedes-Token": WEBHOOK_TOKEN
      },
      body: outboundForm
    });

    const rawBody = await webhookResponse.text();
    let parsedBody: unknown = null;

    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      parsedBody = null;
    }

    if (!webhookResponse.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: CONNECTION_ERROR_MESSAGE
        },
        { status: 502 }
      );
    }

    return NextResponse.json(normalizeN8nResponse(parsedBody, sessionId));
  } catch {
    return NextResponse.json(
      {
        status: "error",
        message: CONNECTION_ERROR_MESSAGE
      },
      { status: 500 }
    );
  }
}
