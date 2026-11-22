import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { PricedLine } from "@/lib/order";

import type { MailStatus, NewOrder, OrderRecord, PlaceOrderResult, Store } from "./store";

/**
 * Supabase/Postgres-Store für den Livebetrieb (Schema: supabase/migrations/0001_init.sql).
 * Zugriff nur serverseitig mit dem Service-Role-Key (RLS ohne Policies sperrt alle anderen).
 * Der Doppelverkauf-Schutz liegt in der Datenbank: Primärschlüssel auf piece_reservations.slug,
 * Bestellung und Reservierung atomar in der Funktion place_order.
 */

type OrderRow = {
  id: string;
  token_hash: string;
  idempotency_key: string;
  created_at: string;
  locale: string;
  status: OrderRecord["status"];
  customer_name: string;
  email: string;
  phone: string;
  street: string;
  postal_code: string;
  city: string;
  country: string;
  note: string;
  subtotal_cents: number;
  shipping_cents: number;
  total_cents: number;
  mail_customer: MailStatus;
  mail_owner: MailStatus;
  order_items: { product_id: number; slug: string; name: string; unit_cents: number; quantity: number; is_unique: boolean }[];
};

export function supabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Zeitlimits: supabase-js wartet sonst unbegrenzt. Antwortet die Datenbank nicht (z. B. pausiertes Projekt), würde
 * jede Seite hängen, die „vergeben“ abfragt. Lesen für den Seitenaufbau bleibt kurz, Schreiben (Bestellung) bekommt Luft.
 */
const READ_TIMEOUT_MS = 3_000;
const WRITE_TIMEOUT_MS = 12_000;
const readSignal = () => AbortSignal.timeout(READ_TIMEOUT_MS);

let client: SupabaseClient | null = null;
function db(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_SERVICE_ROLE_KEY as string, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { fetch: (input, init) => fetch(input, { ...init, signal: init?.signal ?? AbortSignal.timeout(WRITE_TIMEOUT_MS) }) },
    });
  }
  return client;
}

function toRecord(row: OrderRow): OrderRecord {
  const lines: PricedLine[] = row.order_items.map((item) => ({
    name: item.name,
    productId: item.product_id,
    quantity: item.quantity,
    slug: item.slug,
    totalCents: item.unit_cents * item.quantity,
    unique: item.is_unique,
    unitCents: item.unit_cents,
  }));
  return {
    createdAt: row.created_at,
    customer: { city: row.city, country: row.country, email: row.email, name: row.customer_name, note: row.note, phone: row.phone, postalCode: row.postal_code, street: row.street },
    id: row.id,
    idempotencyKey: row.idempotency_key,
    lines,
    locale: row.locale,
    mailCustomer: row.mail_customer,
    mailOwner: row.mail_owner,
    shippingCents: row.shipping_cents,
    status: row.status,
    subtotalCents: row.subtotal_cents,
    tokenHash: row.token_hash,
    totalCents: row.total_cents,
  };
}

const ORDER_SELECT = "*, order_items(product_id, slug, name, unit_cents, quantity, is_unique)";

export function createSupabaseStore(): Store {
  return {
    kind: "supabase",
    async soldSlugs() {
      const { data, error } = await db().from("piece_reservations").select("slug").abortSignal(readSignal());
      if (error) throw new Error("store:soldSlugs");
      return new Set((data ?? []).map((row: { slug: string }) => row.slug));
    },
    async placeOrder(input: NewOrder): Promise<PlaceOrderResult> {
      const { data, error } = await db().rpc("place_order", {
        p_items: input.lines.map((line) => ({ is_unique: line.unique, name: line.name, product_id: line.productId, quantity: line.quantity, slug: line.slug, unit_cents: line.unitCents })),
        p_order: {
          city: input.customer.city,
          country: input.customer.country,
          customer_name: input.customer.name,
          email: input.customer.email,
          id: input.id,
          idempotency_key: input.idempotencyKey,
          locale: input.locale,
          note: input.customer.note,
          phone: input.customer.phone,
          postal_code: input.customer.postalCode,
          shipping_cents: input.shippingCents,
          street: input.customer.street,
          subtotal_cents: input.subtotalCents,
          token_hash: input.tokenHash,
          total_cents: input.totalCents,
        },
      });
      if (error) {
        const match = /sold:([^"]*)/.exec(error.message ?? "");
        if (match) return { ok: false, reason: "sold", slugs: match[1].split(",").filter(Boolean) };
        throw new Error("store:placeOrder");
      }
      const result = data as { duplicate: boolean; id: string };
      const order = await this.getOrder(result.id);
      if (!order) throw new Error("store:placeOrder:missing");
      return { duplicate: result.duplicate, ok: true, order };
    },
    async getOrder(id) {
      const { data, error } = await db().from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
      if (error) throw new Error("store:getOrder");
      return data ? toRecord(data as OrderRow) : null;
    },
    async setOrderMail(id, mail) {
      const patch: Record<string, MailStatus> = {};
      if (mail.customer) patch.mail_customer = mail.customer;
      if (mail.owner) patch.mail_owner = mail.owner;
      if (Object.keys(patch).length) await db().from("orders").update(patch).eq("id", id);
    },
    async cancelOrder(id) {
      const { data, error } = await db().rpc("cancel_order", { p_id: id });
      if (error) throw new Error("store:cancelOrder");
      return Boolean(data);
    },
    async saveInquiry(inquiry) {
      const { error } = await db().from("inquiries").insert({
        created_at: inquiry.createdAt,
        email: inquiry.email,
        id: inquiry.id,
        message: inquiry.message,
        name: inquiry.name,
        phone: inquiry.phone,
        product: inquiry.product,
        topic: inquiry.topic,
      });
      if (error) throw new Error("store:saveInquiry");
    },
    async saveWithdrawal(withdrawal) {
      const { error } = await db().from("withdrawals").insert({
        email: withdrawal.email,
        id: withdrawal.id,
        items: withdrawal.items,
        name: withdrawal.name,
        order_date: withdrawal.orderDate,
        order_number: withdrawal.orderNumber,
        received_at: withdrawal.receivedAt,
      });
      if (error) throw new Error("store:saveWithdrawal");
    },
    async saveSubscriber() {
      // Newsletter (Double-Opt-in) ist im Livebetrieb nicht aktiv; siehe actions.ts.
    },
    async hit(key, limit, windowMs) {
      const { data, error } = await db()
        .rpc("hit_rate_limit", { p_key: key, p_limit: limit, p_window_seconds: Math.round(windowMs / 1000) })
        .abortSignal(readSignal());
      if (error) return true; // Rate-Limit darf den Kauf nie blockieren, wenn die Datenbank kurz hakt
      return Boolean(data);
    },
  };
}
