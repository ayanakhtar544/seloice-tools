export type AdMonitorEvent =
  | 'fill_requested'
  | 'fill_error'
  | 'slot_visible'
  | 'slot_empty'
  | 'script_ready'
  | 'consent_denied'
  | 'coep_blocked';

const isDev = process.env.NODE_ENV === 'development';
const MAX_LOG = 100;

export interface AdMonitorEntry {
  event: AdMonitorEvent;
  ts: number;
  slot?: string;
  message?: string;
}

/** Lightweight ad diagnostics (dev console + window.__adMonitor). */
export function logAdEvent(
  event: AdMonitorEvent,
  detail?: Record<string, string | undefined>,
): void {
  if (typeof window === 'undefined') return;

  const payload: AdMonitorEntry = {
    event,
    ts: Date.now(),
    slot: detail?.slot,
    message: detail?.message,
  };

  const w = window as Window & {
    __adMonitor?: AdMonitorEntry[];
    __adMonitorStats?: Record<string, number>;
  };
  w.__adMonitor = w.__adMonitor || [];
  w.__adMonitor.push(payload);
  if (w.__adMonitor.length > MAX_LOG) w.__adMonitor.shift();

  w.__adMonitorStats = w.__adMonitorStats || {};
  w.__adMonitorStats[event] = (w.__adMonitorStats[event] || 0) + 1;

  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug('[AdSense]', event, detail ?? '');
  }
}

export function getAdMonitorLog(): AdMonitorEntry[] {
  if (typeof window === 'undefined') return [];
  return (window as Window & { __adMonitor?: AdMonitorEntry[] }).__adMonitor ?? [];
}

export function getAdMonitorStats(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  return (window as Window & { __adMonitorStats?: Record<string, number> }).__adMonitorStats ?? {};
}
