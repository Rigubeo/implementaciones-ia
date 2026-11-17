"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export function ShareCardLink({ slug }: { slug: string }) {
  const [message, setMessage] = useState("");
  return <div className="mt-4 flex flex-wrap items-center gap-3"><a className="break-all text-sm font-bold text-ocean underline" href={`/tarjeta/${slug}`}>Abrir enlace de registro ↗</a><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold" onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/tarjeta/${slug}`); setMessage("Enlace copiado."); } catch { setMessage("Abre el enlace y copia la dirección del navegador."); } }}><Copy size={16} /> Copiar enlace</button>{message && <span role="status" className="text-sm text-slate-600">{message}</span>}</div>;
}
