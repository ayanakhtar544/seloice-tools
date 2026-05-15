'use client';

import { ADSENSE_CLIENT, AD_SLOTS, type AdSlotKey } from '@/lib/adsense/constants';
import { useAdSlot } from '@/lib/adsense/use-ad-slot';

export type AdFormat = 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
export type AdLayout = 'in-article' | undefined;

const VARIANT_HEIGHT: Record<string, number> = {
  leaderboard: 90,
  rectangle: 280,
  banner: 50,
  inArticle: 250,
};

export interface AdUnitProps {
  slot?: AdSlotKey | string;
  format?: AdFormat;
  layout?: AdLayout;
  variant?: keyof typeof VARIANT_HEIGHT;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
  showLabel?: boolean;
  enabled?: boolean;
}

function resolveSlotId(slot: AdSlotKey | string): string {
  if (slot in AD_SLOTS) return AD_SLOTS[slot as AdSlotKey];
  return slot;
}

/**
 * Consent-gated AdSense unit — CLS-reserved shell, viewport-lazy fill, route-safe.
 */
export default function AdUnit({
  slot = 'responsive',
  format = 'auto',
  layout,
  variant = 'rectangle',
  className = '',
  style,
  lazy = true,
  showLabel = true,
  enabled = true,
}: AdUnitProps) {
  const slotId = resolveSlotId(slot);
  const minH = VARIANT_HEIGHT[variant] ?? VARIANT_HEIGHT.rectangle;
  const { insRef, adsAllowed, npa, status } = useAdSlot({ lazy, enabled });

  if (!enabled) return null;

  const isInArticle = layout === 'in-article';

  return (
    <aside
      className={`ad-slot w-full overflow-hidden rounded-xl ${className}`}
      style={{ minHeight: minH }}
      aria-label="Advertisement"
      data-ad-status={status}
      data-ad-consent={adsAllowed ? 'allowed' : 'pending'}
    >
      {showLabel && (
        <p className="text-[9px] uppercase tracking-widest text-gray-600 text-center mb-1 font-bold pointer-events-none select-none">
          Advertisement
        </p>
      )}
      {adsAllowed ? (
        <ins
          ref={insRef}
          className="adsbygoogle block w-full"
          style={{ display: 'block', minHeight: minH, ...style }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slotId}
          data-ad-format={isInArticle ? 'fluid' : format}
          data-full-width-responsive="true"
          {...(npa ? { 'data-npa': '1' } : {})}
          {...(isInArticle ? { 'data-ad-layout': 'in-article' } : {})}
        />
      ) : (
        <AdPlaceholder minH={minH} />
      )}
    </aside>
  );
}

function AdPlaceholder({ minH }: { minH: number }) {
  return (
    <div
      className="w-full rounded-lg bg-white/[0.02] border border-dashed border-white/5"
      style={{ minHeight: minH }}
      aria-hidden
    />
  );
}
