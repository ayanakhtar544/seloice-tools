import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function BgRemoverPage() {
  return (
    <ToolDynamicLoader
      loader={() => import('./BgRemoverClient')}
      label="Loading background remover…"
    />
  );
}
