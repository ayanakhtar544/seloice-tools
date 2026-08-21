'use client';

import React, { useEffect, useState } from 'react';
import { hasConsent } from '@/lib/cookieConsent';
import GoogleAnalytics from './GoogleAnalytics';
import ClarityProvider from './ClarityProvider';
import { Analytics } from '@vercel/analytics/next';

/**
 * Consent-gated analytics.
 */
export default function AnalyticsWrapper() {
  const [analyticsOn, setAnalyticsOn] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAnalyticsOn(hasConsent());
    };
    sync();
    window.addEventListener('consent_updated', sync);
    return () => window.removeEventListener('consent_updated', sync);
  }, []);

  return (
    <>
      {analyticsOn && (
        <>
          <GoogleAnalytics />
          <ClarityProvider />
          <Analytics />
        </>
      )}
    </>
  );
}
