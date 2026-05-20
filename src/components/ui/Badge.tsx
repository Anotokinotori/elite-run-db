import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

type BadgeVariant = "neutral" | "dark" | "count" | "warning" | "success";

const badgeVariantClass: Record<BadgeVariant, string> = {
  neutral: "border-[#d8dde6] bg-white text-[#5f6678]",
  dark: "border-white/40 bg-transparent text-[#d9d9d9]",
  count: "border-[#d8dde6] bg-white text-[#5f6678]",
  warning: "border-[#efc9b0] bg-[#fff7f2] text-[#b6611e]",
  success: "border-[#8fc7d8] bg-[#eef9fc] text-[#357f91]",
};

export function Badge({
  children,
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-8 max-w-full items-center rounded-full border px-3 text-[12px] font-black leading-none",
        badgeVariantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
