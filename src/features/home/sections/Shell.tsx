import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen overflow-x-hidden bg-[#EDECEC] pb-20 font-sans text-[#333333]">{children}</div>;
}
