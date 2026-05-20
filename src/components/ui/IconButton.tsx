import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

type IconButtonVariant = "surface" | "ghost" | "dark" | "overlay";
type IconButtonSize = "sm" | "md" | "lg";

const iconButtonVariantClass: Record<IconButtonVariant, string> = {
  surface: "border border-[#d8dde6] bg-[#f7f8fa] text-[#333333] hover:bg-[#eef1f5]",
  ghost: "border border-transparent bg-transparent text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#111827]",
  dark: "border border-[#343434] bg-[#272727] text-[#d9d9d9] hover:bg-[#313131]",
  overlay: "border border-white/20 bg-black/70 text-white hover:bg-black",
};

const iconButtonSizeClass: Record<IconButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-10 w-10",
};

export function IconButton({
  children,
  className,
  size = "md",
  variant = "surface",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
}) {
  return (
    <button
      type="button"
      className={cn(
        "grid shrink-0 place-items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40 disabled:cursor-not-allowed disabled:opacity-55",
        iconButtonVariantClass[variant],
        iconButtonSizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
