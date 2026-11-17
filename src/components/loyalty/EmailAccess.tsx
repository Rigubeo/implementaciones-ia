"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { accessCardholder } from "@/app/mis-tarjetas/access-actions";
export function EmailAccess({ slug }: { slug?: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  return <form className="mt-6 space-y-3" onSubmit={async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (slug) form.set("slug", slug);
    setPending(true); setMessage("");
    try {
      const result = await accessCardholder(form);
      if (result.error) setMessage(result.error);
      else router.refresh();
    } catch { setMessage("No pudimos abrir tu tarjeta. Inténtalo de nuevo."); }
    finally { setPending(false); }
  }}><label htmlFor="card-email" className="block text-sm font-bold">Tu correo electrónico</label><input id="card-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="nombre@correo.com" className="w-full rounded-lg border border-slate-300 px-4 py-3" /><label htmlFor="card-email-confirm" className="block text-sm font-bold">Confirma tu correo</label><input id="card-email-confirm" name="confirmEmail" type="email" required maxLength={254} autoComplete="off" placeholder="Escribe tu correo otra vez" className="w-full rounded-lg border border-slate-300 px-4 py-3" /><p className="text-sm text-slate-600">Solo lo usamos para identificar tu tarjeta. No te enviaremos correos.</p><button type="submit" disabled={pending} className="w-full rounded-lg bg-ocean px-4 py-3 font-bold text-white disabled:opacity-50">{pending ? "Un momento…" : slug ? "Crear mi tarjeta" : "Ver mis tarjetas"}</button>{message && <p role="alert" className="text-sm text-red-700">{message}</p>}</form>;
}
