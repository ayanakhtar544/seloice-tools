import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./VideoEditorClient')}
      label="Loading video editor…"
    />
  );
}
