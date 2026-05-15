"use client";

import AdUnit from './AdUnit';

interface InArticleAdProps {
  className?: string;
}

/** @deprecated Prefer `<AdUnit slot="inArticle" layout="in-article" />` */
export default function InArticleAd({ className = "" }: InArticleAdProps) {
  return (
    <AdUnit
      slot="inArticle"
      layout="in-article"
      variant="inArticle"
      className={`my-8 ${className}`}
    />
  );
}
