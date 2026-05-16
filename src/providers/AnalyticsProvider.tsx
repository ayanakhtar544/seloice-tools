"use client";

import { ReactNode, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { hasConsent } from "@/lib/cookieConsent";
import {
  ensureDataLayer,
  pageView,
  trackBlogRead,
  trackToolOpen,
} from "@/lib/analytics";
import AnalyticsObserver from "@/components/analytics/AnalyticsObserver";
import {
  getBlogSlugFromPathname,
  getToolNameFromPathname,
} from "@/utils/analytics";

interface AnalyticsProviderProps {
  children: ReactNode;
}

export default function AnalyticsProvider({
  children,
}: AnalyticsProviderProps) {
  const pathname = usePathname() || "/";
  const lastTrackedPathname = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    ensureDataLayer();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const trackCurrentPath = () => {
      if (!hasConsent()) return;
      if (lastTrackedPathname.current === pathname) return;

      lastTrackedPathname.current = pathname;

      pageView({
        pathname,
        url: window.location.href,
        referrer: document.referrer,
      });

      if (pathname.includes("/tools/")) {
        const toolName = getToolNameFromPathname(pathname) ?? pathname;
        trackToolOpen(toolName, pathname);
      }

      if (pathname.includes("/blog/") || pathname.includes("/blogs/")) {
        const blogSlug = getBlogSlugFromPathname(pathname) ?? pathname;
        trackBlogRead(blogSlug, pathname);
      }
    };

    trackCurrentPath();

    const onConsentUpdated = () => {
      trackCurrentPath();
    };

    window.addEventListener("consent_updated", onConsentUpdated);
    return () =>
      window.removeEventListener("consent_updated", onConsentUpdated);
  }, [pathname]);

  return (
    <>
      {children}
      <AnalyticsObserver pathname={pathname} />
    </>
  );
}
