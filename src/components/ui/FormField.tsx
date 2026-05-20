import type { LabelHTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

export function FormField({
  children,
  className,
  error,
  helper,
  label,
  labelClassName,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  error?: ReactNode;
  helper?: ReactNode;
  label?: ReactNode;
  labelClassName?: string;
}) {
  return (
    <label className={cn("block", className)} {...props}>
      {label ? <div className={cn("text-[14px] font-bold text-[#5f6678]", labelClassName)}>{label}</div> : null}
      {children}
      {helper && !error ? <p className="mt-2 text-[13px] leading-[1.6] text-[#8d93a3]">{helper}</p> : null}
      {error ? <p className="mt-2 text-[13px] leading-[1.5] text-[#d24b5a]">{error}</p> : null}
    </label>
  );
}
