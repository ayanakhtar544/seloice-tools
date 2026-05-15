import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./TweetGeneratorClient')}
      label="Loading tweet generator…"
    />
  );
}
