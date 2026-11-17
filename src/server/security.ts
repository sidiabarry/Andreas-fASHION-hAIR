import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const processSecret = randomBytes(32);

/** IP-Adressen werden nie gespeichert, nur als HMAC (Schlüssel aus IP_HASH_SECRET oder je Prozess zufällig). */
export function hashIp(ip: string): string {
  const key = process.env.IP_HASH_SECRET ? Buffer.from(process.env.IP_HASH_SECRET) : processSecret;
  return createHmac("sha256", key).update(ip).digest("base64url").slice(0, 22);
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Bestellnummer wie AF-7K2M9Q (30 Bit Zufall; nicht als Zugriffsschutz gedacht). */
export function newOrderId(prefix = "AF"): string {
  const bytes = randomBytes(6);
  let out = "";
  for (const byte of bytes) out += ALPHABET[byte % ALPHABET.length];
  return `${prefix}-${out}`;
}

/** Unratbarer Zugriffsschlüssel für die Bestätigungsseite (256 Bit). */
export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("base64url");
}

export function tokenMatches(token: string, hash: string): boolean {
  const a = Buffer.from(hashToken(token));
  const b = Buffer.from(hash);
  return a.length === b.length && timingSafeEqual(a, b);
}
