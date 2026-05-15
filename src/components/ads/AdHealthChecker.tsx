'use client';

import { useEffect, useState } from 'react';
import { getAdMonitorLog, getAdMonitorStats } from '@/lib/adsense/monitor';
import { isAdSenseScriptReady } from '@/lib/adsense/script';
import { canShowAds, getConsentChoice } from '@/lib/cookieConsent';

/**
 * Dev-only overlay: script readiness, consent, fill events.
 * Console: `copy(JSON.stringify(window.__adMonitor))`
 */
export default function AdHealthChecker() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [events, setEvents] = useState<ReturnType<typeof getAdMonitorLog>>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    const tick = () => {
      setReady(isAdSenseScriptReady());
      setEvents([...getAdMonitorLog()].reverse().slice(0, 10));
      setStats(getAdMonitorStats());
    };
    tick();
    const id = window.setInterval(tick, 2000);
    return () => window.clearInterval(id);
  }, [open]);

  if (process.env.NODE_ENV !== 'development') return null;

  const consent = getConsentChoice() ?? 'pending';
  const ads = canShowAds();

  return (
    <div className="fixed bottom-20 left-2 z-[9980] font-mono text-[10px]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200"
      >
        Ads {ready && ads ? '✓' : '…'}
      </button>
      {open && (
        <pre className="mt-1 max-w-xs max-h-48 overflow-auto p-2 rounded bg-black/90 border border-white/10 text-gray-400">
          {`script: ${ready ? 'ready' : 'pending'}\nconsent: ${consent}\nads: ${ads ? 'on' : 'off'}\n`}
          {Object.entries(stats).map(([k, v]) => (
            <span key={k}>
              {k}: {v}
              {'\n'}
            </span>
          ))}
          {'---\n'}
          {events.map((e, i) => (
            <span key={i}>
              {e.event}
              {e.slot ? ` (${e.slot})` : ''}
              {'\n'}
            </span>
          ))}
        </pre>
      )}
    </div>
  );
}
