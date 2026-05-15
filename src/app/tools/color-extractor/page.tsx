import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./ColorExtractorClient')}
      label="Loading color extractor…"
    />
  );
}
