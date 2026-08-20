"use client";

import type { Route } from "next";
import Link from "next/link";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { canAccessAdmin, getUserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register" | "recover" | "update";

type AuthFormProps = {
  mode: AuthMode;
  redirectTo?: string;
  initialError?: string;
};

const content = {
  login: {
    title: "Entrar a Mi Panel",
    description: "Consulta tus servicios, pagos, comprobantes y recordatorios.",
    submit: "Iniciar sesión"
  },
  register: {
    title: "Crear cuenta",
    description: "Abre tu espacio privado para gestionar los servicios contratados.",
    submit: "Crear mi cuenta"
  },
  recover: {
    title: "Recuperar acceso",
    description: "Te enviaremos un enlace seguro para actualizar tu contraseña.",
    submit: "Enviar enlace"
  },
  update: {
    title: "Nueva contraseña",
    description: "Crea una contraseña nueva para recuperar el acceso a tu panel.",
    submit: "Actualizar contraseña"
  }
} satisfies Record<AuthMode, { title: string; description: string; submit: string }>;

export function AuthForm({ mode, redirectTo = "/panel", initialError }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(initialError ?? "");
  const [isError, setIsError] = useState(Boolean(initialError));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsError(false);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const fullName = String(formData.get("fullName") ?? "").trim();

    if ((mode === "register" || mode === "update") && password !== confirmPassword) {
      setIsError(true);
      setMessage("Las contraseñas no coinciden. Revísalas antes de continuar.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const role = getUserRole(data.user.user_metadata, data.user.app_metadata);
        const destination =
          redirectTo === "/panel" && canAccessAdmin(role) ? "/admin" : redirectTo;
        router.push(destination as Route);
        router.refresh();
        return;
      }

      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
          }
        });
        if (error) throw error;

        if (data.session) {
          router.push(redirectTo as Route);
          router.refresh();
          return;
        }

        setMessage("Cuenta de cliente creada. Revisa tu correo para confirmarla y abrir Mi Panel.");
        return;
      }

      if (mode === "recover") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/actualizar-contrasena`
        });
        if (error) throw error;
        setMessage("Te enviamos un enlace de recuperación. Revisa tu correo.");
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage("Contraseña actualizada. Ya puedes entrar a tu panel.");
      setTimeout(() => router.push("/panel"), 900);
    } catch (error) {
      const text = error instanceof Error ? error.message : "No pudimos completar la operación.";
      setIsError(true);
      setMessage(translateAuthError(text));
    } finally {
      setLoading(false);
    }
  }

  const showName = mode === "register";
  const showEmail = mode !== "update";
  const showPassword = mode !== "recover";
  const showPasswordConfirmation = mode === "register" || mode === "update";

  return (
    <>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-ocean">Acceso seguro</p>
      <h2 className="mt-3 text-3xl font-black">{content[mode].title}</h2>
      <p className="mt-3 leading-7 text-slate-600">{content[mode].description}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {showName ? (
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Nombre completo</span>
            <span className="flex items-center gap-3 rounded-lg border border-line bg-cloud px-4">
              <UserRound size={18} className="text-ocean" />
              <input
                name="fullName"
                required
                autoComplete="name"
                className="min-h-[52px] w-full bg-transparent py-3 outline-none"
                placeholder="Tu nombre"
              />
            </span>
          </label>
        ) : null}

        {showEmail ? (
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Correo electrónico</span>
            <span className="flex items-center gap-3 rounded-lg border border-line bg-cloud px-4">
              <Mail size={18} className="text-ocean" />
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="min-h-[52px] w-full bg-transparent py-3 outline-none"
                placeholder="nombre@correo.com"
              />
            </span>
          </label>
        ) : null}

        {showPassword ? (
          <PasswordField
            name="password"
            label={mode === "update" ? "Nueva contraseña" : "Contraseña"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        ) : null}

        {showPasswordConfirmation ? (
          <PasswordField
            name="confirmPassword"
            label="Confirmar contraseña"
            autoComplete="new-password"
          />
        ) : null}

        {message ? (
          <p
            aria-live="polite"
            className={`rounded-lg border px-4 py-3 text-sm font-semibold ${
              isError
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="focus-ring flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-ocean px-5 py-3 font-black text-white transition hover:bg-[#006ce0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="animate-spin" size={19} /> : null}
          {content[mode].submit}
          {!loading ? <ArrowRight size={18} /> : null}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
        {mode === "login" ? (
          <>
            <Link href="/recuperar-contrasena" className="text-slate-500 hover:text-ocean">
              Olvidé mi contraseña
            </Link>
            <Link href="/registro" className="text-ocean hover:text-ink">
              Crear cuenta
            </Link>
          </>
        ) : null}
        {mode === "register" || mode === "recover" ? (
          <Link href="/iniciar-sesion" className="text-ocean hover:text-ink">
            Volver a iniciar sesión
          </Link>
        ) : null}
      </div>
    </>
  );
}

function PasswordField({
  name,
  label,
  autoComplete
}: {
  name: string;
  label: string;
  autoComplete: "current-password" | "new-password";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">{label}</span>
      <span className="flex items-center gap-3 rounded-lg border border-line bg-cloud px-4">
        <LockKeyhole size={18} className="text-ocean" />
        <input
          name={name}
          type="password"
          required
          minLength={8}
          autoComplete={autoComplete}
          className="min-h-[52px] w-full bg-transparent py-3 outline-none"
          placeholder="Mínimo 8 caracteres"
        />
      </span>
    </label>
  );
}

function translateAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "El correo o la contraseña no son correctos.";
  }
  if (normalized.includes("email not confirmed")) {
    return "Primero confirma tu cuenta desde el correo que te enviamos.";
  }
  if (normalized.includes("user already registered")) {
    return "Ya existe una cuenta con este correo.";
  }
  if (
    normalized.includes("email rate limit exceeded") ||
    normalized.includes("over_email_send_rate_limit")
  ) {
    return "No se creó la cuenta porque el servicio de correo alcanzó su límite temporal. Intenta nuevamente más tarde.";
  }
  if (normalized.includes("email address not authorized")) {
    return "El servicio de correo de prueba todavía no permite enviar confirmaciones a esta dirección.";
  }
  if (normalized.includes("password")) {
    return "La contraseña no cumple los requisitos de seguridad.";
  }
  return message;
}
