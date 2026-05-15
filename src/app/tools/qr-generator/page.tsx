import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./QrGeneratorClient')}
      label="Loading qr generator…"
    />
  );
}
