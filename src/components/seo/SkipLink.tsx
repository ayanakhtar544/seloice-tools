export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-3 focus:bg-emerald-500 focus:text-black focus:font-bold focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
}
