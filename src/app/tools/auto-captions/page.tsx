import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function AutoCaptionsPage() {
  return (
    <ToolDynamicLoader
      loader={() => import('./AutoCaptionsClient')}
      label="Loading auto captions…"
    />
  );
}
