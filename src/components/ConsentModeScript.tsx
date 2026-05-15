import { consentModeDefaultScript } from '@/lib/consent/consent-mode';

/** Must run before any Google tag — sets Consent Mode v2 defaults (denied). */
export default function ConsentModeScript() {
  return (
    <script
      id="consent-mode-default"
      dangerouslySetInnerHTML={{ __html: consentModeDefaultScript() }}
    />
  );
}
