'use client';

import React, { useEffect, useState } from 'react';
import { canShowAds, hasConsent } from '@/lib/cookieConsent';
import { ensureAdSenseScript } from '@/lib/adsense/script';
import GoogleAnalytics from './GoogleAnalytics';
import ClarityProvider from './ClarityProvider';
import { Analytics } from '@vercel/analytics/next';

/**
 * Consent-gated analytics. AdSense script prefetched when ads are allowed (incl. NPA).
 */
export default function AnalyticsWrapper() {
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [adsOn, setAdsOn] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAnalyticsOn(hasConsent());
      setAdsOn(canShowAds());
    };
    sync();
    window.addEventListener('consent_updated', sync);
    return () => window.removeEventListener('consent_updated', sync);
  }, []);

  useEffect(() => {
    if (adsOn) void ensureAdSenseScript();
  }, [adsOn]);

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
