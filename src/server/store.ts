import "server-only";

import type { PricedLine } from "@/lib/order";
import type { InquiryTopic } from "@/lib/validation";

/**
 * Persistenz-Schnittstelle. Derzeit gibt es nur den In-Memory-Demo-Store (store-memory.ts).
 * Eine Postgres/Supabase-Umsetzung ist vorbereitet (supabase/migrations/0001_init.sql), aber
 * bewusst nicht verdrahtet. Wer sie anschließt, implementiert genau diese Schnittstelle; der
 * Doppelverkauf-Schutz muss dann in der Datenbank atomar sein (Unique-Constraint auf dem Stück).
 */

export type OrderStatus = "eingegangen" | "bestaetigt" | "versendet" | "storniert";
export type MailStatus = "gesendet" | "fehlgeschlagen" | "nicht_konfiguriert";

export type Customer = {
  name: string;
  email: string;
  phone: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  note: string;
};

export type OrderRecord = {
  id: string;
  tokenHash: string;
  idempotencyKey: string;
  createdAt: string;
  locale: string;
  status: OrderStatus;
  customer: Customer;
  lines: PricedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  mailCustomer: MailStatus;
  mailOwner: MailStatus;
};

export type NewOrder = Omit<OrderRecord, "status" | "mailCustomer" | "mailOwner" | "createdAt">;

export type PlaceOrderResult =
  | { ok: true; order: OrderRecord; duplicate: boolean }
  | { ok: false; reason: "sold"; slugs: string[] };

export type InquiryRecord = {
  id: string;
  createdAt: string;
  topic: InquiryTopic;
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
};

export type WithdrawalRecord = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  orderNumber: string;
  orderDate: string;
  items: string;
};

export interface Store {
  readonly kind: "memory";
  /** Alle reservierten/verkauften Einzelstücke (Slugs). */
  soldSlugs(): Promise<Set<string>>;
  /**
   * Legt eine Bestellung an und reserviert alle Einzelstücke ATOMAR: Ist auch nur eines bereits
   * vergeben, wird nichts gespeichert. Gleicher idempotencyKey → dieselbe Bestellung (duplicate=true).
   */
  placeOrder(order: NewOrder): Promise<PlaceOrderResult>;
  getOrder(id: string): Promise<OrderRecord | null>;
  setOrderMail(id: string, mail: { customer?: MailStatus; owner?: MailStatus }): Promise<void>;
  /** Storniert eine Bestellung und gibt ihre Einzelstücke wieder frei. */
  cancelOrder(id: string): Promise<boolean>;
  saveInquiry(inquiry: InquiryRecord): Promise<void>;
  saveWithdrawal(withdrawal: WithdrawalRecord): Promise<void>;
  saveSubscriber(email: string): Promise<void>;
  /** Fester Fensterzähler. true = erlaubt, false = Limit erreicht. */
  hit(key: string, limit: number, windowMs: number): Promise<boolean>;
}
