import Script from 'next/script';
import { consentModeDefaultScript } from '@/lib/consent/consent-mode';

/** Must run before any Google tag — sets Consent Mode v2 defaults (denied). */
export default function ConsentModeScript() {
  return (
    <Script id="consent-mode-default" strategy="beforeInteractive">
      {consentModeDefaultScript()}
    </Script>
  );
}
