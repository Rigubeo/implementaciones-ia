"use client";

import Image from "next/image";
import { Check, Eye, Gift, Layers3, Mail, Palette, Store, Tag } from "lucide-react";
import { useState, useTransition } from "react";
import { QRCodeSVG } from "qrcode.react";
import { saveLoyaltySettings } from "@/app/(platform)/panel/fidelidad/actions";

const themes = [
  { id: "profesional", name: "Profesional", colors: ["#031d4f", "#0758ed"] },
  { id: "moderno", name: "Moderno", colors: ["#26374c", "#567da5"] },
  { id: "fresco", name: "Fresco", colors: ["#00684f", "#04b88b"] },
  { id: "calido", name: "Cálido", colors: ["#482083", "#9963ee"] },
  { id: "minimalista", name: "Minimalista", colors: ["#273343", "#8291a5"] }
] as const;

type Settings = { businessName: string; reward: string; promotion: string; stampsRequired: number; theme: string };

export function LoyaltyEditor({ initial, demo = false }: { initial: Settings; demo?: boolean }) {
  const [data, setData] = useState(initial);
  const [state, setState] = useState({ message: "", error: false });
  const [pending, startTransition] = useTransition();
  const theme = themes.find((item) => item.id === data.theme) ?? themes[0];
  const completed = Math.floor(data.stampsRequired / 2);

  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-black tracking-tight text-ink">Editar tarjeta de fidelidad</h1>
      <p className="mt-2 text-slate-600">Personaliza la tarjeta de sellos digital para tu negocio.</p>
      <form onSubmit={(event) => { event.preventDefault(); if (demo) return; const form = new FormData(event.currentTarget); startTransition(async () => setState(await saveLoyaltySettings(state, form))); }} className="mt-6 grid items-start gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="space-y-6 divide-y divide-slate-200">
            <section>
              <h2 className="flex items-center gap-3 text-lg font-black"><Store size={21} /> Información del negocio</h2>
              <label className="mt-4 block text-sm font-bold" htmlFor="businessName">Nombre de tu negocio</label>
              <input id="businessName" name="businessName" required minLength={2} maxLength={80} value={data.businessName} onChange={(event) => setData({ ...data, businessName: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-blue-100" />
            </section>
            <section className="pt-5">
              <h2 className="flex items-center gap-3 text-lg font-black"><Gift size={21} /> Recompensa</h2>
              <label className="mt-4 block text-sm font-bold" htmlFor="reward">Premio al completar la tarjeta</label>
              <input id="reward" name="reward" required minLength={2} maxLength={120} value={data.reward} onChange={(event) => setData({ ...data, reward: event.target.value })} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-blue-100" />
            </section>
            <section className="pt-5">
              <h2 className="flex items-center gap-3 text-lg font-black"><Tag size={21} /> Promoción <span className="text-sm font-normal text-slate-500">(opcional)</span></h2>
              <label className="mt-3 block text-sm text-slate-600" htmlFor="promotion">Un mensaje especial que aparecerá en tu tarjeta.</label>
              <input id="promotion" name="promotion" maxLength={180} value={data.promotion} onChange={(event) => setData({ ...data, promotion: event.target.value })} placeholder="Ej. Promoción especial los martes" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-ocean focus:ring-2 focus:ring-blue-100" />
            </section>
            <section className="pt-5">
              <h2 className="flex items-center gap-3 text-lg font-black"><Layers3 size={21} /> Configuración de sellos</h2>
              <label htmlFor="stampsRequired" className="mt-4 block text-sm font-bold">Sellos necesarios para obtener el premio</label>
              <select id="stampsRequired" name="stampsRequired" value={data.stampsRequired} onChange={(event) => setData({ ...data, stampsRequired: Number(event.target.value) })} className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm">{Array.from({ length: 9 }, (_, i) => i + 4).map((value) => <option key={value} value={value}>{value} sellos</option>)}</select>
            </section>
            <fieldset className="pt-5">
              <legend className="sr-only">Diseño y colores</legend>
              <h2 className="flex items-center gap-3 text-lg font-black"><Palette size={21} /> Diseño y colores</h2>
              <p className="mt-2 text-sm text-slate-600">Elige una paleta para tu tarjeta.</p>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {themes.map((option) => <label key={option.id} className={`cursor-pointer rounded-xl border p-3 text-center text-xs font-bold ${data.theme === option.id ? "border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-600" : "border-slate-200"}`}><input className="sr-only" type="radio" name="theme" value={option.id} checked={data.theme === option.id} onChange={() => setData({ ...data, theme: option.id })} /><span className="mb-2 flex justify-center"><span className="h-5 w-5 rounded-full" style={{ background: option.colors[0] }} /><span className="h-5 w-5 rounded-full" style={{ background: option.colors[1] }} /></span>{option.name}</label>)}
              </div>
            </fieldset>
          </div>
        </div>
        <div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-3 text-xl font-black"><Eye size={23} /> Vista previa</h2>
            <p className="mt-1 pl-9 text-sm text-slate-600">Así se verá la tarjeta para tus clientes.</p>
            <div className="relative mt-6 overflow-hidden rounded-2xl px-6 py-7 text-white shadow-xl sm:px-10" style={{ backgroundColor: theme.colors[0] }}>
              <div className="pointer-events-none absolute -right-20 -top-24 h-52 w-52 rounded-full opacity-90" style={{ backgroundColor: theme.colors[1] }} />
              <div className="relative flex items-center gap-3"><Image src="/brand/logo-implementaciones-ia.png" width={46} height={46} alt="" className="rounded-full" /><span className="border-l border-white/40 pl-3 text-lg font-bold">{data.businessName || "Tu negocio"}</span></div>
              <div className="relative mx-auto mt-8 max-w-md text-center"><h3 className="text-2xl font-black sm:text-3xl">Tu tarjeta de fidelidad</h3><p className="mt-2 text-sm text-white/70">Cada visita te acerca a tu premio.</p>
                <div className="mx-auto mt-7 flex max-w-sm flex-wrap justify-center gap-3" aria-label={`Ejemplo: ${completed} de ${data.stampsRequired} sellos`}>
                  {Array.from({ length: data.stampsRequired }, (_, index) => <span key={index} className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${index < completed ? "border-white bg-white" : "border-white/55"}`}>{index < completed ? <Check size={26} strokeWidth={3} style={{ color: theme.colors[1] }} /> : null}</span>)}
                </div>
                <div className="mt-7 rounded-full px-4 py-3 font-black" style={{ backgroundColor: theme.colors[1] }}><Gift className="mr-2 inline" size={20} />{data.reward || "Tu recompensa especial"}</div>
                <p className="mt-3 text-sm text-white/80">Completa {data.stampsRequired} sellos y obtén tu recompensa.</p>
                {data.promotion ? <p className="mt-5 border-t border-white/20 pt-4 text-sm font-bold"><Tag className="mr-2 inline" size={17} />{data.promotion}</p> : null}
                <p className="mt-5 border-t border-white/20 pt-4 text-sm text-white/75"><Mail className="mr-2 inline" size={17} />Accede con tu correo para consultar tus sellos.</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-4 rounded-xl border border-slate-200 p-4"><QRCodeSVG value="STPTT:LOYALTY:DEMO" size={76} marginSize={2} title="Ejemplo de código QR" /><p className="text-sm text-slate-600"><strong className="text-ink">Código QR de ejemplo</strong><br />El cliente mostrará su propio código para que el negocio registre su visita.</p></div>
            <p className="mt-3 text-xs text-slate-500">Los sellos y el código QR son ejemplos de la vista previa.</p>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-4">
            {state.message ? <p role="status" className={`text-sm font-semibold ${state.error ? "text-red-700" : "text-emerald-700"}`}>{state.message}</p> : null}
            {demo ? <a href="/registro?redirectTo=%2Fpanel%2Ffidelidad" className="rounded-lg bg-[#0758ed] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700">Crear una cuenta de negocio</a> : <button disabled={pending} type="submit" className="rounded-lg bg-[#0758ed] px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">{pending ? "Guardando…" : "Guardar cambios"}</button>}
          </div>
        </div>
      </form>
    </div>
  );
}
