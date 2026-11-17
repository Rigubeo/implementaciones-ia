import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const name = "loyalty_holder";
const lifetime = 90 * 24 * 60 * 60;
function signature(value: string) {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.DATABASE_URL;
  if (!secret) throw new Error("Missing server secret for loyalty session");
  return createHmac("sha256", secret).update(`loyalty-session-v1:${value}`).digest("base64url");
}
export async function getCardholderEmail(): Promise<string | null> {
  const value = (await cookies()).get(name)?.value;
  if (!value || value.length > 1024) return null;
  const [payload, signed, extra] = value.split(".");
  if (!payload || !signed || extra) return null;
  const expected = Buffer.from(signature(payload));
  const actual = Buffer.from(signed);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { email?: unknown; exp?: unknown };
    return typeof data.email === "string" && typeof data.exp === "number" && data.exp > Date.now() ? data.email : null;
  } catch { return null; }
}
export async function setCardholderEmail(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + lifetime * 1000 })).toString("base64url");
  (await cookies()).set(name, `${payload}.${signature(payload)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: lifetime });
}
export async function clearCardholderEmail() { (await cookies()).delete(name); }
