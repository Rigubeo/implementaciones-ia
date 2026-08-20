# Recordatorios automáticos

La aplicación expone este endpoint protegido:

```text
POST /api/cron/recordatorios
Authorization: Bearer <CRON_SECRET>
```

## Variables requeridas

```env
CRON_SECRET=
N8N_WEBHOOK_REMINDERS_URL=
N8N_WEBHOOK_SECRET=
```

`CRON_SECRET` debe ser una cadena aleatoria larga. `N8N_WEBHOOK_SECRET` es opcional, pero
recomendado para que n8n pueda verificar el encabezado `x-webhook-secret`.

## Flujo recomendado en n8n

1. Webhook con método `POST`.
2. Validar `x-webhook-secret`.
3. Enviar correo al valor `client.email`.
4. Usar `reminder.title` como asunto y `reminder.message` como contenido principal.
5. Responder con código HTTP `200`.

La aplicación marca un recordatorio como `SENT` únicamente cuando n8n responde correctamente.

## Programación

Ejecutar una vez al día, por ejemplo a las 09:00, mediante el programador disponible en el
hosting o un servicio de cron externo.

Ejemplo:

```bash
curl -X POST "https://solucionestecnologicasparatodos.com/api/cron/recordatorios" \
  -H "Authorization: Bearer TU_CRON_SECRET"
```
