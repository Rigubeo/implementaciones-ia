import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Nuevo usuario"
      title="Crea tu espacio privado en minutos"
      description="Tu cuenta será la entrada a proyectos, pagos, comprobantes y comunicación con nuestro equipo."
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
