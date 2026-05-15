import type { Metadata } from 'next';
import { buildToolMetadataBySlug } from './metadata';

/** Per-tool layout: metadata only. JSON-LD + body copy live in ToolPageContent (SSR). */
export function createToolLayout(slug: string) {
  const metadata: Metadata = buildToolMetadataBySlug(slug);

  function ToolLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return { metadata, ToolLayout };
}
