import type { ReactNode } from 'react';

/** Consistent tool UI width — use instead of full-page wrappers with duplicate nav. */
export default function ToolInterfaceShell({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-4xl mx-auto relative z-10 ${className}`}>{children}</div>
  );
}
