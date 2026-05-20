import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

type ChipVariant = "neutral" | "active" | "include" | "exclude" | "create";

const chipVariantClass: Record<ChipVariant, string> = {
  neutral: "border-[#d8dde6] bg-white text-[#5f6678]",
  active: "border-transparent bg-[#111827] text-white",
  include: "border-[#8fc7d8] bg-[#eef9fc] text-[#357f91]",
  exclude: "border-[#efc9b0] bg-[#fff7f2] text-[#b6611e]",
  create: "border-transparent bg-[#f2f2f2] text-[#9999b1]",
};

export function Chip({
  children,
  className,
  variant = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: ChipVariant;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 max-w-full items-center rounded-full border px-3 py-1.5 text-[12px] font-medium leading-none",
        chipVariantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
