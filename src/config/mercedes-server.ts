// Configuracion privada del servidor para conectar Mercedes con n8n.
// Preferible en produccion: pegar estos valores en variables de entorno.
// Si necesitas hacerlo rapido en local, puedes reemplazar los textos PEGAR_...
// directamente aqui.
export const N8N_WEBHOOK_URL =
  process.env.MERCEDES_N8N_WEBHOOK_URL ??
  process.env.MERCEDES_TEST ??
  "PEGAR_WEBHOOK_AQUI";

export const WEBHOOK_TOKEN =
  process.env.MERCEDES_WEBHOOK_TOKEN ?? "PEGAR_TOKEN_AQUI";

export const MERCEDES_DEVICE_LABEL = "consultorio";
export const MERCEDES_SOURCE = "mercedes_web";
