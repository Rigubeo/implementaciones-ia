export default function AdminPage() {
  return (
    <main className="min-h-screen bg-ink p-8 text-white">
      <section className="mx-auto max-w-6xl rounded-lg border border-white/12 bg-white/8 p-8">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-electric">Administración</p>
        <h1 className="text-4xl font-black">Panel administrativo preparado</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Base para gestionar clientes, proyectos, diagnósticos, pagos, suscripciones, webhooks y equipo interno.
        </p>
      </section>
    </main>
  );
}
