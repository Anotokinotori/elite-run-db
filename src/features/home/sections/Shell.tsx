import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f5f6f8] pb-20 font-sans text-[#333333]">{children}</div>;
}
