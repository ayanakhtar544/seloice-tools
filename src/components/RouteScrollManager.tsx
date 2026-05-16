"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const { history } = window;
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
