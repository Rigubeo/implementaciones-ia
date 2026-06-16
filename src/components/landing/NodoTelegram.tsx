import Image from "next/image";
import { ExternalLink, Workflow } from "lucide-react";
import { TelegramIcon } from "@/components/brand/TelegramIcon";
import { siteConfig } from "@/config/site";

export function NodoTelegram() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div className="relative overflow-hidden rounded-lg border border-line bg-cloud p-4">
          <Image
            src="/brand/nodo-chat-telegram.png"
            alt="Nodo mostrando una experiencia de chat y agenda conectada"
            width={1254}
            height={1254}
            sizes="(max-width: 1024px) 100vw, 44vw"
            className="rounded-md object-contain"
          />
        </div>
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-ocean">Nodo en Telegram</p>
          <h2 className="text-3xl font-black leading-tight text-ink md:text-5xl">
            El demo conversacional se preparará con Telegram y n8n
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            El chat web ya queda conectado a una API interna. Cuando la página esté online, esa API podrá mandar mensajes al
            webhook de n8n y trabajar junto con tu bot de Telegram.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-cloud p-5">
              <Workflow className="mb-4 text-ocean" size={26} />
              <h3 className="font-black text-ink">Webhook listo</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Variable preparada: `N8N_WEBHOOK_NODO_CHAT_URL`.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-cloud p-5">
              <TelegramIcon className="mb-4 h-7 w-7 text-[#229ed9]" />
              <h3 className="font-black text-ink">Bot demo</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Canal alterno para probar a Nodo desde Telegram.
              </p>
            </div>
          </div>
          <a
            href={siteConfig.telegramBotUrl}
            target="_blank"
            rel="noreferrer"
            className="focus-ring mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#229ed9] px-5 py-3 text-sm font-black text-white transition hover:bg-[#168bc2]"
          >
            Abrir RigubeoDemoBot
            <ExternalLink size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}
