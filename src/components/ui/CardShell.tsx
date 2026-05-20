import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

export function CardShell({
  children,
  className,
  interactive = false,
  selected = false,
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  interactive?: boolean;
  selected?: boolean;
}) {
  return (
    <article
      className={cn(
        "border bg-white text-left shadow-[0_10px_24px_rgba(21,27,38,0.06)]",
        selected ? "border-[#9aa7ba] bg-[#eef1f5]" : "border-[#dfe3ea]",
        interactive && "cursor-pointer transition hover:-translate-y-0.5 hover:border-[#cfd6e2] hover:shadow-[0_18px_34px_rgba(21,27,38,0.11)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/50",
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}
