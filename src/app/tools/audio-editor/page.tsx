import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function AudioEditorPage() {
  return (
    <ToolDynamicLoader
      loader={() => import('./AudioEditorClient')}
      label="Loading audio editor…"
    />
  );
}
