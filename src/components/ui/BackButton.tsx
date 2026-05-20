import type { ButtonHTMLAttributes } from "react";

import { cn } from "./cn";

export function BackButton({
  label,
  showLabel = false,
  className,
  icon = "chevron",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  showLabel?: boolean;
  icon?: "chevron" | "arrow";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex min-h-9 items-center gap-2 rounded-full text-[#5f6678] transition-colors hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40",
        showLabel ? "px-2 py-2 text-[14px] font-medium" : "h-9 w-9 justify-center border border-[#d8dde6] bg-[#f7f8fa] hover:bg-[#eef1f5]",
        className,
      )}
      {...props}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {icon === "arrow" ? (
          <>
            <path d="M19 12H5" />
            <path d="M11 6 5 12l6 6" />
          </>
        ) : (
          <path d="M15 5 8 12l7 7" />
        )}
      </svg>
      {showLabel ? <span>{label}</span> : null}
    </button>
  );
}
