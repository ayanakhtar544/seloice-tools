import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./HashtagExtractorClient')}
      label="Loading hashtag extractor…"
    />
  );
}
