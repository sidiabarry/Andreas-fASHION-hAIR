import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import siteCss from "../site.css?url";
import { CartProvider } from "../components/site/cart";
import { SiteFooter, SiteNav, useRise } from "../components/site/chrome";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo and read at BUILD time, no runtime fetch.
import appMetaJson from "../app-meta.json";
import { scrollScrubTheme } from "../scroll-scrub-scenes";

declare const __HF_DESIGN_INSPECTOR__: boolean;

const DEFAULT_TITLE = "Andrea's Fashion Hair";
const DEFAULT_DESCRIPTION =
  "Echthaar-Topper, Perücken und Haarsysteme, Haar für Haar von Hand gefertigt.";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
  marketplace_cover_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

const APP_HOST_ZONES = ["higgsfield.app", "higgsfield-dev.app"];

function toOwnAssetUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return value;
  try {
    const u = new URL(value);
    const isAppHost = APP_HOST_ZONES.some(
      (zone) => u.hostname === zone || u.hostname.endsWith(`.${zone}`),
    );
    if (isAppHost) return u.pathname + u.search;
    return value;
  } catch {
    return value;
  }
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ?? DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toOwnAssetUrl(meta.og_image_url);
  const favicon = toOwnAssetUrl(meta.favicon_url);
  const ogVideo = toOwnAssetUrl(meta.og_video_url);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: "Andrea's Fashion Hair" },
      { name: "theme-color", content: scrollScrubTheme.background },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "de_DE" },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: siteCss },
      ...(favicon ? [{ rel: "icon", href: favicon }] : []),
    ],
  };
}

function NotFoundComponent() {
  return (
    <main className="af-page af-wrap">
      <div className="af-empty">
        <p className="af-mono">Seite nicht gefunden</p>
        <h1 className="af-h2">Hier ist nichts mehr.</h1>
        <p className="af-lead">
          Vielleicht wurde das Stück verkauft. In der Kollektion finden Sie alle, die noch da sind.
        </p>
        <Link className="af-cta-line" search={{ kat: "alle" }} to="/kollektion">
          Zur Kollektion
        </Link>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <main className="af-page af-wrap">
      <div className="af-empty">
        <p className="af-mono">Etwas ist schiefgelaufen</p>
        <h1 className="af-h2">Diese Seite hat nicht geladen.</h1>
        <p className="af-lead">Bitte versuchen Sie es noch einmal.</p>
        <button
          className="af-cta-line"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          type="button"
        >
          Neu laden
        </button>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="de" data-theme="default-dark" style={{ colorScheme: "dark" }}>
      <head>
        <HeadContent />
      </head>
      <body className="af-body">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useRise();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <SiteNav />
        {/* Required: nested routes render here. */}
        <Outlet />
        <SiteFooter />
      </CartProvider>
    </QueryClientProvider>
  );
}
