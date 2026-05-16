"use client";

import { useEffect, useRef } from "react";
import { useReportWebVitals } from "next/web-vitals";
import {
  trackEvent,
  trackScrollDepth,
  trackSiteError,
  trackWebVital,
} from "@/lib/analytics";
import {
  findSearchInput,
  getAnchorText,
  getElementClasses,
  getElementText,
  getFormIdentifier,
  isAuthIntent,
  isExternalUrl,
  isSearchInput,
} from "@/utils/analytics";

interface AnalyticsObserverProps {
  pathname: string;
}

const BUTTON_EVENT_MAP = [
  { keyword: "generate", event: "generate_click" as const },
  { keyword: "download", event: "download_click" as const },
  { keyword: "copy", event: "copy_click" as const },
  { keyword: "share", event: "share_click" as const },
];

const SCROLL_THRESHOLDS = [25, 50, 75, 100] as const;

const getMatchedButtonEvent = (text: string) => {
  const normalized = text.toLowerCase();
  return BUTTON_EVENT_MAP.find(({ keyword }) => normalized.includes(keyword))
    ?.event;
};

const getElementId = (element: Element): string | undefined =>
  element instanceof HTMLElement && element.id ? element.id : undefined;

const buildSearchKey = (pathname: string, term: string, source: string): string =>
  `${pathname}::${source}::${term.toLowerCase()}`;

const buildOutboundDestination = (element: HTMLAnchorElement): string => {
  try {
    return new URL(element.href, window.location.origin).toString();
  } catch {
    return element.href;
  }
};

const handleWebVitals: Parameters<typeof useReportWebVitals>[0] = (metric) => {
  if (typeof window === "undefined") return;

  switch (metric.name) {
    case "CLS":
    case "FCP":
    case "INP":
    case "LCP":
    case "TTFB":
      trackWebVital({
        id: metric.id,
        name: metric.name,
        navigationType: metric.navigationType,
        pathname: window.location.pathname,
        rating: metric.rating,
        value: metric.value,
      });
      break;
    default:
      break;
  }
};

