"use client";

import { trackEvent } from "@/lib/analytics";

export const useAnalytics = () => {
  const trackToolOpen = (toolName: string, pathname?: string) => {
    trackEvent("tool_open", {
      tool_name: toolName,
      pathname: pathname ?? window.location.pathname,
      category: "tool",
    });
  };

  const trackGenerateClick = (toolName: string, pathname?: string) => {
    trackEvent("generate_click", {
      tool_name: toolName,
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackDownload = (
    toolName: string,
    fileType: string,
    pathname?: string
  ) => {
    trackEvent("download_click", {
      tool_name: toolName,
      file_type: fileType,
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackCopy = (toolName: string, pathname?: string) => {
    trackEvent("copy_click", {
      tool_name: toolName,
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackShare = (label: string, pathname?: string) => {
    trackEvent("share_click", {
      label,
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackSearch = (searchTerm: string, pathname?: string) => {
    trackEvent("search_used", {
      search_term: searchTerm,
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackSignup = (pathname?: string) => {
    trackEvent("signup", {
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackLogin = (pathname?: string) => {
    trackEvent("login", {
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackBlogRead = (blogSlug: string, pathname?: string) => {
    trackEvent("blog_read", {
      blog_slug: blogSlug,
      pathname: pathname ?? window.location.pathname,
      category: "blog",
    });
  };

  const trackCTA = (ctaText: string, pathname?: string) => {
    trackEvent("cta_click", {
      cta_text: ctaText,
      pathname: pathname ?? window.location.pathname,
    });
  };

  const trackFormSubmit = (
    formId: string | undefined,
    formAction: string | undefined,
    pathname?: string
  ) => {
    trackEvent("form_submit", {
      form_id: formId,
      form_action: formAction,
      pathname: pathname ?? window.location.pathname,
    });
  };

  return {
    trackToolOpen,
    trackGenerateClick,
    trackDownload,
    trackCopy,
    trackShare,
    trackSearch,
    trackSignup,
    trackLogin,
    trackBlogRead,
    trackCTA,
    trackFormSubmit,
  };
};