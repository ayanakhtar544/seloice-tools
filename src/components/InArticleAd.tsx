"use client";

import { useEffect, useRef, useState } from "react";
import { hasConsent } from "@/lib/cookieConsent";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AD_CLIENT = "ca-pub-7632798085856544";
const IN_ARTICLE_SLOT = "4049422228";

interface InArticleAdProps {
  className?: string;
}

/**
 * InArticleAd — Consent-gated in-article format for blog posts.
 * ONLY renders and initializes adsbygoogle after the user accepts cookies.
 * Listens to 'consent_updated' events for instant activation without reload.
 */
export default function InArticleAd({ className = "" }: InArticleAdProps) {
  const [consentGranted, setConsentGranted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Read consent state on client only (avoids hydration mismatch)
    setConsentGranted(hasConsent());

    const handleUpdate = () => setConsentGranted(hasConsent());
    window.addEventListener("consent_updated", handleUpdate);
    return () => window.removeEventListener("consent_updated", handleUpdate);
  }, []);

  useEffect(() => {
    if (!consentGranted || initialized.current) return;
    initialized.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // Silently fail in dev/preview
    }
  }, [consentGranted]);

  // Do not render anything if consent has not been granted
  if (!consentGranted) return null;

  return (
    <div
      className={`w-full my-8 overflow-hidden rounded-2xl ${className}`}
      style={{ minHeight: "280px" }}
      aria-label="Advertisement"
    >
      <p className="text-[9px] uppercase tracking-widest text-gray-600 text-center mb-1 font-bold">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", minHeight: "250px" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={AD_CLIENT}
        data-ad-slot={IN_ARTICLE_SLOT}
      />
    </div>
  );
}
