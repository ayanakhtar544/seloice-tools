import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./ViralHooksClient')}
      label="Loading viral hooks…"
    />
  );
}
