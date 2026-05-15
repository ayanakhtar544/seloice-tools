import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./GridMakerClient')}
      label="Loading grid maker…"
    />
  );
}
