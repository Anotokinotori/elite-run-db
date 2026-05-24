import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "tonal" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg" | "create";

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "border border-[#111827] bg-[#111827] text-white hover:bg-[#263142]",
  secondary: "border border-[#d8dde6] bg-white text-[#333333] hover:bg-[#f7f8fa]",
  ghost: "border border-transparent bg-transparent text-[#5f6678] hover:bg-[#eef1f5] hover:text-[#111827]",
  tonal: "border border-[#d8dde6] bg-[#f7f8fa] text-[#333333] hover:bg-[#eef1f5]",
  danger: "border border-[#f0ccd3] bg-[#fff4f7] text-[#d24b5a] hover:bg-[#ffeaf0]",
  link: "border border-transparent bg-transparent text-[#4d49fc] hover:text-[#111827]",
};

const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-[12px]",
  md: "min-h-9 px-4 py-2 text-[13px] md:text-[14px]",
  lg: "min-h-11 px-5 py-2.5 text-[15px] md:text-[16px]",
  create: "min-h-[45px] px-5 py-3 text-[15px] md:text-[19px]",
};

export function Button({
  children,
  className,
  size = "md",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111116]/40 disabled:cursor-not-allowed disabled:opacity-55",
        buttonVariantClass[variant],
        buttonSizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
