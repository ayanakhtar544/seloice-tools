import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./FileConverterClient')}
      label="Loading file converter…"
    />
  );
}
