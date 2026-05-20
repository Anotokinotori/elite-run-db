import type { ReactNode, SelectHTMLAttributes } from "react";

import { cn } from "./cn";

export function SelectControl({
  className,
  children,
  variant = "compact",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  variant?: "compact" | "create";
}) {
  return (
    <span className="relative inline-flex min-w-0">
      <select
        className={cn(
          "w-full appearance-none border text-[#111827] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#111116]/20",
          variant === "create"
            ? "rounded-[8px] border-transparent bg-transparent py-1 pr-9 text-[20px] md:text-[24px]"
            : "h-11 min-w-[112px] rounded-full border-[#d8dde6] bg-white py-2 pl-5 pr-10 text-[13px] font-black hover:bg-[#eef1f5] focus:border-[#111116] md:text-[14px]",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7b8493]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}
