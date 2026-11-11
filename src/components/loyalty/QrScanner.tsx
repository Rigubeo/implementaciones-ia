"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Camera, CameraOff } from "lucide-react";
import { addStamp, findScannedCard } from "@/app/(platform)/panel/fidelidad/actions";
import type { IScannerControls } from "@zxing/browser";

type Card = NonNullable<Awaited<ReturnType<typeof findScannedCard>>>;

export function QrScanner() {
  const video = useRef<HTMLVideoElement>(null);
  const controls = useRef<IScannerControls | null>(null);
  const generation = useRef(0);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [message, setMessage] = useState("");
  const [completed, setCompleted] = useState(false);
  const [pending, startTransition] = useTransition();
  const requestId = useRef("");

  function stop() {
    generation.current += 1;
    controls.current?.stop();
    controls.current = null;
    setScanning(false);
    setLoading(false);
  }

  useEffect(() => () => { generation.current += 1; controls.current?.stop(); }, []);

  async function start() {
    stop();
    setCard(null); setMessage(""); setCompleted(false);
    requestId.current = crypto.randomUUID();
    if (!navigator.mediaDevices?.getUserMedia) {
      setMessage("La cámara no está disponible. En un teléfono necesitas abrir el sitio con HTTPS.");
      return;
    }
    const current = generation.current;
    setScanning(true); setLoading(true);
    try {
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      if (generation.current !== current || !video.current) return;
      const reader = new BrowserQRCodeReader();
      const active = await reader.decodeFromVideoDevice(undefined, video.current, async (result, _error, scanner) => {
        if (!result || generation.current !== current) return;
        const match = /^STPTT:LOYALTY:1:(c[a-z0-9]{8,40})$/.exec(result.getText());
        if (!match) return;
        const lookupGeneration = ++generation.current;
        scanner.stop(); controls.current = null;
        setScanning(false); setLoading(true);
        try {
          const found = await findScannedCard(match[1]);
          if (generation.current !== lookupGeneration) return;
          if (found) setCard(found);
          else setMessage("Esta tarjeta no pertenece a tu negocio o ya no está disponible.");
        } catch { if (generation.current === lookupGeneration) setMessage("No pudimos consultar la tarjeta. Inténtalo de nuevo."); }
        finally { if (generation.current === lookupGeneration) setLoading(false); }
      });
      if (generation.current !== current) active.stop();
      else { controls.current = active; setLoading(false); }
    } catch {
      if (generation.current === current) { setScanning(false); setLoading(false); setMessage("No pudimos abrir la cámara. Revisa el permiso o usa el correo del cliente."); }
    }
  }

  function stamp() {
    if (!card || completed) return;
    const form = new FormData();
    form.set("cardId", card.id); form.set("operation", "stamp"); form.set("requestId", requestId.current);
    startTransition(async () => {
      try {
        const result = await addStamp({ error: false, message: "" }, form);
        setMessage(result.message);
        if (!result.error) { setCompleted(true); setCard((previous) => previous ? { ...previous, stamps: Math.min(previous.stamps + 1, previous.required) } : null); }
      } catch { setMessage("No pudimos confirmar el sello. Inténtalo de nuevo."); }
    });
  }

  return <div className="mt-4"><div className="flex flex-wrap gap-3"><button type="button" onClick={scanning ? stop : start} className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-bold text-white">{scanning ? <><CameraOff size={18} /> Cerrar cámara</> : <><Camera size={18} /> Escanear código QR</>}</button></div>
    <div className={scanning ? "mt-4 overflow-hidden rounded-xl bg-black" : "hidden"}><video ref={video} muted playsInline className="max-h-80 w-full object-cover" /></div>
    {scanning && <p className="mt-2 text-sm text-slate-600">Apunta la cámara al código de la tarjeta del cliente.</p>}
    {loading && <p className="mt-3 text-sm text-slate-600">{scanning ? "Abriendo cámara…" : "Buscando tarjeta…"}</p>}
    {card && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4"><p className="font-black">Tarjeta encontrada</p><p className="mt-1 break-all text-sm text-slate-700">{card.email}</p><p className="mt-2 text-sm text-slate-700">{card.stamps} de {card.required} sellos · Premio: {card.reward}</p><button type="button" onClick={stamp} disabled={pending || completed || card.stamps >= card.required} className="mt-4 rounded-lg bg-ocean px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{completed ? "Sello registrado" : pending ? "Registrando…" : card.stamps >= card.required ? "Tarjeta completa" : "Confirmar un sello"}</button></div>}
    {message && <p role="status" className="mt-3 text-sm font-semibold text-slate-700">{message}</p>}
  </div>;
}
