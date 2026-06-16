# Nodo

Nodo es la mascota y asistente IA de Implementaciones de IA.

## Personalidad

- Amigable, cercano y empático.
- Inteligente, claro y práctico.
- Conector: une personas, procesos, datos y herramientas.
- Confiable: transmite seguridad, orden y disponibilidad.

## Uso en el sitio

- Chat flotante para resolver dudas sobre servicios.
- Avatar en secciones donde se explique automatización.
- Portavoz visual de la marca para WhatsApp, n8n y procesos conectados.

## Assets actuales

- `public/brand/nodo.png`: lámina de identidad de Nodo.
- `public/brand/nodo-saludo-transparente.png`: pose frontal de Nodo saludando, referencia principal para avatar y chat.
- `public/brand/hero-nodo-flow.png`: portada principal con Nodo y flujo n8n.
- `public/brand/nodo-chat-telegram.png`: visual de Nodo para experiencia conversacional y demo con Telegram.
- `public/brand/nodo-automatizaciones-integraciones.png`: visual de Nodo explicando integraciones y automatizaciones.
- `public/brand/nodo-pagos-comprobantes.png`: visual de Nodo para pagos y comprobantes, sin activar pagos reales.
- `public/brand/portal-clientes-dashboard.png`: referencia visual para el futuro portal de clientes.
- `public/brand/industria-dashboard-ia.png`: escena editorial para beneficios y casos de uso.
- `public/brand/nodo-avatar.png`: asset legado conservado como referencia, ya no es el avatar principal.

## Próximo paso técnico

El chat web ya llama a `/api/chat/nodo`. Si `N8N_WEBHOOK_NODO_CHAT_URL` está configurado, esa ruta enviará el mensaje al webhook de n8n; si no, responde localmente para mantener la demo funcional. El bot externo de referencia es `http://t.me/RigubeoDemoBot`.
