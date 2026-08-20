import Image from "next/image";
import Link from "next/link";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink px-5 py-10 text-white lg:px-8">
      <div className="absolute left-[-15%] top-[-20%] h-[520px] w-[520px] rounded-full bg-ocean/25 blur-[130px]" />
      <div className="absolute bottom-[-18%] right-[-12%] h-[480px] w-[480px] rounded-full bg-mint/15 blur-[140px]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <section>
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/brand/logo-implementaciones-ia.png"
              alt="Soluciones Tecnológicas para Todos"
              width={52}
              height={52}
              className="rounded-full bg-white"
            />
            <span className="text-sm font-black uppercase tracking-[0.13em]">
              Soluciones <span className="text-electric">Tecnológicas</span>
            </span>
          </Link>
          <p className="mt-14 text-sm font-black uppercase tracking-[0.2em] text-mint">{eyebrow}</p>
          <h1 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-6xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">{description}</p>
          <div className="mt-9 hidden overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] p-3 shadow-glow lg:block">
            <Image
              src="/brand/nodo-chat-telegram.png"
              alt="Nodo, asistente de la plataforma"
              width={1254}
              height={1254}
              className="max-h-[360px] w-full rounded-[1.5rem] object-cover object-center"
            />
          </div>
        </section>
        <section className="rounded-[2rem] border border-white/12 bg-white p-6 text-ink shadow-[0_28px_100px_rgba(0,0,0,.3)] sm:p-9">
          {children}
        </section>
      </div>
    </main>
  );
}
