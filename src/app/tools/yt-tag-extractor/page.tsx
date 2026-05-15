import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./YtTagExtractorClient')}
      label="Loading yt tag extractor…"
    />
  );
}
