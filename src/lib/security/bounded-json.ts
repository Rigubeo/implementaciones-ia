export class RequestBodyTooLargeError extends Error {}

// Read the stream rather than trusting Content-Length, which may be missing or incorrect.
export async function readBoundedJson(request: Request, maxBytes: number): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length && /^\d+$/.test(length) && Number(length) > maxBytes) {
    throw new RequestBodyTooLargeError();
  }
  if (!request.body) return JSON.parse("");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => {});
        throw new RequestBodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const data = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(data));
}
