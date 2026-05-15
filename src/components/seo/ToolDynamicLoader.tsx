'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import ToolLoadingSkeleton from '@/components/seo/ToolLoadingSkeleton';

interface ToolDynamicLoaderProps {
  loader: () => Promise<{ default: ComponentType }>;
  label: string;
}

/** Client-only dynamic import wrapper for tool pages (ssr: false). */
export default function ToolDynamicLoader({ loader, label }: ToolDynamicLoaderProps) {
  const Client = dynamic(loader, {
    ssr: false,
    loading: () => <ToolLoadingSkeleton label={label} />,
  });

  return <Client />;
}
