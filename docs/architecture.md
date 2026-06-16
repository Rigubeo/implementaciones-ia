# Arquitectura de Plataforma

## Objetivo

La landing es la primera capa comercial, pero el proyecto está preparado para evolucionar a portal de servicios de IA con clientes, proyectos, solicitudes, pagos y automatizaciones.

## Capas

- Frontend público: `src/app/page.tsx` y componentes en `src/components/landing`.
- Plataforma: rutas futuras en `src/app/(platform)` para `dashboard` y `admin`.
- API: `src/app/api` para diagnóstico, checkout y webhooks.
- Lógica de negocio: `src/lib` separa validación, integraciones, pagos, seguridad y respuestas.
- Base de datos: `prisma/schema.prisma` preparado para PostgreSQL o Supabase.

## Flujo de prospecto

1. Visitante llega a la landing.
2. CTA envia a WhatsApp o a un formulario futuro conectado a `POST /api/diagnostic`.
3. `POST /api/diagnostic` valida datos con Zod y envia evento a n8n.
4. n8n puede crear tareas, notificar por correo, registrar CRM o disparar seguimiento.
5. El equipo convierte el diagnóstico en cliente/proyecto dentro del admin.

## Pagos

La estructura contempla Stripe y Mercado Pago:

- `POST /api/payments/checkout` recibe proveedor, cliente, proyecto, monto, moneda y modo.
- `src/lib/payments/providers.ts` contiene el punto de extension para crear sesiones o preferencias.
- `POST /api/webhooks/stripe` y `POST /api/webhooks/mercado-pago` quedan listos para verificar firmas y persistir eventos.
- `Payment`, `WebhookEvent`, `Client` y `Project` ya existen en Prisma.

## Roles

- `ADMIN`: administra clientes, proyectos, pagos, equipo y configuración.
- `CLIENT`: consulta dashboard, solicitudes, pagos, comprobantes y entregables.
- `TEAM`: opera proyectos, soporte, automatizaciones y seguimiento.

## Seguridad Inicial

- Validación de entrada con Zod.
- Rate limit básico en memoria para formularios.
- Variables sensibles por `.env`.
- Webhooks separados por proveedor.
- Roles modelados desde el inicio.

## Siguientes implementaciones recomendadas

1. Activar Supabase/PostgreSQL y ejecutar Prisma migrations.
2. Agregar NextAuth o Supabase Auth.
3. Crear formulario visual de diagnóstico conectado a `POST /api/diagnostic`.
4. Persistir solicitudes en `DiagnosticRequest`.
5. Conectar Stripe/Mercado Pago con firma de webhooks.
6. Construir vistas de admin y dashboard con datos reales.
