import type { ReactNode } from "react";

import { cn } from "./cn";

export function FieldShell({
  children,
  className,
  variant = "view",
}: {
  children: ReactNode;
  className?: string;
  variant?: "view" | "create";
}) {
  return (
    <div
      className={cn(
        "transition-colors focus-within:ring-2 focus-within:ring-[#111116]/15",
        variant === "create" ? "rounded-[8px] bg-[#f6f6f6] px-4 py-4 md:px-5" : "rounded-[14px] border border-[#d8dde6] bg-[#f7f8fa] px-4 py-3 focus-within:bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
