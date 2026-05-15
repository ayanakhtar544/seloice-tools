'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { canShowAds, useNonPersonalizedAds } from '@/lib/cookieConsent';
import { requestAdFill, resetAdSlot } from './fill-ad';
import { logAdEvent } from './monitor';
import { ensureAdSenseScript } from './script';

interface UseAdSlotOptions {
  lazy?: boolean;
  rootMargin?: string;
  enabled?: boolean;
}

const EMPTY_CHECK_MS = 8000;

export function useAdSlot({
  lazy = true,
  rootMargin = '200px',
  enabled = true,
}: UseAdSlotOptions = {}) {
  const pathname = usePathname();
  const insRef = useRef<HTMLModElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fillStarted = useRef(false);
  const emptyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [adsAllowed, setAdsAllowed] = useState(false);
  const [npa, setNpa] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'filled' | 'error' | 'blocked' | 'empty'>(
    'idle',
  );

  const syncConsent = useCallback(() => {
    setAdsAllowed(canShowAds());
    setNpa(useNonPersonalizedAds());
  }, []);

  useEffect(() => {
    syncConsent();
    window.addEventListener('consent_updated', syncConsent);
    return () => window.removeEventListener('consent_updated', syncConsent);
  }, [syncConsent]);

  const scheduleEmptyCheck = useCallback((ins: HTMLElement) => {
    if (emptyTimerRef.current) clearTimeout(emptyTimerRef.current);
    emptyTimerRef.current = setTimeout(() => {
      const iframe = ins.querySelector('iframe');
      const height = ins.getBoundingClientRect().height;
      if (!iframe && height < 40) {
        setStatus('empty');
        logAdEvent('slot_empty', { slot: ins.getAttribute('data-ad-slot') ?? undefined });
      }
    }, EMPTY_CHECK_MS);
  }, []);

  const tryFill = useCallback(async () => {
    if (!enabled || !adsAllowed || fillStarted.current) return;
    const ins = insRef.current;
    if (!ins) return;

    fillStarted.current = true;
    setStatus('loading');

    try {
      await requestAdFill(ins);
      setStatus('filled');
      scheduleEmptyCheck(ins);
    } catch {
      fillStarted.current = false;
      resetAdSlot(ins);
      setStatus('error');
    }
  }, [adsAllowed, enabled, scheduleEmptyCheck]);

  useEffect(() => {
    fillStarted.current = false;
    if (emptyTimerRef.current) {
      clearTimeout(emptyTimerRef.current);
      emptyTimerRef.current = null;
    }
    resetAdSlot(insRef.current);
    setStatus('idle');
  }, [pathname]);

  useEffect(() => {
    if (!enabled) {
      setStatus('blocked');
      return;
    }
    if (!adsAllowed) {
      setStatus('idle');
      return;
    }

    ensureAdSenseScript()
      .then(() => logAdEvent('script_ready'))
      .catch(() => setStatus('error'));

    const ins = insRef.current;
    if (!ins) return;

    if (!lazy) {
      void tryFill();
      return;
    }

    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          logAdEvent('slot_visible', { slot: ins.getAttribute('data-ad-slot') ?? undefined });
          observerRef.current?.disconnect();
          void tryFill();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observerRef.current.observe(ins);

    return () => {
      observerRef.current?.disconnect();
      if (emptyTimerRef.current) clearTimeout(emptyTimerRef.current);
    };
  }, [adsAllowed, enabled, lazy, rootMargin, tryFill]);

  return { insRef, adsAllowed, npa, status };
}
