import { NextResponse } from "next/server";
import { ensureClientProfile } from "@/lib/clients/ensure-profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const requested = requestUrl.searchParams.get("next") ?? "/panel";
  const redirectTo = requested.startsWith("/") && !requested.startsWith("//") && !requested.includes("\\") ? requested : "/panel";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user && !redirectTo.startsWith("/tarjeta/")) {
        await ensureClientProfile(user);
      }

      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/iniciar-sesion?error=No+pudimos+confirmar+tu+sesi%C3%B3n.", requestUrl.origin)
  );
}
