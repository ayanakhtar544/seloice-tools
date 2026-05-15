"use client";

import AdUnit from './AdUnit';

interface AdBannerProps {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  className?: string;
}

/** @deprecated Prefer `<AdUnit slot="banner" />` */
export default function AdBanner({
  slot = "banner",
  format = "auto",
  className = "",
}: AdBannerProps) {
  return (
    <AdUnit
      slot={slot}
      format={format}
      variant="leaderboard"
      className={className}
      showLabel={false}
    />
  );
}
