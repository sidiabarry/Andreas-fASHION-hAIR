import { siteMode } from "@/server/mode";

const EVENTS = new Set(["product_view", "add_to_cart", "checkout_start", "order_submit", "inquiry_submit"]);

/**
 * Cookieloses, datensparsames Funnel-Protokoll: schreibt nur „Ereignis X ist passiert“ als eine
 * Zeile ins Server-Log (Vercel Logs, dort aggregierbar). Keine IP, keine Kennung, kein User-Agent,
 * keine Seite, keine Uhrzeit über das Log hinaus. Im Demo-Modus aus.
 */
export async function POST(request: Request) {
  if (siteMode().demo) return new Response(null, { status: 204 });
  const text = (await request.text()).slice(0, 200);
  let event = "";
  try {
    event = String((JSON.parse(text) as { e?: unknown }).e ?? "");
  } catch {
    event = "";
  }
  if (EVENTS.has(event)) console.warn(`[funnel] ${event}`);
  return new Response(null, { status: 204 });
}
