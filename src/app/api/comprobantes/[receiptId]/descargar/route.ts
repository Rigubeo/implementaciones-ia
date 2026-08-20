import { NextResponse } from "next/server";
import { canAccessAdmin, getUserRole } from "@/lib/auth/roles";
import { prisma } from "@/lib/db";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const RECEIPTS_BUCKET = "client-documents";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ receiptId: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/iniciar-sesion", request.url));
  }

  const { receiptId } = await params;
  const receipt = await prisma.receipt.findUnique({
    where: { id: receiptId },
    include: { client: true }
  });

  if (!receipt) {
    return NextResponse.json({ error: "Comprobante no encontrado." }, { status: 404 });
  }

  const role = getUserRole(user.user_metadata, user.app_metadata);
  const canDownload = canAccessAdmin(role) || receipt.client.userId === user.id;

  if (!canDownload) {
    return NextResponse.json({ error: "No tienes acceso a este comprobante." }, { status: 403 });
  }

  const storage = createAdminClient();
  const { data, error } = await storage.storage
    .from(RECEIPTS_BUCKET)
    .createSignedUrl(receipt.storagePath, 60, {
      download: receipt.fileName
    });

  if (error || !data.signedUrl) {
    return NextResponse.json({ error: "No pudimos preparar la descarga." }, { status: 500 });
  }

  return NextResponse.redirect(data.signedUrl);
}
