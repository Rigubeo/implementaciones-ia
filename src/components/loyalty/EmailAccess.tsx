"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function EmailAccess({ cardPath }: { cardPath: string }) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  return <form className="mt-6 space-y-3" onSubmit={async (event) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    setPending(true); setMessage("");
    try {
      const callback = `${window.location.origin}/auth/callback?next=${encodeURIComponent(cardPath)}`;
      const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: callback } });
      setMessage(error ? "No pudimos enviar el enlace. Inténtalo más tarde." : "Revisa tu correo y abre el enlace para acceder a tu tarjeta.");
    } catch { setMessage("No pudimos enviar el enlace. Inténtalo más tarde."); }
    finally { setPending(false); }
  }}><label htmlFor="card-email" className="block text-sm font-bold">Tu correo electrónico</label><input id="card-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="nombre@correo.com" className="w-full rounded-lg border border-slate-300 px-4 py-3" /><button type="submit" disabled={pending} className="w-full rounded-lg bg-ocean px-4 py-3 font-bold text-white disabled:opacity-50">{pending ? "Enviando…" : "Continuar con mi correo"}</button>{message && <p role="status" className="text-sm text-slate-600">{message}</p>}</form>;
}
