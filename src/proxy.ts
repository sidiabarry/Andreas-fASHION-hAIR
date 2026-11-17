import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { detectLocale, isLocale, LOCALE_COOKIE } from "./i18n/locales";

/**
 * Läuft vor jeder Seitenanfrage:
 * 1. Pfade ohne Sprachpräfix → Weiterleitung auf /<sprache>/… (Cookie aus dem Umschalter,
 *    sonst Accept-Language, sonst Land aus x-vercel-ip-country, sonst Englisch). Es wird dabei
 *    kein Cookie gesetzt.
 * 2. Seiten mit Sprachpräfix → strikte Content-Security-Policy mit Nonce je Anfrage.
 *
 * Alte Live-URLs (/products, /product/…) leitet bereits next.config.ts weiter (vor diesem Proxy).
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (!isLocale(first)) {
    const locale = detectLocale({
      acceptLanguage: request.headers.get("accept-language"),
      cookie: request.cookies.get(LOCALE_COOKIE)?.value,
      country: request.headers.get("x-vercel-ip-country"),
    });
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    url.search = search;
    const response = NextResponse.redirect(url, 307);
    response.headers.set("Vary", "Accept-Language, Cookie");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";
  const isHttps = request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Inline-Stilattribute (React style={…}, next/image) brauchen 'unsafe-inline'; Skripte nicht.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "media-src 'self' blob:",
    `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    ...(isHttps ? ["upgrade-insecure-requests"] : []),
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  requestHeaders.set("X-NEXT-INTL-LOCALE", first);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Alles außer Next-Interna, Medien und Dateien mit Endung (robots.txt, sitemap.xml, llms.txt …)
      source: "/((?!_next/|assets/|api/|.*\\.[a-zA-Z0-9]{2,5}$).*)",
    },
  ],
};
