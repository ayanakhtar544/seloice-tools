// File: src/components/ConsentModeScript.tsx
'use client';

import Script from 'next/script';

export default function ConsentModeScript() {
  return (
    <Script
      id="consent-mode-default"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          
          // Default consent setup (sabkuch deny karke rakho jab tak user allow na kare)
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
          });

          // DataLayer empty push
          dataLayer.push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
        `,
      }}
    />
  );
}