import ToolDynamicLoader from '@/components/seo/ToolDynamicLoader';

export default function Page() {
  return (
    <ToolDynamicLoader
      loader={() => import('./ReelFitterClient')}
      label="Loading reel fitter…"
    />
  );
}
