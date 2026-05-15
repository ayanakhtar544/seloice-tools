'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim();

export default function GoogleAnalytics() {
  if (!GA_ID || GA_ID === 'undefined') return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true, send_page_view: true });
          if (window.__pendingConsentUpdate && typeof gtag === 'function') {
            gtag('consent', 'update', window.__pendingConsentUpdate);
            delete window.__pendingConsentUpdate;
          }
        `}
      </Script>
    </>
  );
}
