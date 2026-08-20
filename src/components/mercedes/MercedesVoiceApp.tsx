"use client";

import { FormEvent, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from "react";
import {
  ACCESS_PIN,
  MERCEDES_AUTH_KEY,
  MERCEDES_SESSION_KEY
} from "@/config/mercedes-public";

type AppPhase = "idle" | "requesting" | "recording" | "processing" | "waiting" | "error";

type MercedesResponse = {
  status: "ok" | "error";
  message: string;
  session_id?: string;
};

const CONNECTION_ERROR_MESSAGE =
  "No pude conectarme con Mercedes. Revise internet o intente de nuevo.";

const phaseLabel: Record<AppPhase, string> = {
  idle: "Listo",
  requesting: "Listo",
  recording: "Grabando",
  processing: "Ejecutando",
  waiting: "Recibiendo",
  error: "Error"
};

function getOrCreateSessionId() {
  const existingSession = localStorage.getItem(MERCEDES_SESSION_KEY);

  if (existingSession) {
    return existingSession;
  }

  const sessionId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `mercedes-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  localStorage.setItem(MERCEDES_SESSION_KEY, sessionId);
  return sessionId;
}

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return "";
  }

  return (
    [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/ogg;codecs=opus"
    ].find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
}

function speak(message: string) {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "es-MX";
  utterance.rate = 0.94;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
}

export function MercedesVoiceApp() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [phase, setPhase] = useState<AppPhase>("idle");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const shouldSendRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const isPressingRef = useRef(false);
  const isRecordingRef = useRef(false);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    setIsAuthorized(localStorage.getItem(MERCEDES_AUTH_KEY) === "true");
  }, []);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function showError(errorMessage: string) {
    setPhase("error");
    speak(errorMessage);
  }

  async function sendAudio(audioBlob: Blob) {
    try {
      isProcessingRef.current = true;
      setPhase("waiting");

      const sessionId = getOrCreateSessionId();
      const audioFile = new File([audioBlob], `mercedes-${Date.now()}.webm`, {
        type: audioBlob.type || "audio/webm"
      });

      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("session_id", sessionId);
      formData.append("source", "mercedes_web");
      formData.append("timestamp", new Date().toISOString());
      formData.append("device_label", "consultorio");

      const response = await fetch("/api/mercedes", {
        method: "POST",
        body: formData
      });

      const data = (await response.json()) as MercedesResponse;
      const responseMessage =
        typeof data.message === "string" && data.message.trim().length > 0
          ? data.message
          : CONNECTION_ERROR_MESSAGE;

      if (!response.ok || data.status === "error") {
        showError(responseMessage);
        return;
      }

      if (data.session_id) {
        localStorage.setItem(MERCEDES_SESSION_KEY, data.session_id);
      }

      setPhase("idle");
      speak(responseMessage);
    } catch {
      showError(CONNECTION_ERROR_MESSAGE);
    } finally {
      isProcessingRef.current = false;
    }
  }

  async function startRecording() {
    if (isRecordingRef.current || isProcessingRef.current) {
      return;
    }

    if (!window.isSecureContext) {
      showError("Mercedes necesita HTTPS o localhost para usar el micrófono.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      showError("Este navegador no permite grabar audio. Use Chrome actualizado en Android.");
      return;
    }

    try {
      setPhase("requesting");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      if (!isPressingRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        setPhase("idle");
        return;
      }

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      streamRef.current = stream;
      chunksRef.current = [];
      shouldSendRef.current = false;
      mediaRecorderRef.current = recorder;
      isRecordingRef.current = true;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        stopTracks();
        isRecordingRef.current = false;
        showError("No pude grabar el audio. Intente de nuevo.");
      };

      recorder.onstop = () => {
        const shouldSend = shouldSendRef.current;
        const recordedChunks = chunksRef.current;

        stopTracks();
        mediaRecorderRef.current = null;
        isRecordingRef.current = false;
        shouldSendRef.current = false;

        if (!shouldSend) {
          setPhase("idle");
          return;
        }

        const audioBlob = new Blob(recordedChunks, {
          type: recorder.mimeType || "audio/webm"
        });

        if (audioBlob.size === 0) {
          showError("No detecté audio. Mantenga presionado el botón e intente de nuevo.");
          return;
        }

        void sendAudio(audioBlob);
      };

      recorder.start();
      setPhase("recording");
    } catch {
      stopTracks();
      isRecordingRef.current = false;
      showError("No tengo permiso para usar el micrófono. Active el permiso en Chrome e intente de nuevo.");
    }
  }

  function stopRecording(shouldSend: boolean) {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      return;
    }

    shouldSendRef.current = shouldSend;

    if (shouldSend) {
      setPhase("processing");
    }

    recorder.stop();
  }

  function handlePinSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (pin.trim() !== ACCESS_PIN) {
      setPinError("PIN incorrecto. Intente de nuevo.");
      return;
    }

    localStorage.setItem(MERCEDES_AUTH_KEY, "true");
    getOrCreateSessionId();
    setPinError("");
    setIsAuthorized(true);
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary) {
      return;
    }

    event.preventDefault();
    isPressingRef.current = true;
    activePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    void startRecording();
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    event.preventDefault();
    isPressingRef.current = false;
    activePointerIdRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    stopRecording(true);
  }

  function handlePointerCancel() {
    isPressingRef.current = false;
    activePointerIdRef.current = null;
    stopRecording(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      isPressingRef.current = true;
      void startRecording();
    }
  }

  function handleKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      isPressingRef.current = false;
      stopRecording(true);
    }
  }

  const isBusy = phase === "requesting" || phase === "processing" || phase === "waiting";
  const isRecording = phase === "recording";
  const buttonLabel = isRecording
    ? "Suelte para enviar"
    : isBusy
      ? "Espere"
      : "Mantener presionado para hablar";

  if (!isAuthorized) {
    return (
      <main className="min-h-[100dvh] bg-[#061225] px-5 py-8 text-white">
        <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-2xl flex-col justify-center">
          <div className="rounded-[2rem] border border-white/15 bg-white p-7 text-ink shadow-2xl sm:p-10">
            <p className="text-lg font-black uppercase tracking-[0.28em] text-ocean">
              Acceso privado
            </p>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] sm:text-6xl">
              Mercedes
            </h1>
            <p className="mt-4 text-2xl leading-snug text-slate-700">
              Sistema clínico de dictado por voz para consultorio.
            </p>

            <form className="mt-10 space-y-5" onSubmit={handlePinSubmit}>
              <label className="block text-2xl font-black" htmlFor="mercedes-pin">
                PIN de acceso
              </label>
              <input
                autoComplete="one-time-code"
                className="focus-ring w-full rounded-2xl border border-line bg-cloud px-6 py-5 text-4xl font-black tracking-[0.18em] text-ink"
                id="mercedes-pin"
                inputMode="numeric"
                maxLength={12}
                onChange={(event) => setPin(event.target.value)}
                placeholder="1234"
                type="password"
                value={pin}
              />
              {pinError ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-xl font-bold text-red-700">
                  {pinError}
                </p>
              ) : null}
              <button
                className="focus-ring w-full rounded-2xl bg-ocean px-6 py-5 text-2xl font-black text-white shadow-glow transition hover:bg-[#006de0]"
                type="submit"
              >
                Entrar a Mercedes
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-[#f4f8fb] px-4 py-4 text-ink sm:px-6">
      <section className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col">
        <header className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-line bg-white px-5 py-4 shadow-panel">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.26em] text-ocean">
              Mercedes
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
              Dictado clínico
            </h1>
          </div>
          <div
            aria-live="polite"
            className={`rounded-full px-5 py-3 text-lg font-black ${
              phase === "error"
                ? "bg-red-100 text-red-700"
                : phase === "recording"
                  ? "bg-red-600 text-white"
                  : "bg-mint/15 text-[#06734a]"
            }`}
          >
            {phaseLabel[phase]}
          </div>
        </header>

        <div className="grid flex-1 place-items-center py-8">
          <div className="flex w-full flex-col items-center text-center">
            <p
              aria-live="polite"
              className={`mb-8 min-h-[3.5rem] max-w-2xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl ${
                phase === "error" ? "text-red-700" : "text-ink"
              }`}
              id="mercedes-status"
            >
              {phaseLabel[phase]}
            </p>

            <button
              aria-describedby="mercedes-status"
              className={`focus-ring grid h-72 w-72 touch-none select-none place-items-center rounded-full px-8 text-3xl font-black leading-tight text-white shadow-2xl transition duration-200 sm:h-96 sm:w-96 sm:text-4xl ${
                isRecording
                  ? "scale-[0.97] bg-red-700 opacity-75 shadow-[0_20px_70px_rgba(185,28,28,0.35)]"
                  : isBusy
                    ? "cursor-wait bg-slate-500 opacity-80"
                    : "bg-red-600 shadow-[0_30px_90px_rgba(220,38,38,0.35)] active:scale-[0.97] active:opacity-75"
              }`}
              disabled={isBusy}
              onContextMenu={(event) => event.preventDefault()}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              onPointerCancel={handlePointerCancel}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              type="button"
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
