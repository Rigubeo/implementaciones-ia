"use client";

import { useState, useTransition } from "react";
import { addStamp } from "@/app/(platform)/panel/fidelidad/actions";

export function StampForm() {
  const [result, setResult] = useState({ error: false, message: "" });
  const [pending, startTransition] = useTransition();
  const [request, setRequest] = useState<{ id: string; operation: string } | null>(null);
  return <form className="mt-4 flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; const form = new FormData(event.currentTarget); const operation = submitter?.value ?? "stamp"; form.set("operation", operation); const id = request?.operation === operation ? request.id : crypto.randomUUID(); form.set("requestId", id); setRequest({ id, operation }); startTransition(async () => { const response = await addStamp(result, form); setResult(response); if (!response.error) setRequest(null); }); }}><label className="min-w-[220px] flex-1 text-sm font-bold">Correo de tu cliente<input required type="email" name="email" onChange={() => setRequest(null)} className="mt-2 block w-full rounded-lg border border-slate-300 px-4 py-3 font-normal" placeholder="cliente@correo.com" /></label><button disabled={pending} type="submit" value="stamp" className="rounded-lg bg-ocean px-5 py-3 font-bold text-white disabled:opacity-50">{pending ? "Procesando…" : "Agregar un sello"}</button><button disabled={pending} type="submit" value="redeem" className="rounded-lg border border-ocean px-5 py-3 font-bold text-ocean disabled:opacity-50">Canjear premio</button>{result.message && <p role="status" className={`w-full text-sm ${result.error ? "text-red-700" : "text-emerald-700"}`}>{result.message}</p>}</form>;
}
