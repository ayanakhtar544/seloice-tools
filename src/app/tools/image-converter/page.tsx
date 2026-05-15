import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./ImageConverterClient')}
      label="Loading image converter…"
    />
  );
}
