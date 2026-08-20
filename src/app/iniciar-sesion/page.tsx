import { AuthForm } from "@/components/auth/AuthForm";
import { AuthShell } from "@/components/auth/AuthShell";

type LoginPageProps = {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <AuthShell
      eyebrow="Mi Panel"
      title="Tu información y servicios, siempre disponibles"
      description="Inicia sesión para consultar pagos únicos, suscripciones, comprobantes y recordatorios."
    >
      <AuthForm
        mode="login"
        redirectTo={params.redirectTo ?? "/panel"}
        initialError={params.error}
      />
    </AuthShell>
  );
}
