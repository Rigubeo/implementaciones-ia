import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RecoverPasswordPage() {
  return (
    <AuthShell
      eyebrow="Recuperación"
      title="Recupera el acceso de forma segura"
      description="Supabase enviará un enlace temporal al correo registrado en tu cuenta."
    >
      <AuthForm mode="recover" />
    </AuthShell>
  );
}
