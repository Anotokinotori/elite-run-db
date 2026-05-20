import type { ReactNode } from "react";

import { cn } from "./cn";

export function EmptyState({
  children,
  className,
  icon,
  title,
}: {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div className={cn("rounded-[16px] border border-dashed border-[#d8dde6] bg-[#f7f8fa] px-4 py-8 text-center text-[13px] text-[#8d93a3]", className)}>
      {icon ? <div className="mb-3 flex justify-center text-[#dcdfe6]">{icon}</div> : null}
      <div className="font-black text-[#606266]">{title}</div>
      {children ? <div className="mt-2 font-bold leading-5 text-[#909399]">{children}</div> : null}
    </div>
  );
}
