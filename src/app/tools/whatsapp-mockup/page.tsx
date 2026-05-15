import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./WhatsappMockupClient')}
      label="Loading whatsapp mockup…"
    />
  );
}
