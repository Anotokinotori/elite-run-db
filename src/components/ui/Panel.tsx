import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

export function Panel({
  children,
  className,
  variant = "surface",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  variant?: "surface" | "muted" | "create";
}) {
  return (
    <section
      className={cn(
        "border",
        variant === "surface" && "border-[#e5e7eb] bg-white shadow-[0_12px_26px_rgba(21,27,38,0.06)]",
        variant === "muted" && "border-[#e5e7eb] bg-[#f7f8fa]",
        variant === "create" && "border-transparent bg-[#f6f6f6]",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
