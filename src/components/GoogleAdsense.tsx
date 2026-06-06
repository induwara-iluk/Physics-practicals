'use client';

import Script from 'next/script';

interface GoogleAdsenseProps {
  clientId: string;
}

export default function GoogleAdsense({ clientId }: GoogleAdsenseProps) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
