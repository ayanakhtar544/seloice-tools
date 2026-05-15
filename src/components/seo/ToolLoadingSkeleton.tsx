export default function ToolLoadingSkeleton({ label = 'Loading tool…' }: { label?: string }) {
  return (
    <div
      className="w-full max-w-4xl mx-auto min-h-[280px] flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-[#111] mb-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mb-4" aria-hidden />
      <p className="text-sm font-medium text-gray-400">{label}</p>
    </div>
  );
}
