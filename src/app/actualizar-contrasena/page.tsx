import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function UpdatePasswordPage() {
  return (
    <AuthShell
      eyebrow="Seguridad"
      title="Define una contraseña nueva"
      description="Usa una contraseña única de al menos ocho caracteres para proteger tu panel."
    >
      <AuthForm mode="update" />
    </AuthShell>
  );
}
