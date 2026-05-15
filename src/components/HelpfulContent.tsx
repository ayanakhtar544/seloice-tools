"use client";

import React from 'react';
import RelatedTools from './RelatedTools';

interface FAQ {
  question: string;
  answer: string;
}

interface HelpfulContentProps {
  toolName: string;
  toolDescription: string;
  currentSlug: string;
  operatingSystem?: string;
  applicationCategory?: string;
  faqs: FAQ[];
  contentBody: React.ReactNode;
}

export default function HelpfulContent({
  toolName,
  toolDescription,
  currentSlug,
  operatingSystem = "Web Browser",
  applicationCategory = "MultimediaApplication",
  faqs,
  contentBody
}: HelpfulContentProps) {
  
  // Generate SoftwareApplication Schema
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": toolName,
    "description": toolDescription,
    "operatingSystem": operatingSystem,
    "applicationCategory": applicationCategory,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  // Generate FAQPage Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="w-full max-w-4xl mx-auto py-16 px-4">
        {/* SEO Helpful Content Block */}
        <article className="prose prose-invert prose-emerald max-w-none">
          {contentBody}
        </article>

        {/* Dynamic FAQ Section */}
        {faqs.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">{faq.question}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Internal Linking Engine */}
        <RelatedTools currentSlug={currentSlug} />
      </div>
    </>
  );
}
