import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getProduct, isUnique, SHIPPING_CENTS } from "../data/catalog";
import { bindings } from "./bindings.server";

const cartLine = z.object({
  slug: z.string().min(1).max(160),
  quantity: z.number().int().min(1).max(9),
});

const customer = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().max(40),
  street: z.string().min(3).max(160),
  postalCode: z.string().min(3).max(12),
  city: z.string().min(2).max(120),
  country: z.string().min(2).max(80),
  payment: z.enum(["paypal", "ueberweisung"]),
  note: z.string().max(800),
});

function newId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

export type OrderReceipt = {
  id: string;
  name: string;
  email: string;
  payment: string;
  totalCents: number;
  createdAt: string;
  lines: { name: string; quantity: number; unitCents: number }[];
};

export const createOrder = createServerFn({ method: "POST" })
  .validator(z.object({ customer, items: z.array(cartLine).min(1).max(20) }))
  .handler(async ({ data }) => {
    const db = bindings().DB;
    if (!db) {
      throw new Error("Der Shop ist gerade nicht erreichbar. Bitte versuchen Sie es gleich noch einmal.");
    }

    const lines = data.items.map((item) => {
      const product = getProduct(item.slug);
      if (!product || product.sold) {
        throw new Error("Ein Stück in Ihrem Warenkorb ist leider nicht mehr verfügbar.");
      }
      return {
        name: product.subtitle ? `${product.name}, ${product.subtitle}` : product.name,
        quantity: isUnique(product) ? 1 : item.quantity,
        slug: product.slug,
        unique: isUnique(product),
        unitCents: product.priceCents,
      };
    });

    for (const line of lines) {
      if (!line.unique) {
        continue;
      }
      const taken = await db
        .prepare(
          `SELECT 1 AS n FROM order_items oi JOIN orders o ON o.id = oi.order_id
           WHERE oi.slug = ? AND o.status != 'storniert' LIMIT 1`,
        )
        .bind(line.slug)
        .first<{ n: number }>();
      if (taken) {
        throw new Error(`"${line.name}" wurde gerade von jemand anderem bestellt. Dieses Stück gibt es nur einmal.`);
      }
    }

    const subtotal = lines.reduce((sum, line) => sum + line.unitCents * line.quantity, 0);
    const total = subtotal + SHIPPING_CENTS;
    const id = newId("AF");
    const createdAt = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO orders (id, created_at, customer_name, email, phone, street, postal_code, city, country, payment, note, subtotal_cents, shipping_cents, total_cents, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'neu')`,
      )
      .bind(
        id,
        createdAt,
        data.customer.name,
        data.customer.email,
        data.customer.phone,
        data.customer.street,
        data.customer.postalCode,
        data.customer.city,
        data.customer.country,
        data.customer.payment,
        data.customer.note,
        subtotal,
        SHIPPING_CENTS,
        total,
      )
      .run();

    for (const line of lines) {
      await db
        .prepare(
          `INSERT INTO order_items (order_id, slug, name, unit_cents, quantity) VALUES (?, ?, ?, ?, ?)`,
        )
        .bind(id, line.slug, line.name, line.unitCents, line.quantity)
        .run();
    }

    return { id };
  });

export const getOrder = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(3).max(40) }))
  .handler(async ({ data }): Promise<OrderReceipt | null> => {
    const db = bindings().DB;
    if (!db) {
      return null;
    }
    const order = await db
      .prepare(`SELECT id, customer_name, email, payment, total_cents, created_at FROM orders WHERE id = ?`)
      .bind(data.id)
      .first<{
        id: string;
        customer_name: string;
        email: string;
        payment: string;
        total_cents: number;
        created_at: string;
      }>();
    if (!order) {
      return null;
    }
    const items = await db
      .prepare(`SELECT name, quantity, unit_cents FROM order_items WHERE order_id = ? ORDER BY id ASC`)
      .bind(data.id)
      .all<{ name: string; quantity: number; unit_cents: number }>();

    return {
      id: order.id,
      name: order.customer_name,
      email: order.email,
      payment: order.payment,
      totalCents: order.total_cents,
      createdAt: order.created_at,
      lines: (items.results ?? []).map((row) => ({
        name: row.name,
        quantity: row.quantity,
        unitCents: row.unit_cents,
      })),
    };
  });

export const getSoldSlugs = createServerFn({ method: "GET" }).handler(async (): Promise<string[]> => {
  const db = bindings().DB;
  if (!db) {
    return [];
  }
  try {
    const rows = await db
      .prepare(
        `SELECT DISTINCT oi.slug AS slug FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.status != 'storniert'`,
      )
      .all<{ slug: string }>();
    return (rows.results ?? []).map((row) => row.slug);
  } catch {
    return [];
  }
});

export const createInquiry = createServerFn({ method: "POST" })
  .validator(
    z.object({
      name: z.string().min(2).max(120),
      email: z.string().email().max(160),
      phone: z.string().max(40),
      topic: z.string().min(2).max(80),
      product: z.string().max(200),
      message: z.string().min(5).max(1600),
    }),
  )
  .handler(async ({ data }) => {
    const db = bindings().DB;
    if (!db) {
      throw new Error("Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es gleich noch einmal.");
    }
    const id = newId("AN");
    await db
      .prepare(
        `INSERT INTO inquiries (id, created_at, name, email, phone, topic, product, message, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'neu')`,
      )
      .bind(id, new Date().toISOString(), data.name, data.email, data.phone, data.topic, data.product, data.message)
      .run();
    return { id };
  });

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email().max(160) }))
  .handler(async ({ data }) => {
    const db = bindings().DB;
    if (!db) {
      throw new Error("Die Anmeldung ist gerade nicht erreichbar.");
    }
    await db
      .prepare(`INSERT INTO subscribers (email, created_at) VALUES (?, ?) ON CONFLICT(email) DO NOTHING`)
      .bind(data.email.toLowerCase(), new Date().toISOString())
      .run();
    return { ok: true };
  });
