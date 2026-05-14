"use client";

import { useEffect, useRef, useState } from "react";
import { hasConsent } from "@/lib/cookieConsent";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AD_CLIENT = "ca-pub-7632798085856544";
const AD_SLOT = "8857456383";

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  className?: string;
}

/**
 * AdBanner — Consent-gated general-purpose ad unit.
 * Uses state-based SSR guard (no render-time typeof window check) to
 * avoid React hooks rule violations and hydration mismatches.
 */
export default function AdBanner({
  slot = AD_SLOT,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const [consentGranted, setConsentGranted] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
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
      // Silently fail
    }
  }, [consentGranted]);

  if (!consentGranted) return null;

  return (
    <div
      className={`w-full overflow-hidden rounded-xl bg-transparent ${className}`}
      style={{ minHeight: "90px" }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: "90px" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}