"use client";

import React, { useEffect, useState } from 'react';
import Script from 'next/script';
import { hasConsent } from '@/lib/cookieConsent';
import GoogleAnalytics from './GoogleAnalytics';
import ClarityProvider from './ClarityProvider';
import { Analytics } from "@vercel/analytics/next";

/**
 * AnalyticsWrapper — Consent-gated analytics loader.
 *
 * Loads GA4, Microsoft Clarity, Vercel Analytics, AND Google AdSense
 * ONLY after the user explicitly accepts cookies.
 * Listens to 'consent_updated' event to react without a page reload.
 */
export default function AnalyticsWrapper() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Prevents hydration mismatch: reads localStorage only on client
    setConsentGranted(hasConsent());

    const handleConsentUpdate = () => setConsentGranted(hasConsent());
    window.addEventListener('consent_updated', handleConsentUpdate);
    return () => window.removeEventListener('consent_updated', handleConsentUpdate);
  }, []);

  if (!consentGranted) return null;

  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics />

      {/* Microsoft Clarity */}
      <ClarityProvider />

      {/* Vercel Analytics (privacy-friendly, but still consent-gated) */}
      <Analytics />

      {/* Google AdSense — loaded after consent, non-blocking */}
      <Script
        async
        strategy="lazyOnload"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7632798085856544"
        crossOrigin="anonymous"
      />
    </>
  );
}
