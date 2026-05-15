import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./ThumbnailExtractorClient')}
      label="Loading thumbnail extractor…"
    />
  );
}
