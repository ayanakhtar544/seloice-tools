"use client";

import AdUnit from './AdUnit';

interface ResponsiveAdProps {
  variant?: "leaderboard" | "rectangle" | "banner";
  className?: string;
}

/** @deprecated Prefer `<AdUnit slot="responsive" variant="..." />` */
export default function ResponsiveAd({
  variant = "rectangle",
  className = "",
}: ResponsiveAdProps) {
  return (
    <AdUnit
      slot="responsive"
      variant={variant}
      className={className}
      format="auto"
    />
  );
}
