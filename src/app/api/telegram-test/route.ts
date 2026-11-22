import { timingSafeEqual } from "node:crypto";

import { sendTelegram } from "@/server/mail";

/** Einmaliger Verbindungstest für Telegram, geschützt durch IP_HASH_SECRET. Wird nach dem Test wieder entfernt. */
export async function POST(request: Request) {
  const secret = process.env.IP_HASH_SECRET ?? "";
  const given = request.headers.get("x-test-key") ?? "";
  const ok = secret.length > 0 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return new Response("not found", { status: 404 });
  const status = await sendTelegram("Testnachricht von andreas-fashion-hair", "Wenn du das liest, funktioniert die Telegram-Anbindung. Bestellungen, Anfragen und Widerrufe kommen ab jetzt auch hierher.");
  return Response.json({ status });
}
