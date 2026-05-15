import { ensureAdSenseScript } from './script';
import { logAdEvent } from './monitor';

const FILLED_ATTR = 'data-adsense-filled';
const SLOT_ID_ATTR = 'data-ad-slot-id';

let slotCounter = 0;

function nextSlotInstanceId(): string {
  slotCounter += 1;
  return `s${slotCounter}`;
}

/** Request a single fill for one `<ins class="adsbygoogle">` (idempotent per instance). */
export async function requestAdFill(ins: HTMLElement | null): Promise<void> {
  if (!ins) return;

  if (!ins.getAttribute(SLOT_ID_ATTR)) {
    ins.setAttribute(SLOT_ID_ATTR, nextSlotInstanceId());
  }

  if (ins.getAttribute(FILLED_ATTR) === 'true') return;

  try {
    await ensureAdSenseScript();
    if (ins.getAttribute(FILLED_ATTR) === 'true') return;

    ins.setAttribute(FILLED_ATTR, 'true');
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // TagError when unfilled — expected during policy review or low fill
    }
    logAdEvent('fill_requested', { slot: ins.getAttribute('data-ad-slot') ?? undefined });
  } catch (err) {
    ins.removeAttribute(FILLED_ATTR);
    logAdEvent('fill_error', {
      slot: ins.getAttribute('data-ad-slot') ?? undefined,
      message: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }
}

/** Reset slot so route transitions can request a new fill. */
export function resetAdSlot(ins: HTMLElement | null): void {
  if (!ins) return;
  ins.removeAttribute(FILLED_ATTR);
  ins.innerHTML = '';
}
