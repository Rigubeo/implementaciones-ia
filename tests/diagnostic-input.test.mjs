import test from "node:test";
import assert from "node:assert/strict";
import { readBoundedJson, RequestBodyTooLargeError } from "../src/lib/security/bounded-json.ts";
import { diagnosticSchema } from "../src/lib/validation/diagnostic.ts";

const valid = { name: "Ana López", email: "ana@example.com", phone: "6141234567", businessType: "Cafetería", message: "Necesito información sobre tarjetas." };

function streamedRequest(parts, headers = {}) {
  const body = new ReadableStream({ start(controller) { for (const part of parts) controller.enqueue(new TextEncoder().encode(part)); controller.close(); } });
  return new Request("http://localhost/api/diagnostic", { method: "POST", headers, body, duplex: "half" });
}

test("accepts a normal UTF-8 diagnostic and defaults omitted services", async () => {
  const payload = await readBoundedJson(streamedRequest([JSON.stringify(valid)]), 32768);
  assert.deepEqual(diagnosticSchema.parse(payload).services, []);
  assert.equal(diagnosticSchema.parse({ ...valid, services: ["Tarjetas"] }).services[0], "Tarjetas");
});

test("rejects oversized bodies even when length is missing or understated", async () => {
  for (const headers of [{}, { "content-length": "5" }]) {
    const request = streamedRequest(['{"data":"', "a".repeat(33000), '"}'], headers);
    await assert.rejects(readBoundedJson(request, 32768), RequestBodyTooLargeError);
  }
});

test("rejects a declared oversized body and counts actual UTF-8 bytes", async () => {
  await assert.rejects(readBoundedJson(streamedRequest(["{}"], { "content-length": "32769" }), 32768), RequestBodyTooLargeError);
  await assert.rejects(readBoundedJson(streamedRequest(['"', "á".repeat(20), '"']), 40), RequestBodyTooLargeError);
});

test("rejects invalid JSON and excessively large service lists", async () => {
  await assert.rejects(readBoundedJson(streamedRequest(["{"]), 32768), SyntaxError);
  assert.equal(diagnosticSchema.safeParse({ ...valid, services: Array(33).fill("servicio") }).success, false);
  assert.equal(diagnosticSchema.safeParse({ ...valid, services: Array(3000).fill(0) }).success, false);
  assert.equal(diagnosticSchema.safeParse({ ...valid, services: [42] }).success, false);
});
