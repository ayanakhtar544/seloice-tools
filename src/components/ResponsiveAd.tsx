"use client";

import { useEffect, useRef, useState } from "react";
import { hasConsent } from "@/lib/cookieConsent";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AD_CLIENT = "ca-pub-7632798085856544";
const RESPONSIVE_SLOT = "5965139122";

interface ResponsiveAdProps {
  /**
   * "leaderboard" = 728x90 (desktop top/bottom)
   * "rectangle"   = 336x280 (sidebar/between content)
   * "banner"      = 320x50  (mobile)
   */
  variant?: "leaderboard" | "rectangle" | "banner";
  className?: string;
}

const variantHeight: Record<string, number> = {
  leaderboard: 90,
  rectangle: 280,
  banner: 50,
};

/**
 * ResponsiveAd — Consent-gated display ad.
 * Will NOT render if the user has denied cookies.
 * Listens to consent_updated events for instant activation.
 */
export default function ResponsiveAd({
  variant = "rectangle",
  className = "",
}: ResponsiveAdProps) {
  const [consentGranted, setConsentGranted] = useState(false);
  const initialized = useRef(false);
  const minH = variantHeight[variant];

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
    } catch (e) {}
  }, [consentGranted]);

  // Do not render if consent is denied or not yet granted
  if (!consentGranted) return null;

  return (
    <div
      className={`w-full overflow-hidden ${className}`}
      style={{ minHeight: `${minH}px` }}
      aria-label="Advertisement"
    >
      <p className="text-[9px] uppercase tracking-widest text-gray-600 text-center mb-1 font-bold">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: `${minH}px` }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={RESPONSIVE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
