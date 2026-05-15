import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./SafeZoneClient')}
      label="Loading safe zone…"
    />
  );
}
