export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-cloud p-8">
      <section className="mx-auto max-w-6xl rounded-lg border border-line bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-ocean">Portal cliente</p>
        <h1 className="text-4xl font-black text-ink">Dashboard preparado para clientes</h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Aquí vivirán proyectos, solicitudes, pagos, comprobantes, entregables e historial de soporte cuando se active autenticación y base de datos.
        </p>
      </section>
    </main>
  );
}
