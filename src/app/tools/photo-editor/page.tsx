import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function PhotoEditorPage() {
  return (
    <ToolDynamicLoader
      loader={() => import('./PhotoEditorClient')}
      label="Loading photo editor…"
    />
  );
}
