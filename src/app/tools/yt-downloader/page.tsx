import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./YtDownloaderClient')}
      label="Loading yt downloader…"
    />
  );
}
