"use client";

import { useEffect } from "react";

import { RECENT_KEY, useLocalList } from "@/components/cart/useLocalList";
import { track } from "@/lib/funnel-client";

/** Merkt sich die Produktansicht (zuletzt angesehen, nur auf dem Gerät) und zählt sie anonym. */
export function ViewTracker({ slug }: { slug: string }) {
  const recent = useLocalList(RECENT_KEY, 12);
  const { push } = recent;
  useEffect(() => {
    push(slug);
    track("product_view");
  }, [push, slug]);
  return null;
}
