import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./WatermarkAdderClient')}
      label="Loading watermark adder…"
    />
  );
}
