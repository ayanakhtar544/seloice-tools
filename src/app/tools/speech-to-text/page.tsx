import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./SpeechToTextClient')}
      label="Loading speech to text…"
    />
  );
}
