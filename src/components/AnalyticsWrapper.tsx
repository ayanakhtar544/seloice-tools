"use client";

import React, { useEffect, useState } from 'react';
import { hasConsent } from '@/lib/cookieConsent';
import GoogleAnalytics from './GoogleAnalytics';
import ClarityProvider from './ClarityProvider';
import { Analytics } from "@vercel/analytics/next";

export default function AnalyticsWrapper() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    // Check initial status on mount (prevents hydration mismatch)
    setConsentGranted(hasConsent());

    // Listen for updates from the CookieBanner
    const handleConsentUpdate = () => {
      setConsentGranted(hasConsent());
    };

    window.addEventListener('consent_updated', handleConsentUpdate);
    return () => window.removeEventListener('consent_updated', handleConsentUpdate);
  }, []);

  if (!consentGranted) {
    return null; // Do not inject any scripts if consent is not granted
  }

  return (
    <>
      <GoogleAnalytics />
      <ClarityProvider />
      <Analytics />
    </>
  );
}
