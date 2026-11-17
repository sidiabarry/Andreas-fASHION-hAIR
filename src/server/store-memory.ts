import "server-only";

import type { InquiryRecord, NewOrder, OrderRecord, PlaceOrderResult, Store, WithdrawalRecord } from "./store";

/**
 * In-Memory-Store für Entwicklung, Vorschau und Tests. Daten leben nur im laufenden Prozess.
 *
 * Doppelverkauf-Schutz: placeOrder prüft und reserviert alle Einzelstücke in EINEM synchronen
 * Abschnitt ohne await dazwischen. JavaScript führt diesen Abschnitt ohne Unterbrechung aus;
 * zwei gleichzeitige Bestellungen desselben Stücks können sich daher nicht überholen.
 */
export function createMemoryStore(): Store {
  const orders = new Map<string, OrderRecord>();
  const byIdempotency = new Map<string, string>();
  /** Einzelstück → Bestellnummer */
  const reserved = new Map<string, string>();
  const inquiries: InquiryRecord[] = [];
  const withdrawals: WithdrawalRecord[] = [];
  const subscribers = new Set<string>();
  const windows = new Map<string, { start: number; count: number }>();

  return {
    kind: "memory",
    async soldSlugs() {
      return new Set(reserved.keys());
    },
    async placeOrder(input: NewOrder): Promise<PlaceOrderResult> {
      // --- atomarer Abschnitt: kein await bis zum Ende ---
      const existingId = byIdempotency.get(input.idempotencyKey);
      if (existingId) {
        const existing = orders.get(existingId);
        if (existing) return { duplicate: true, ok: true, order: existing };
      }
      const taken = input.lines.filter((line) => line.unique && reserved.has(line.slug)).map((line) => line.slug);
      if (taken.length) return { ok: false, reason: "sold", slugs: taken };
      const order: OrderRecord = {
        ...input,
        createdAt: new Date().toISOString(),
        mailCustomer: "nicht_konfiguriert",
        mailOwner: "nicht_konfiguriert",
        status: "eingegangen",
      };
      for (const line of input.lines) if (line.unique) reserved.set(line.slug, order.id);
      orders.set(order.id, order);
      byIdempotency.set(input.idempotencyKey, order.id);
      return { duplicate: false, ok: true, order };
      // --- Ende atomarer Abschnitt ---
    },
    async getOrder(id) {
      return orders.get(id) ?? null;
    },
    async setOrderMail(id, mail) {
      const order = orders.get(id);
      if (!order) return;
      if (mail.customer) order.mailCustomer = mail.customer;
      if (mail.owner) order.mailOwner = mail.owner;
    },
    async cancelOrder(id) {
      const order = orders.get(id);
      if (!order) return false;
      order.status = "storniert";
      for (const [slug, orderId] of reserved) if (orderId === id) reserved.delete(slug);
      return true;
    },
    async saveInquiry(inquiry) {
      inquiries.push(inquiry);
    },
    async saveWithdrawal(withdrawal) {
      withdrawals.push(withdrawal);
    },
    async saveSubscriber(email) {
      subscribers.add(email);
    },
    async hit(key, limit, windowMs) {
      const now = Date.now();
      const current = windows.get(key);
      if (!current || now - current.start >= windowMs) {
        windows.set(key, { count: 1, start: now });
        if (windows.size > 10_000) {
          for (const [k, w] of windows) if (now - w.start >= windowMs) windows.delete(k);
        }
        return true;
      }
      current.count += 1;
      return current.count <= limit;
    },
  };
}

const globalStore = globalThis as unknown as { __afhStore?: Store };

/** Prozessweiter Demo-Store (überlebt Hot Reload in der Entwicklung). */
export function memoryStore(): Store {
  globalStore.__afhStore ??= createMemoryStore();
  return globalStore.__afhStore;
}