export default function AnalyticsObserver({
  pathname,
}: AnalyticsObserverProps) {
  const pathnameRef = useRef(pathname);
  const scrollDepthsRef = useRef<Set<number>>(new Set());
  const searchEventsRef = useRef<Set<string>>(new Set());
  const scrollRafRef = useRef<number | null>(null);

  useReportWebVitals(handleWebVitals);

  useEffect(() => {
    pathnameRef.current = pathname;
    scrollDepthsRef.current = new Set();

    const measureImmediately = () => {
      SCROLL_THRESHOLDS.forEach((threshold) => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll <= 0) return;

        const progress = Math.round((window.scrollY / maxScroll) * 100);
        if (
          progress >= threshold &&
          !scrollDepthsRef.current.has(threshold)
        ) {
          scrollDepthsRef.current.add(threshold);
          trackScrollDepth(threshold, pathnameRef.current);
        }
      });
    };

    window.requestAnimationFrame(measureImmediately);
  }, [pathname]);

  useEffect(() => {
    const trackSearchTerm = (
      rawTerm: string,
      source: string,
      form?: HTMLFormElement
    ) => {
      const searchTerm = rawTerm.trim();
      if (!searchTerm) return;

      const dedupeKey = buildSearchKey(
        pathnameRef.current,
        searchTerm,
        source
      );
      if (searchEventsRef.current.has(dedupeKey)) return;
      searchEventsRef.current.add(dedupeKey);

      trackEvent("search_used", {
        search_term: searchTerm,
        pathname: pathnameRef.current,
        form_id: form ? getFormIdentifier(form) : undefined,
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const interactive = event.target.closest(
        "a, button, [role='button'], input[type='button'], input[type='submit']"
      );
      if (!interactive) return;

      if (interactive instanceof HTMLAnchorElement) {
        const href = interactive.getAttribute("href") ?? "";
        if (isExternalUrl(href, window.location.origin)) {
          trackEvent("outbound_click", {
            destination_url: buildOutboundDestination(interactive),
            anchor_text: getAnchorText(interactive),
            pathname: pathnameRef.current,
            classes: getElementClasses(interactive),
          });
          return;
        }
      }

      const buttonText = getElementText(interactive);
      const matchedEvent = getMatchedButtonEvent(buttonText);

      if (matchedEvent) {
        trackEvent(matchedEvent, {
          button_text: buttonText,
          pathname: pathnameRef.current,
          classes: getElementClasses(interactive),
          element_id: getElementId(interactive),
        });
        return;
      }

      if (isAuthIntent(buttonText)) {
        trackEvent("signup_complete", {
          button_text: buttonText,
          pathname: pathnameRef.current,
          classes: getElementClasses(interactive),
          element_id: getElementId(interactive),
        });
      }
    };

    const handleSubmit = (event: Event) => {
      if (!(event.target instanceof HTMLFormElement)) return;

      const form = event.target;
      const submitter =
        event instanceof SubmitEvent &&
        event.submitter instanceof Element
          ? event.submitter
          : null;
      const buttonText = submitter ? getElementText(submitter) : undefined;

      trackEvent("form_submit", {
        form_id: getFormIdentifier(form),
        pathname: pathnameRef.current,
        button_text: buttonText,
        classes: submitter ? getElementClasses(submitter) : undefined,
      });

      const searchInput = findSearchInput(form);
      if (searchInput) {
        trackSearchTerm(searchInput.value, "form_submit", form);
      }

      const authSignals = [
        form.id,
        form.getAttribute("name"),
        form.getAttribute("action"),
        buttonText,
      ]
        .filter(Boolean)
        .join(" ");

      if (isAuthIntent(authSignals)) {
        trackEvent("signup_complete", {
          form_id: getFormIdentifier(form),
          pathname: pathnameRef.current,
          button_text: buttonText,
          classes: submitter ? getElementClasses(submitter) : undefined,
        });
      }
    };

    const handleChange = (event: Event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!isSearchInput(target)) {
        return;
      }

      trackSearchTerm(
        target.value,
        target.name || target.id || "search_input",
        target.form ?? undefined
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      const target = event.target instanceof Element ? event.target : null;
      if (!isSearchInput(target)) {
        return;
      }

      trackSearchTerm(
        target.value,
        `${target.name || target.id || "search_input"}:enter`,
        target.form ?? undefined
      );
    };

    const runScrollTracking = () => {
      if (scrollRafRef.current !== null) return;

      scrollRafRef.current = window.requestAnimationFrame(() => {
        const maxScroll =
          document.documentElement.scrollHeight - window.innerHeight;

        if (maxScroll > 0) {
          const progress = Math.round((window.scrollY / maxScroll) * 100);

          SCROLL_THRESHOLDS.forEach((threshold) => {
            if (
              progress >= threshold &&
              !scrollDepthsRef.current.has(threshold)
            ) {
              scrollDepthsRef.current.add(threshold);
              trackScrollDepth(threshold, pathnameRef.current);
            }
          });
        }

        scrollRafRef.current = null;
      });
    };

    const handleError = (event: ErrorEvent) => {
      trackSiteError({
        message: event.message || "Runtime error",
        pathname: pathnameRef.current,
        source: event.filename || "window.error",
        stack:
          event.error?.stack ||
          `${event.filename}:${event.lineno}:${event.colno}`,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { message?: string; stack?: string } | string;
      trackSiteError({
        message:
          typeof reason === "string"
            ? reason
            : reason?.message ?? "Unhandled promise rejection",
        pathname: pathnameRef.current,
        source: "window.unhandledrejection",
        stack: typeof reason === "string" ? undefined : reason?.stack,
      });
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    document.addEventListener("change", handleChange, true);
    document.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("scroll", runScrollTracking, { passive: true });
    window.addEventListener("resize", runScrollTracking, { passive: true });
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      document.removeEventListener("change", handleChange, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("scroll", runScrollTracking);
      window.removeEventListener("resize", runScrollTracking);
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );

      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  return null;
}
