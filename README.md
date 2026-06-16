# Implementaciones de IA

Base profesional para landing page y futura plataforma de servicios digitales, automatizaciones e implementaciones de IA.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma preparado para PostgreSQL/Supabase
- API routes para diagnóstico, n8n, pagos y webhooks

## Desarrollo

```bash
npm install
npm run dev
```

Copia `.env.example` a `.env` y configura WhatsApp, base de datos, n8n y pagos cuando tengas credenciales reales.

## Estructura

- `src/app`: páginas y API routes.
- `src/components`: secciones reutilizables de UI.
- `src/config/site.ts`: textos, CTA, enlaces y contenido editable.
- `src/lib`: validación, seguridad, servicios y helpers.
- `prisma/schema.prisma`: modelos para usuarios, clientes, proyectos, pagos y solicitudes.

## Flujo recomendado

1. Publicar landing con CTAs a WhatsApp.
2. Activar formulario de diagnóstico hacia `api/diagnostic`.
3. Conectar webhook de n8n.
4. Configurar PostgreSQL/Supabase.
5. Implementar auth y dashboards por rol.
6. Activar Stripe/Mercado Pago y facturación.
