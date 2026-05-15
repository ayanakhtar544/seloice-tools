import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./YtTitleGeneratorClient')}
      label="Loading yt title generator…"
    />
  );
}
