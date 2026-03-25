import type { ReactNode } from "react";

export function HomeShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#212121] pb-20 font-sans text-[#333333]">{children}</div>;
}
