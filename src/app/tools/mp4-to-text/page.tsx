import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./Mp4ToTextClient')}
      label="Loading mp4 to text…"
    />
  );
}
