import type { ReactNode } from "react";

import { cn } from "./cn";
import { IconButton } from "./IconButton";

export function ModalFrame({
  children,
  className,
  onClose,
  title,
  description,
}: {
  children: ReactNode;
  className?: string;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/35 px-4 py-6" onClick={onClose}>
      <div
        className={cn("flex max-h-[calc(100vh-48px)] w-full max-w-[760px] flex-col overflow-hidden rounded-[24px] border border-[#ebebeb] bg-white p-5 text-[#333333] shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-6", className)}
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#ebebeb] pb-5">
            <div>
              <h3 className="text-[24px] font-bold leading-tight text-[#111827] md:text-[30px]">{title}</h3>
              {description ? <p className="mt-2 text-[14px] leading-[1.7] text-[#7b7b8d] md:text-[15px]">{description}</p> : null}
            </div>
            <IconButton type="button" onClick={onClose} aria-label="閉じる">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6 18 18" />
                <path d="M18 6 6 18" />
              </svg>
            </IconButton>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
