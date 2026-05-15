import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./Mp4ToMp3Client')}
      label="Loading mp4 to mp3…"
    />
  );
}
