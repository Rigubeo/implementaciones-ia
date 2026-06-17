"use client";

import Image from "next/image";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

type Message = {
  role: "nodo" | "user";
  text: string;
  source?: "local" | "automation";
};

type NodoChatResponse = {
  ok: boolean;
  data?: {
    reply: string;
    source: "local" | "automation";
    telegramUrl: string;
  };
  error?: string;
};

type NodoChatOpenEvent = CustomEvent<{
  message?: string;
}>;

const starterMessages: Message[] = [
  {
    role: "nodo",
    text: "¡Hola! Soy Nodo. Puedo orientarte sobre agentes IA, automatizaciones, secretarías virtuales y páginas web para tu negocio.",
    source: "local"
  }
];

const quickQuestions = [
  "Agendar cita o seguimiento",
  "Solicitar servicio",
  "¿Qué puede automatizar mi negocio?",
  "Quiero una secretaría virtual",
  "Necesito conectar automatizaciones"
];

function createSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `nodo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function NodoChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [value, setValue] = useState("");
  const [sessionId] = useState(createSessionId);
  const [isSending, setIsSending] = useState(false);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    setValue("");
    setIsSending(true);
    setMessages((current) => [...current, { role: "user", text: trimmed }]);

    try {
      const response = await fetch("/api/chat/nodo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: trimmed, sessionId })
      });
      const result = (await response.json()) as NodoChatResponse;

      setMessages((current) => [
        ...current,
        {
          role: "nodo",
          text: result.data?.reply ?? result.error ?? "Nodo no pudo responder en este momento. Intenta de nuevo.",
          source: result.data?.source ?? "local"
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "nodo",
          text: "No pude conectar con el servicio de chat. Puedes dejar tu solicitud aquí y la retomaremos para seguimiento.",
          source: "local"
        }
      ]);
    } finally {
      setIsSending(false);
    }
  }

  useEffect(() => {
    function handleOpen(event: Event) {
      const customEvent = event as NodoChatOpenEvent;
      setOpen(true);
      if (customEvent.detail?.message) {
        void sendMessage(customEvent.detail.message);
      }
    }

    window.addEventListener("nodo-chat:open", handleOpen);
    return () => window.removeEventListener("nodo-chat:open", handleOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSending]);

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:bottom-5 sm:right-5">
      {open ? (
        <section className="ml-auto max-h-[78dvh] w-full max-w-[420px] overflow-hidden rounded-lg border border-sky-200/25 bg-white shadow-[0_24px_90px_rgba(6,18,37,.28)]">
          <header className="flex items-center justify-between bg-ink px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20 bg-white">
                <Image src="/brand/nodo-saludo-transparente.png" alt="Nodo" fill sizes="44px" className="object-contain p-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black">Nodo</p>
                  <Sparkles size={15} className="text-mint" />
                </div>
                <p className="text-xs font-semibold text-mint">En línea · Diagnóstico web</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-md p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar chat de Nodo"
            >
              <X size={18} />
            </button>
          </header>
          <div className="max-h-[46dvh] space-y-3 overflow-y-auto bg-[#f5f8fb] px-4 py-4 sm:max-h-[430px]">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    message.role === "user"
                      ? "max-w-[82%] rounded-lg bg-ocean px-4 py-3 text-sm font-semibold leading-6 text-white"
                      : "max-w-[86%] rounded-lg border border-line bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm"
                  }
                >
                  {message.text}
                  {message.source === "automation" ? (
                    <span className="mt-2 block text-[11px] font-black uppercase tracking-[0.14em] text-mint">Automatización</span>
                  ) : null}
                </div>
              </div>
            ))}
            <div className="grid gap-2 pt-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-md border border-line bg-white px-3 py-2 text-left text-xs font-bold text-ink transition hover:border-ocean hover:text-ocean"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          <form
            className="flex items-center gap-2 border-t border-line bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage(value);
            }}
          >
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Pregúntale a Nodo..."
              className="min-h-11 flex-1 rounded-md border border-line bg-cloud px-3 text-sm font-semibold text-ink outline-none transition placeholder:text-slate-400 focus:border-ocean"
            />
            <button
              type="submit"
              disabled={isSending}
              className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-ocean text-white transition hover:bg-[#006ce0] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Enviar mensaje a Nodo"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="focus-ring group ml-auto flex items-center gap-3 rounded-full border border-white/20 bg-ink px-3 py-2 text-white shadow-[0_18px_60px_rgba(6,18,37,.35)] transition hover:-translate-y-0.5 hover:bg-[#0a1c35] sm:px-4 sm:py-3"
          aria-label="Abrir chat con Nodo"
        >
          <span className="relative h-11 w-11 overflow-hidden rounded-full bg-white sm:h-12 sm:w-12">
            <Image src="/brand/nodo-saludo-transparente.png" alt="" fill sizes="48px" className="object-contain p-0.5" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-black">Habla con Nodo</span>
            <span className="block text-xs font-semibold text-mint">Diagnóstico web</span>
          </span>
          <MessageCircle size={20} className="text-electric" />
        </button>
      )}
    </div>
  );
}
