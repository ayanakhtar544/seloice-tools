import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function VideoCompressorPage() {
  return (
    <ToolDynamicLoader
      loader={() => import('./VideoCompressorClient')}
      label="Loading video compressor…"
    />
  );
}
