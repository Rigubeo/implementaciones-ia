"use server";

import { redirect } from "next/navigation";
import { clearCardholderEmail } from "@/lib/loyalty-session";

export async function signOutCardholder() {
  await clearCardholderEmail();
  redirect("/mis-tarjetas");
}
