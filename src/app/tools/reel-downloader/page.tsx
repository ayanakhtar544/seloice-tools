import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./ReelDownloaderClient')}
      label="Loading reel downloader…"
    />
  );
}
