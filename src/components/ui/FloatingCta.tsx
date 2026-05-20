import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { cn } from "./cn";

export function FloatingCta({
  badge,
  children,
  className,
  icon,
  leadingIcon,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    badge?: ReactNode;
    children: ReactNode;
    icon?: ReactNode;
    leadingIcon?: ReactNode;
  }) {
  const content = (
    <>
      {badge ? (
        <span className="flex items-center gap-1.5 border border-white/35 px-2 py-1 text-[9px] font-bold uppercase leading-none text-white/60">
          {badge}
        </span>
      ) : null}
      {leadingIcon}
      <span className="cta-shine-text shrink-0 whitespace-nowrap text-[14px] font-black leading-none sm:text-[15px]">{children}</span>
      {icon}
    </>
  );

  if ("href" in props && props.href) {
    return (
      <a
        className={cn("fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]", className)}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cn("fixed bottom-6 right-6 z-30 flex items-center gap-3 border border-white/25 bg-[#111116] px-3.5 py-3 text-left text-[#d9d9d9] shadow-[0_12px_28px_rgba(0,0,0,0.24)] transition duration-200 hover:-translate-y-0.5 hover:border-white/40 hover:bg-[#17171d] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111116]", className)}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
