import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

export function DrawerFrame({
  children,
  className,
  side = "right",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  side?: "left" | "right";
}) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col overflow-y-auto border bg-white text-[#333333]",
        side === "left" ? "left-0 border-r shadow-[18px_0_44px_rgba(31,41,55,0.12)]" : "right-0 border-l shadow-[-24px_0_60px_rgba(31,41,55,0.16)]",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
