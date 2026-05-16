import { hasConsent } from "@/lib/cookieConsent";

export type KnownAnalyticsEventName =
  | "page_view"
  | "tool_open"
  | "generate_click"
  | "download_click"
  | "copy_click"
  | "share_click"
  | "signup_complete"
  | "blog_read"
  | "search_used"
  | "form_submit"
  | "outbound_click"
  | "scroll_depth"
  | "site_error"
  | "web_vital";

export type AnalyticsEventName = KnownAnalyticsEventName | (string & {});

export type DataLayerValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | Record<string, unknown>;

export interface AnalyticsEventPayload {
  event: AnalyticsEventName;
  [key: string]: DataLayerValue;
}

declare global {
  interface Window {
    dataLayer?: Array<AnalyticsEventPayload | IArguments>;
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

const isBrowser = (): boolean => typeof window !== "undefined";

export const hasAnalyticsConsent = (): boolean =>
  isBrowser() && hasConsent();

export const ensureDataLayer = ():
  | Array<AnalyticsEventPayload | IArguments>
  | null => {
  if (!isBrowser()) return null;
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

export const pushToDataLayer = (
  payload: AnalyticsEventPayload
): boolean => {
  if (!hasAnalyticsConsent()) return false;
  const dataLayer = ensureDataLayer();
  if (!dataLayer) return false;
  dataLayer.push(payload);
  return true;
};

export const trackEvent = (
  event: AnalyticsEventName,
  params: Record<string, DataLayerValue> = {}
): boolean =>
  pushToDataLayer({
    event,
    ...params,
  });

export const pageView = (payload: {
  pathname: string;
  url: string;
  referrer?: string;
}): boolean =>
  trackEvent("page_view", {
    pathname: payload.pathname,
    page_path: payload.pathname,
    page_location: payload.url,
    page_referrer: payload.referrer ?? (isBrowser() ? document.referrer : ""),
  });

export const trackToolOpen = (tool_name: string, pathname: string): boolean =>
  trackEvent("tool_open", {
    tool_name,
    pathname,
  });

export const trackBlogRead = (blog_slug: string, pathname: string): boolean =>
  trackEvent("blog_read", {
    blog_slug,
    pathname,
  });

export const trackScrollDepth = (
  depth: number,
  pathname: string
): boolean =>
  trackEvent("scroll_depth", {
    depth,
    depth_label: `${depth}%`,
    pathname,
  });

export const trackSiteError = (payload: {
  message: string;
  pathname: string;
  source?: string;
  stack?: string;
}): boolean =>
  trackEvent("site_error", {
    message: payload.message,
    pathname: payload.pathname,
    source: payload.source,
    stack: payload.stack,
  });

export const trackWebVital = (payload: {
  name: string;
  value: number;
  id?: string;
  rating?: string;
  pathname: string;
  navigationType?: string;
}): boolean =>
  trackEvent("web_vital", {
    metric_name: payload.name,
    metric_value: Number(payload.value.toFixed(3)),
    metric_id: payload.id,
    metric_rating: payload.rating,
    pathname: payload.pathname,
    navigation_type: payload.navigationType,
  });
