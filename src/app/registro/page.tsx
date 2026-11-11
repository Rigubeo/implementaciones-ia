import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ redirectTo?: string }> }) {
  const params = await searchParams;
  const redirectTo = params.redirectTo === "/panel/fidelidad" ? params.redirectTo : "/panel";
  return (
    <AuthShell
      eyebrow="Nuevo usuario"
      title="Crea tu espacio privado en minutos"
      description="Tu cuenta será la entrada a proyectos, pagos, comprobantes y comunicación con nuestro equipo."
    >
      <AuthForm mode="register" redirectTo={redirectTo} />
    </AuthShell>
  );
}
