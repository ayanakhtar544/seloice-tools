"use client";

import dynamic from 'next/dynamic';

const Editor = dynamic(
  () => import('./components/Editor'),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

function EditorSkeleton() {
  return (
    <div className="h-screen w-screen bg-[#060609] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div className="absolute -inset-2 rounded-3xl border-2 border-violet-500/20 border-t-violet-500 animate-spin" />
        </div>

        <div className="text-center mt-2">
          <h2 className="text-sm font-bold text-zinc-300">Loading Seloice Editor</h2>
          <p className="text-[11px] text-zinc-600 mt-1">Initializing editing engine...</p>
        </div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-12 border-b border-white/10" />
        <div className="flex flex-1" style={{ height: 'calc(100vh - 12px - 180px)' }}>
          <div className="w-14 border-r border-white/10" />
          <div className="w-[280px] border-r border-white/10" />
          <div className="flex-1" />
        </div>
        <div className="h-[180px] border-t border-white/10" />
      </div>
    </div>
  );
}

export default function VideoEditorClient() {
  return (
    <div className="w-full -mt-10 mb-20">
      <div className="max-w-[1600px] mx-auto">
        <Editor />
      </div>

    </div>
  );
}
